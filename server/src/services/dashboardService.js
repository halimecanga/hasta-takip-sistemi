import pool from '../db/index.js'
import { formatCurrency } from '../utils/money.js'
import { formatDisplayDate } from '../utils/dates.js'

export async function getDashboard() {
  const [
    patients,
    todayAppointments,
    examStats,
    prescriptions,
    payments,
    collections,
    upcoming,
    recentAppointments,
    monthly,
    appointmentStatuses,
    staffCount,
    recentLogs,
  ] = await Promise.all([
    pool.query(`SELECT COUNT(*)::INTEGER AS total FROM patients WHERE status = 'Aktif'`),
    pool.query(`SELECT COUNT(*)::INTEGER AS total FROM appointments WHERE appointment_date = CURRENT_DATE AND status <> 'İptal Edildi'`),
    pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE status IN ('Bekliyor', 'Taslak'))::INTEGER AS pending,
        COUNT(*) FILTER (WHERE status = 'Tamamlandı')::INTEGER AS completed
      FROM examinations
    `),
    pool.query(`SELECT COUNT(*)::INTEGER AS total FROM prescriptions WHERE status = 'Aktif'`),
    pool.query(`SELECT COUNT(*)::INTEGER AS total FROM examination_payments WHERE payment_status IN ('Ödeme Bekliyor', 'Kısmi Ödeme')`),
    pool.query(`
      SELECT
        COALESCE(SUM(paid_amount) FILTER (WHERE transaction_date = CURRENT_DATE), 0) AS daily,
        COALESCE(SUM(paid_amount) FILTER (WHERE date_trunc('month', transaction_date) = date_trunc('month', CURRENT_DATE)), 0) AS monthly
      FROM examination_payments
    `),
    pool.query(`
      SELECT
        patients.full_name AS patient,
        TO_CHAR(examinations.control_date, 'DD.MM.YYYY') AS date,
        examinations.diagnosis,
        examinations.status
      FROM examinations
      INNER JOIN patients ON patients.id = examinations.patient_id
      WHERE examinations.needs_control = TRUE
        AND examinations.control_date IS NOT NULL
        AND examinations.control_date >= CURRENT_DATE
      ORDER BY examinations.control_date
      LIMIT 5
    `),
    pool.query(`
      SELECT
        patients.full_name AS patient,
        TO_CHAR(appointments.appointment_date, 'DD.MM.YYYY') AS date,
        TO_CHAR(appointments.appointment_time, 'HH24:MI') AS time,
        appointments.status
      FROM appointments
      INNER JOIN patients ON patients.id = appointments.patient_id
      ORDER BY appointments.appointment_date DESC, appointments.appointment_time DESC
      LIMIT 4
    `),
    pool.query(`
      SELECT
        TO_CHAR(month_start, 'TMMon') AS month,
        COALESCE(patient_count, 0)::INTEGER AS patients,
        COALESCE(income, 0)::NUMERIC AS income
      FROM generate_series(
        date_trunc('month', CURRENT_DATE) - INTERVAL '5 months',
        date_trunc('month', CURRENT_DATE),
        INTERVAL '1 month'
      ) AS month_start
      LEFT JOIN LATERAL (
        SELECT
          COUNT(DISTINCT patient_id) AS patient_count
        FROM examinations
        WHERE date_trunc('month', examination_date) = month_start
      ) exam_stats ON TRUE
      LEFT JOIN LATERAL (
        SELECT SUM(paid_amount) AS income
        FROM examination_payments
        WHERE date_trunc('month', transaction_date) = month_start
      ) payment_stats ON TRUE
    `),
    pool.query(`
      SELECT status AS name, COUNT(*)::INTEGER AS value
      FROM appointments
      GROUP BY status
    `),
    pool.query(`SELECT COUNT(*)::INTEGER AS total FROM staff WHERE status = 'Aktif'`),
    pool.query(`
      SELECT
        actor_name AS "user",
        action,
        TO_CHAR(created_at, 'DD.MM.YYYY HH24:MI') AS "createdAt"
      FROM activity_logs
      ORDER BY created_at DESC
      LIMIT 5
    `),
  ])

  const statusColors = {
    Onaylandı: '#f97316',
    Tamamlandı: '#22c55e',
    Bekliyor: '#f59e0b',
    'İptal Edildi': '#ef4444',
  }

  return {
    stats: {
      activePatients: patients.rows[0].total,
      todayAppointments: todayAppointments.rows[0].total,
      pendingExaminations: examStats.rows[0].pending,
      completedExaminations: examStats.rows[0].completed,
      activePrescriptions: prescriptions.rows[0].total,
      pendingPayments: payments.rows[0].total,
      dailyCollection: formatCurrency(collections.rows[0].daily),
      monthlyCollection: formatCurrency(collections.rows[0].monthly),
      activeStaff: staffCount.rows[0].total,
    },
    recentAppointments: recentAppointments.rows,
    upcomingControls: upcoming.rows,
    monthlyPatients: monthly.rows.map((row) => ({
      month: row.month,
      patients: Number(row.patients),
      income: Number(row.income),
    })),
    appointmentStatus: appointmentStatuses.rows.map((row) => ({
      name: row.name,
      value: row.value,
      color: statusColors[row.name] || '#94a3b8',
    })),
    recentLogs: recentLogs.rows,
  }
}
