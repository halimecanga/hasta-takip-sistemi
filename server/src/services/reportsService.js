import pool from '../db/index.js'
import { formatCurrency } from '../utils/money.js'

export async function getReports({ from, to } = {}) {
  const fromDate = from || null
  const toDate = to || null

  const [summary, monthly, services, doctors, appointments] = await Promise.all([
    pool.query(
      `
        SELECT
          COUNT(*)::INTEGER AS examinations,
          COUNT(DISTINCT patient_id)::INTEGER AS patients,
          COALESCE((
            SELECT SUM(paid_amount)
            FROM examination_payments
            INNER JOIN examinations ON examinations.id = examination_payments.examination_id
            WHERE ($1::DATE IS NULL OR examination_payments.transaction_date >= $1::DATE)
              AND ($2::DATE IS NULL OR examination_payments.transaction_date <= $2::DATE)
          ), 0) AS collected,
          COALESCE((
            SELECT SUM(remaining_amount)
            FROM examination_payments
            INNER JOIN examinations ON examinations.id = examination_payments.examination_id
            WHERE ($1::DATE IS NULL OR examination_payments.transaction_date >= $1::DATE)
              AND ($2::DATE IS NULL OR examination_payments.transaction_date <= $2::DATE)
          ), 0) AS remaining
        FROM examinations
        WHERE ($1::DATE IS NULL OR examination_date >= $1::DATE)
          AND ($2::DATE IS NULL OR examination_date <= $2::DATE)
      `,
      [fromDate, toDate]
    ),
    pool.query(
      `
        SELECT
          TO_CHAR(month_start, 'TMMon') AS month,
          COALESCE((
            SELECT COUNT(*) FROM examinations
            WHERE date_trunc('month', examination_date) = month_start
          ), 0)::INTEGER AS patients,
          COALESCE((
            SELECT SUM(paid_amount) FROM examination_payments
            WHERE date_trunc('month', transaction_date) = month_start
          ), 0)::NUMERIC AS income
        FROM generate_series(
          date_trunc('month', COALESCE($1::DATE, CURRENT_DATE - INTERVAL '5 months')),
          date_trunc('month', COALESCE($2::DATE, CURRENT_DATE)),
          INTERVAL '1 month'
        ) AS month_start
      `,
      [fromDate, toDate]
    ),
    pool.query(
      `
        SELECT
          COALESCE(examination_payments.service_name, examinations.examination_type) AS name,
          COUNT(*)::INTEGER AS count,
          COALESCE(SUM(examination_payments.paid_amount), 0)::NUMERIC AS income
        FROM examinations
        LEFT JOIN examination_payments ON examination_payments.examination_id = examinations.id
        WHERE ($1::DATE IS NULL OR examinations.examination_date >= $1::DATE)
          AND ($2::DATE IS NULL OR examinations.examination_date <= $2::DATE)
        GROUP BY 1
        ORDER BY count DESC
      `,
      [fromDate, toDate]
    ),
    pool.query(
      `
        SELECT
          COALESCE(staff.full_name, examinations.doctor_name) AS name,
          COUNT(*)::INTEGER AS count
        FROM examinations
        LEFT JOIN staff ON staff.id = examinations.doctor_id
        WHERE ($1::DATE IS NULL OR examination_date >= $1::DATE)
          AND ($2::DATE IS NULL OR examination_date <= $2::DATE)
        GROUP BY 1
        ORDER BY count DESC
      `,
      [fromDate, toDate]
    ),
    pool.query(
      `
        SELECT status AS name, COUNT(*)::INTEGER AS value
        FROM appointments
        WHERE ($1::DATE IS NULL OR appointment_date >= $1::DATE)
          AND ($2::DATE IS NULL OR appointment_date <= $2::DATE)
        GROUP BY status
      `,
      [fromDate, toDate]
    ),
  ])

  const statusColors = {
    Onaylandı: '#f97316',
    Tamamlandı: '#22c55e',
    Bekliyor: '#f59e0b',
    'İptal Edildi': '#ef4444',
  }

  return {
    from: fromDate,
    to: toDate,
    summary: {
      examinations: summary.rows[0].examinations,
      patients: summary.rows[0].patients,
      collected: formatCurrency(summary.rows[0].collected),
      remaining: formatCurrency(summary.rows[0].remaining),
    },
    monthlyPatients: monthly.rows.map((row) => ({
      month: row.month,
      patients: Number(row.patients),
      income: Number(row.income),
    })),
    services: services.rows,
    doctors: doctors.rows,
    appointmentStatus: appointments.rows.map((row) => ({
      name: row.name,
      value: row.value,
      color: statusColors[row.name] || '#94a3b8',
    })),
  }
}
