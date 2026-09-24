import pool, { withTransaction } from '../db/index.js'
import { HttpError } from '../utils/errors.js'
import { writeAudit } from '../utils/audit.js'
import { listDocumentsForOwners } from './uploadsService.js'

const roleLabels = {
  doctor: 'Doktor / Yönetici',
  nurse: 'Hemşire',
  secretary: 'Tıbbi Sekreter',
  advisor: 'Hasta Danışmanı',
  accounting: 'Muhasebe Sorumlusu',
  support: 'Destek Personeli',
}

const buildInitials = (name) => name
  .trim()
  .split(/\s+/)
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0]?.toLocaleUpperCase('tr-TR') || '')
  .join('')

const buildSchedule = (workDays, start, end, department) => {
  const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma']
  return days.map((day, index) => ({
    day,
    shift: `${start} - ${end}`,
    location: department || 'Ana Klinik',
    status: 'Planlandı',
    sortOrder: index,
  }))
}

const mapStaff = (row, extras = {}) => ({
  id: row.staff_no,
  databaseId: row.id,
  name: row.full_name,
  initials: row.initials,
  role: row.role,
  roleType: row.role_type,
  department: row.department,
  status: row.status,
  phone: row.phone,
  email: row.email,
  birthDate: row.birth_date || 'Belirtilmedi',
  hireDate: row.hire_date || 'Belirtilmedi',
  workType: row.work_type,
  workDays: row.work_days,
  workHours: {
    start: String(row.work_start).slice(0, 5),
    end: String(row.work_end).slice(0, 5),
  },
  address: row.address || 'Adres bilgisi eklenmedi.',
  emergencyContact: {
    name: row.emergency_name || 'Belirtilmedi',
    phone: row.emergency_phone || 'Belirtilmedi',
  },
  note: row.note || '',
  quickStats: extras.quickStats || [
    { label: 'Aylık Vardiya', value: '0', meta: 'Kayıt' },
    { label: 'Sorumlu Hasta', value: '0', meta: 'Atanmadı' },
    { label: 'Kalan İzin', value: `${row.leave_remaining} gün`, meta: 'Yıllık' },
    { label: 'Son Aktivite', value: extras.lastActivity || 'Kayıt', meta: '' },
  ],
  roleDetails: {
    title: row.role_title || 'Personel Bilgileri',
    items: row.role_items || [],
  },
  leaveSummary: {
    annual: row.leave_annual,
    used: row.leave_used,
    remaining: row.leave_remaining,
    report: row.leave_report,
  },
  leaves: extras.leaves || [],
  activities: extras.activities || [],
  documents: extras.documents || [],
  schedule: extras.schedule || [],
})

export async function listStaff() {
  const result = await pool.query(`
    SELECT *
    FROM staff
    ORDER BY id
  `)

  return result.rows.map((row) => mapStaff(row))
}

export async function listDoctors() {
  const result = await pool.query(`
    SELECT id, staff_no, full_name
    FROM staff
    WHERE role_type = 'doctor' AND status <> 'İşten Ayrıldı'
    ORDER BY id
  `)

  return result.rows.map((row) => ({
    id: row.id,
    staffNo: row.staff_no,
    name: row.full_name,
  }))
}

export async function getStaffByNo(staffNo) {
  const result = await pool.query('SELECT * FROM staff WHERE staff_no = $1', [staffNo])
  if (result.rowCount === 0) {
    throw new HttpError(404, 'Personel bulunamadı.')
  }

  const row = result.rows[0]
  const [schedules, leaves, activities, documents] = await Promise.all([
    pool.query(
      'SELECT day_name AS day, shift, location, status FROM staff_schedules WHERE staff_id = $1 ORDER BY sort_order, id',
      [row.id]
    ),
    pool.query(
      `
        SELECT leave_no AS id, leave_type AS type, range_label AS range, days_label AS days, status
        FROM staff_leaves
        WHERE staff_id = $1
        ORDER BY id DESC
      `,
      [row.id]
    ),
    pool.query(
      `
        SELECT activity_no AS id, activity_date AS date, activity_time AS time, title, description
        FROM staff_activities
        WHERE staff_id = $1
        ORDER BY id DESC
      `,
      [row.id]
    ),
    listDocumentsForOwners('staff', [row.id]),
  ])

  return mapStaff(row, {
    schedule: schedules.rows,
    leaves: leaves.rows,
    activities: activities.rows,
    documents: documents.map((document) => ({
      id: document.id,
      name: document.name,
      type: document.type,
      date: document.uploadedAt,
      status: document.status,
      url: document.url,
    })),
  })
}

