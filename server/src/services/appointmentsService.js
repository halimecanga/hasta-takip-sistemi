import pool, { withTransaction } from '../db/index.js'
import { HttpError } from '../utils/errors.js'
import { formatDisplayDate, getWeekday, overlaps, timeToMinutes } from '../utils/dates.js'
import { writeAudit } from '../utils/audit.js'

const VALID_STATUSES = ['Bekliyor', 'Onaylandı', 'Tamamlandı', 'İptal Edildi']

const mapAppointment = (row) => ({
  id: row.appointment_no,
  databaseId: row.id,
  patientNo: row.patient_no,
  patient: row.patient_name,
  phone: row.phone,
  email: row.email,
  date: formatDisplayDate(row.appointment_date),
  dateIso: row.date_iso,
  time: row.time_label,
  type: row.appointment_type,
  department: row.appointment_type,
  status: row.status,
  duration: row.duration_minutes,
  priority: row.priority,
  reason: row.reason,
  complaint: row.complaint || '',
  isControl: row.is_control,
  previousVisitId: row.previous_visit_id || '',
  doctor: row.doctor_name,
  doctorId: row.doctor_id,
  reminderMethod: row.reminder_method,
  reminderTime: row.reminder_time,
  note: row.note || '',
  doctorNote: row.doctor_note || '',
})

const appointmentSelect = `
  SELECT
    appointments.id,
    appointments.appointment_no,
    patients.patient_no,
    patients.full_name AS patient_name,
    patients.phone,
    patients.email,
    TO_CHAR(appointments.appointment_date, 'YYYY-MM-DD') AS date_iso,
    TO_CHAR(appointments.appointment_time, 'HH24:MI') AS time_label,
    appointments.appointment_date,
    appointments.duration_minutes,
    appointments.appointment_type,
    appointments.status,
    appointments.priority,
    appointments.reason,
    appointments.complaint,
    appointments.is_control,
    appointments.previous_visit_id,
    appointments.doctor_id,
    COALESCE(staff.full_name, 'Dr. Cumhur Kesemenli') AS doctor_name,
    appointments.reminder_method,
    appointments.reminder_time,
    appointments.note,
    appointments.doctor_note
  FROM appointments
  INNER JOIN patients ON patients.id = appointments.patient_id
  LEFT JOIN staff ON staff.id = appointments.doctor_id
`

function validateSchedule({ dateIso, time, duration }) {
  const durationMinutes = Number(duration)
  const start = timeToMinutes(time)
  const end = start + durationMinutes
  const day = getWeekday(dateIso)
  const today = new Date()
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  if (dateIso < todayIso) {
    throw new HttpError(400, 'Geçmiş bir tarihe randevu oluşturamazsınız.')
  }

  if (day === 0) {
    throw new HttpError(400, 'Pazar günü klinik kapalıdır.')
  }

  const clinicStart = 9 * 60
  const clinicEnd = day === 6 ? 14 * 60 : 18 * 60
  if (start < clinicStart || end > clinicEnd) {
    throw new HttpError(400, 'Klinik çalışma saatleri dışında randevu oluşturamazsınız.')
  }

  if (overlaps(start, end, 12 * 60 + 30, 13 * 60 + 30)) {
    throw new HttpError(400, 'Mola saatleri içinde randevu oluşturamazsınız.')
  }
}

async function assertNoConflict(client, { dateIso, time, duration, patientId, doctorId, excludeId }) {
  const start = timeToMinutes(time)
  const end = start + Number(duration)
  const result = await client.query(
    `
      SELECT
        appointment_no,
        patient_id,
        doctor_id,
        TO_CHAR(appointment_time, 'HH24:MI') AS time_label,
        duration_minutes
      FROM appointments
      WHERE appointment_date = $1::DATE
        AND status <> 'İptal Edildi'
        AND ($2::BIGINT IS NULL OR id <> $2)
    `,
    [dateIso, excludeId || null]
  )

  for (const row of result.rows) {
    const existingStart = timeToMinutes(row.time_label)
    const existingEnd = existingStart + Number(row.duration_minutes || 30)
    const samePatientSameTime = row.patient_id === patientId && row.time_label === time
    const sameDoctor = !doctorId || !row.doctor_id || Number(row.doctor_id) === Number(doctorId)

    if (samePatientSameTime || (sameDoctor && overlaps(start, end, existingStart, existingEnd))) {
      throw new HttpError(409, 'Bu saat aralığında başka bir randevu bulunmaktadır.')
    }
  }
}

