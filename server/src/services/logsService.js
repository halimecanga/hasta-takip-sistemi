import pool from '../db/index.js'
import { HttpError } from '../utils/errors.js'
import { formatDisplayDate } from '../utils/dates.js'

const mapLog = (row) => ({
  id: row.log_no,
  staffId: row.staff_no || '',
  user: row.actor_name,
  role: row.actor_role || 'Sistem',
  action: row.action,
  page: row.page,
  module: row.module,
  targetType: row.target_type || '',
  targetId: row.target_id || '',
  targetName: row.target_name || '',
  date: formatDisplayDate(row.created_at),
  dateIso: String(row.created_at).slice(0, 10),
  time: row.time_label,
  status: row.status,
  description: row.description || '',
  ipAddress: row.ip_address || '',
  device: row.device || '',
  severity: row.severity,
  eventCode: row.event_code || '',
  requestId: row.request_id || '',
  sessionId: row.session_id || '',
  duration: row.duration || '',
  errorMessage: row.error_message || '',
  targetRoute: row.target_route || '',
  beforeSummary: row.before_summary,
  afterSummary: row.after_summary,
})

export async function listLogs({ search = '', status = '', staff = '', date = '' } = {}) {
  const result = await pool.query(
    `
      SELECT
        activity_logs.*,
        staff.staff_no,
        TO_CHAR(activity_logs.created_at, 'HH24:MI') AS time_label
      FROM activity_logs
      LEFT JOIN staff ON staff.id = activity_logs.staff_id
      WHERE
        ($1 = '' OR activity_logs.actor_name ILIKE '%' || $1 || '%'
          OR activity_logs.action ILIKE '%' || $1 || '%'
          OR activity_logs.page ILIKE '%' || $1 || '%'
          OR COALESCE(activity_logs.target_name, '') ILIKE '%' || $1 || '%'
          OR COALESCE(activity_logs.target_id, '') ILIKE '%' || $1 || '%')
        AND ($2 = '' OR activity_logs.status = $2)
        AND ($3 = '' OR activity_logs.actor_name = $3)
        AND ($4 = '' OR activity_logs.created_at::DATE = $4::DATE)
      ORDER BY activity_logs.created_at DESC, activity_logs.id DESC
    `,
    [search.trim(), status, staff, date]
  )

  return result.rows.map(mapLog)
}

export async function getLogByNo(logNo) {
  const result = await pool.query(
    `
      SELECT
        activity_logs.*,
        staff.staff_no,
        TO_CHAR(activity_logs.created_at, 'HH24:MI') AS time_label
      FROM activity_logs
      LEFT JOIN staff ON staff.id = activity_logs.staff_id
      WHERE activity_logs.log_no = $1
    `,
    [logNo]
  )

  if (result.rowCount === 0) {
    throw new HttpError(404, 'İşlem kaydı bulunamadı.')
  }

  return mapLog(result.rows[0])
}