export async function createStaff(payload, actor) {
  const {
    name,
    roleType,
    roleNote,
    department,
    phone,
    email,
    birthDate,
    hireDate,
    workType = 'Tam Zamanlı',
    workDays,
    startTime,
    endTime,
    address,
    emergencyName,
    emergencyPhone,
    note,
  } = payload

  if (!name?.trim() || !roleType || !department?.trim() || !phone?.trim() || !email?.trim() || !workDays?.trim() || !startTime || !endTime) {
    throw new HttpError(400, 'Ad soyad, rol, departman, telefon, e-posta ve çalışma bilgileri zorunludur.')
  }

  const createdStaffNo = await withTransaction(async (client) => {
    if (roleType === 'doctor') {
      const existingDoctor = await client.query(
        `SELECT 1 FROM staff WHERE role_type = 'doctor' AND status <> 'İşten Ayrıldı'`
      )
      if (existingDoctor.rowCount > 0) {
        throw new HttpError(409, 'Sistemde yalnızca bir doktor kaydı bulunabilir.')
      }
    }

    const inserted = await client.query(
      `
        INSERT INTO staff (
          staff_no, full_name, initials, role, role_type, department, status,
          phone, email, birth_date, hire_date, work_type, work_days, work_start,
          work_end, address, emergency_name, emergency_phone, note, role_title, role_items
        )
        VALUES (
          'PRS-' || lpad(nextval('staff_no_seq')::text, 3, '0'),
          $1, $2, $3, $4, $5, 'Aktif', $6, $7, NULLIF($8, ''), NULLIF($9, ''),
          $10, $11, $12::TIME, $13::TIME, NULLIF($14, ''), NULLIF($15, ''),
          NULLIF($16, ''), NULLIF($17, ''), $18, $19::jsonb
        )
        RETURNING *
      `,
      [
        name.trim(),
        buildInitials(name),
        roleLabels[roleType] || roleType,
        roleType,
        department.trim(),
        phone.trim(),
        email.trim(),
        birthDate || '',
        hireDate || '',
        workType,
        workDays.trim(),
        startTime,
        endTime,
        address || '',
        emergencyName || '',
        emergencyPhone || '',
        note || '',
        'Personel Bilgileri',
        JSON.stringify([
          { label: 'Sorumlu Alan', value: department.trim() },
          { label: 'Çalışma Şekli', value: workType },
          { label: 'Yetkinlik', value: roleNote?.trim() || 'Henüz eklenmedi' },
          { label: 'Durum', value: 'Yeni personel kaydı' },
        ]),
      ]
    )

    const staff = inserted.rows[0]
    const schedule = buildSchedule(workDays, startTime, endTime, department)
    for (const item of schedule) {
      await client.query(
        `
          INSERT INTO staff_schedules (staff_id, day_name, shift, location, status, sort_order)
          VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [staff.id, item.day, item.shift, item.location, item.status, item.sortOrder]
      )
    }

    await client.query(
      `
        INSERT INTO staff_activities (staff_id, activity_no, activity_date, activity_time, title, description)
        VALUES ($1, 'ACT-' || $2, TO_CHAR(CURRENT_DATE, 'DD.MM.YYYY'), TO_CHAR(CURRENT_TIME, 'HH24:MI'), $3, $4)
      `,
      [staff.id, staff.staff_no.replace('PRS-', ''), 'Personel kaydı oluşturuldu', `${name.trim()} personel kaydı açıldı.`]
    )

    await writeAudit(client, {
      ...actor,
      action: 'Personel kaydı oluşturuldu',
      page: 'Personeller',
      module: 'Personel Yönetimi',
      targetType: 'Personel',
      targetId: staff.staff_no,
      targetName: name.trim(),
      targetRoute: `/personeller/${staff.staff_no}`,
      eventCode: 'STAFF_CREATED',
      description: `${name.trim()} personel kaydı oluşturuldu.`,
    })

    return staff.staff_no
  })

  return getStaffByNo(createdStaffNo)
}

export async function updateStaff(staffNo, payload, actor) {
  const existing = await getStaffByNo(staffNo)

  await pool.query(
    `
      UPDATE staff
      SET
        phone = $2,
        email = $3,
        address = NULLIF($4, ''),
        department = $5,
        status = $6,
        work_type = $7,
        work_days = $8,
        work_start = $9::TIME,
        work_end = $10::TIME,
        emergency_name = NULLIF($11, ''),
        emergency_phone = NULLIF($12, ''),
        note = NULLIF($13, ''),
        updated_at = CURRENT_TIMESTAMP
      WHERE staff_no = $1
    `,
    [
      staffNo,
      payload.phone.trim(),
      payload.email.trim(),
      payload.address || '',
      payload.department.trim(),
      payload.status,
      payload.workType,
      payload.workDays.trim(),
      payload.workHours.start,
      payload.workHours.end,
      payload.emergencyContact?.name || '',
      payload.emergencyContact?.phone || '',
      payload.note || '',
    ]
  )

  await writeAudit(pool, {
    ...actor,
    action: 'Personel güncellendi',
    page: 'Personeller',
    module: 'Personel Yönetimi',
    targetType: 'Personel',
    targetId: staffNo,
    targetName: existing.name,
    eventCode: 'STAFF_UPDATED',
    description: `${existing.name} personel kaydı güncellendi.`,
  })

  return getStaffByNo(staffNo)
}

export async function updateStaffStatus(staffNo, status, actor) {
  const valid = ['Aktif', 'Pasif', 'İzinli', 'Raporlu', 'İşten Ayrıldı']
  if (!valid.includes(status)) {
    throw new HttpError(400, 'Personel durumu geçersiz.')
  }

  const result = await pool.query(
    `
      UPDATE staff
      SET status = $2, updated_at = CURRENT_TIMESTAMP
      WHERE staff_no = $1
      RETURNING staff_no AS id, status
    `,
    [staffNo, status]
  )

  if (result.rowCount === 0) {
    throw new HttpError(404, 'Personel bulunamadı.')
  }

  await writeAudit(pool, {
    ...actor,
    action: 'Personel durumu güncellendi',
    page: 'Personeller',
    module: 'Personel Yönetimi',
    targetType: 'Personel',
    targetId: staffNo,
    eventCode: 'STAFF_STATUS_UPDATED',
    description: `${staffNo} durumu ${status} olarak güncellendi.`,
    afterSummary: { status },
  })

  return result.rows[0]
}