export async function listAppointments({ search = '', status = '', doctor = '', date = '', patientNo = '' } = {}) {
  const result = await pool.query(
    `
      ${appointmentSelect}
      WHERE
        ($1 = '' OR patients.full_name ILIKE '%' || $1 || '%'
          OR appointments.appointment_type ILIKE '%' || $1 || '%'
          OR patients.patient_no ILIKE '%' || $1 || '%')
        AND ($2 = '' OR appointments.status = $2)
        AND ($3 = '' OR COALESCE(staff.full_name, 'Dr. Cumhur Kesemenli') = $3)
        AND ($4 = '' OR appointments.appointment_date = $4::DATE)
        AND ($5 = '' OR patients.patient_no = $5)
      ORDER BY appointments.appointment_date ASC, appointments.appointment_time ASC
    `,
    [search.trim(), status, doctor, date, patientNo]
  )

  return result.rows.map(mapAppointment)
}

export async function getAppointmentByNo(appointmentNo) {
  const result = await pool.query(
    `${appointmentSelect} WHERE appointments.appointment_no = $1`,
    [appointmentNo]
  )

  if (result.rowCount === 0) {
    throw new HttpError(404, 'Randevu bulunamadı.')
  }

  return mapAppointment(result.rows[0])
}

export async function createAppointment(payload, actor) {
  const {
    patientNo,
    dateIso,
    time,
    type,
    status = 'Bekliyor',
    duration = 30,
    priority = 'Normal',
    reason,
    complaint,
    isControl = false,
    previousVisitId,
    doctorNote,
    reminderMethod = 'SMS',
    reminderTime = '1 gün önce',
    note,
    doctorId,
  } = payload

  if (!patientNo || !dateIso || !time || !type || !reason?.trim()) {
    throw new HttpError(400, 'Hasta, tarih, saat, muayene türü ve randevu nedeni zorunludur.')
  }

  if (!VALID_STATUSES.includes(status)) {
    throw new HttpError(400, 'Randevu durumu geçersiz.')
  }

  validateSchedule({ dateIso, time, duration })

  const createdNo = await withTransaction(async (client) => {
    const patientResult = await client.query(
      'SELECT id, full_name FROM patients WHERE patient_no = $1',
      [patientNo]
    )

    if (patientResult.rowCount === 0) {
      throw new HttpError(404, 'Randevu için hasta bulunamadı.')
    }

    const patientId = patientResult.rows[0].id
    await assertNoConflict(client, {
      dateIso,
      time,
      duration,
      patientId,
      doctorId,
    })

    const result = await client.query(
      `
        INSERT INTO appointments (
          appointment_no, patient_id, doctor_id, appointment_date, appointment_time,
          duration_minutes, appointment_type, status, priority, reason, complaint,
          is_control, previous_visit_id, doctor_note, reminder_method, reminder_time, note
        )
        VALUES (
          'RND-' || to_char(CURRENT_DATE, 'YYYY') || '-' || lpad(nextval('appointment_no_seq')::text, 3, '0'),
          $1, $2, $3::DATE, $4::TIME, $5, $6, $7, $8, $9, NULLIF($10, ''),
          $11, NULLIF($12, ''), NULLIF($13, ''), $14, $15, NULLIF($16, '')
        )
        RETURNING appointment_no
      `,
      [
        patientId,
        doctorId || null,
        dateIso,
        time,
        Number(duration),
        type,
        status,
        priority,
        reason.trim(),
        complaint?.trim() || '',
        isControl === true,
        previousVisitId || '',
        doctorNote?.trim() || '',
        reminderMethod,
        reminderTime,
        note?.trim() || '',
      ]
    )

    await writeAudit(client, {
      ...actor,
      action: 'Yeni randevu oluşturuldu',
      page: 'Randevular',
      module: 'Randevu Yönetimi',
      targetType: 'Randevu',
      targetId: result.rows[0].appointment_no,
      targetName: patientResult.rows[0].full_name,
      targetRoute: '/randevular',
      eventCode: 'APPOINTMENT_CREATED',
      description: `${patientResult.rows[0].full_name} için randevu oluşturuldu.`,
    })

    return result.rows[0].appointment_no
  })

  return getAppointmentByNo(createdNo)
}

