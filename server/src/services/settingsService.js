import { randomBytes, scryptSync } from 'node:crypto'
import pool from '../db/index.js'
import { HttpError } from '../utils/errors.js'
import { writeAudit } from '../utils/audit.js'

const hashPassword = (password, salt = randomBytes(16).toString('hex')) => ({
  salt,
  hash: scryptSync(password, salt, 64).toString('hex'),
})

const createUnusablePasswordHash = () => hashPassword(randomBytes(32).toString('hex'))

export async function getSettings() {
  const result = await pool.query('SELECT * FROM clinic_settings WHERE id = 1')
  if (result.rowCount === 0) {
    throw new HttpError(404, 'Klinik ayarları bulunamadı.')
  }

  const row = result.rows[0]
  return {
    clinicName: row.clinic_name,
    phone: row.phone,
    email: row.email,
    taxNumber: row.tax_number,
    address: row.address,
    appointmentReminders: row.appointment_reminders,
    testNotifications: row.test_notifications,
    dailySummaryEmail: row.daily_summary_email,
    theme: row.theme,
    reportAccess: row.report_access,
    staffPriceEdit: row.staff_price_edit,
    logView: row.log_view,
  }
}

export async function updateSettings(payload, actor) {
  const result = await pool.query(
    `
      UPDATE clinic_settings
      SET
        clinic_name = $1,
        phone = $2,
        email = $3,
        tax_number = $4,
        address = $5,
        appointment_reminders = $6,
        test_notifications = $7,
        daily_summary_email = $8,
        theme = $9,
        report_access = $10,
        staff_price_edit = $11,
        log_view = $12,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
      RETURNING *
    `,
    [
      payload.clinicName,
      payload.phone,
      payload.email,
      payload.taxNumber,
      payload.address,
      payload.appointmentReminders !== false,
      payload.testNotifications !== false,
      payload.dailySummaryEmail === true,
      payload.theme || 'light',
      payload.reportAccess !== false,
      payload.staffPriceEdit === true,
      payload.logView !== false,
    ]
  )

  if (result.rowCount === 0) {
    throw new HttpError(404, 'Klinik ayarları bulunamadı.')
  }

  await writeAudit(pool, {
    ...actor,
    action: 'Klinik ayarları güncellendi',
    page: 'Ayarlar',
    module: 'Ayarlar',
    targetType: 'Ayarlar',
    targetId: 'clinic',
    eventCode: 'SETTINGS_UPDATED',
    description: 'Klinik ayarları kaydedildi.',
  })

  return getSettings()
}

export async function getProfile() {
  const result = await pool.query('SELECT * FROM user_profiles WHERE id = 1')
  if (result.rowCount === 0) {
    throw new HttpError(404, 'Profil bulunamadı.')
  }

  const row = result.rows[0]
  return {
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    role: row.role,
    specialty: row.specialty,
    diplomaNo: row.diploma_no,
  }
}

export async function updateProfile(payload, actor) {
  await pool.query(
    `
      UPDATE user_profiles
      SET
        full_name = $1,
        email = $2,
        phone = $3,
        role = $4,
        specialty = $5,
        diploma_no = $6,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `,
    [
      payload.fullName,
      payload.email,
      payload.phone,
      payload.role,
      payload.specialty,
      payload.diplomaNo,
    ]
  )

  await writeAudit(pool, {
    ...actor,
    action: 'Profil güncellendi',
    page: 'Profil',
    module: 'Profil',
    targetType: 'Profil',
    targetId: 'profile',
    eventCode: 'PROFILE_UPDATED',
    description: 'Yönetici profil bilgileri güncellendi.',
  })

  return getProfile()
}

export async function updatePassword() {
  throw new HttpError(403, 'Kimlik doğrulama sistemi bağlanmadan şifre değiştirilemez.')
}

export async function createSupportTicket(payload, actor) {
  if (!payload.subject?.trim() || !payload.category || !payload.message?.trim()) {
    throw new HttpError(400, 'Konu, kategori ve mesaj zorunludur.')
  }

  const result = await pool.query(
    `
      INSERT INTO support_tickets (ticket_no, subject, category, message)
      VALUES (
        'DST-' || to_char(CURRENT_DATE, 'YYYY') || '-' || lpad(nextval('support_ticket_no_seq')::text, 4, '0'),
        $1, $2, $3
      )
      RETURNING ticket_no AS id, subject, category, status, created_at
    `,
    [payload.subject.trim(), payload.category, payload.message.trim()]
  )

  await writeAudit(pool, {
    ...actor,
    action: 'Destek talebi oluşturuldu',
    page: 'Destek',
    module: 'Destek',
    targetType: 'Destek Talebi',
    targetId: result.rows[0].id,
    eventCode: 'SUPPORT_CREATED',
    description: 'Yeni destek talebi kaydedildi.',
  })

  return result.rows[0]
}

export async function listSupportTickets() {
  const result = await pool.query(`
    SELECT ticket_no AS id, subject, category, status, created_at AS "createdAt"
    FROM support_tickets
    ORDER BY id DESC
  `)
  return result.rows
}

export { hashPassword, createUnusablePasswordHash }