export async function updateAppointment(appointmentNo, payload, actor) {
  const existing = await getAppointmentByNo(appointmentNo)
  validateSchedule({
    dateIso: payload.dateIso,
    time: payload.time,
    duration: payload.duration,
  })

  return withTransaction(async (client) => {
    const patientResult = await client.query(
      'SELECT id FROM patients WHERE patient_no = $1',
      [payload.patientNo]
    )
    if (patientResult.rowCount === 0) {
      throw new HttpError(404, 'Randevu için hasta bulunamadı.')
    }

    await assertNoConflict(client, {
      dateIso: payload.dateIso,
      time: payload.time,
      duration: payload.duration,
      patientId: patientResult.rows[0].id,
      doctorId: payload.doctorId,
      excludeId: existing.databaseId,
    })

    await client.query(
      `
        UPDATE appointments
        SET
          patient_id = $2,
          doctor_id = $3,
          appointment_date = $4::DATE,
          appointment_time = $5::TIME,
          duration_minutes = $6,
          appointment_type = $7,
          status = $8,
          priority = $9,
          reason = $10,
          complaint = NULLIF($11, ''),
          is_control = $12,
          previous_visit_id = NULLIF($13, ''),
          doctor_note = NULLIF($14, ''),
          reminder_method = $15,
          reminder_time = $16,
          note = NULLIF($17, ''),
          updated_at = CURRENT_TIMESTAMP
        WHERE appointment_no = $1
      `,
      [
        appointmentNo,
        patientResult.rows[0].id,
        payload.doctorId || null,
        payload.dateIso,
        payload.time,
        Number(payload.duration),
        payload.type,
        payload.status,
        payload.priority,
        payload.reason.trim(),
        payload.complaint?.trim() || '',
        payload.isControl === true,
        payload.previousVisitId || '',
        payload.doctorNote?.trim() || '',
        payload.reminderMethod,
        payload.reminderTime,
        payload.note?.trim() || '',
      ]
    )

    await writeAudit(client, {
      ...actor,
      action: 'Randevu güncellendi',
      page: 'Randevular',
      module: 'Randevu Yönetimi',
      targetType: 'Randevu',
      targetId: appointmentNo,
      eventCode: 'APPOINTMENT_UPDATED',
      description: `${appointmentNo} randevusu güncellendi.`,
    })

    return appointmentNo
  })

  return getAppointmentByNo(appointmentNo)
}

export async function updateAppointmentStatus(appointmentNo, status, actor) {
  if (!VALID_STATUSES.includes(status)) {
    throw new HttpError(400, 'Randevu durumu geçersiz.')
  }

  const result = await pool.query(
    `
      UPDATE appointments
      SET status = $2, updated_at = CURRENT_TIMESTAMP
      WHERE appointment_no = $1
      RETURNING id, appointment_no, status
    `,
    [appointmentNo, status]
  )

  if (result.rowCount === 0) {
    throw new HttpError(404, 'Randevu bulunamadı.')
  }

  await pool.query(
    `
      INSERT INTO appointment_status_history (appointment_id, old_status, new_status)
      VALUES ($1, NULL, $2)
    `,
    [result.rows[0].id, status]
  )

  await writeAudit(pool, {
    ...actor,
    action: `Randevu ${status.toLocaleLowerCase('tr-TR')}`,
    page: 'Randevular',
    module: 'Randevu Yönetimi',
    targetType: 'Randevu',
    targetId: appointmentNo,
    eventCode: 'APPOINTMENT_STATUS_UPDATED',
    description: `${appointmentNo} durumu ${status} olarak güncellendi.`,
    afterSummary: { status },
  })

  return getAppointmentByNo(appointmentNo)
}
