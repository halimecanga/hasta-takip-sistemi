import pool from './index.js'

const patients = [
  ['HT-1038', 'Emine Şahin', '60234178944', '1990-09-09', 'Kadın', '0552 337 81 03', 'emine.sahin@example.com', 'A Rh-', 'Yok', 'Astım', 'İnhaler', 'Aktif'],
  ['HT-1039', 'Ali Çetin', '18456239090', '1962-02-27', 'Erkek', '0536 118 25 71', 'ali.cetin@example.com', 'AB Rh-', 'Aspirin', 'Hipertansiyon', 'Tansiyon ilacı', 'Pasif'],
  ['HT-1040', 'Zeynep Arslan', '55482319732', '1996-08-18', 'Kadın', '0505 782 44 60', 'zeynep.arslan@example.com', 'B Rh+', 'Yok', 'Yok', 'Yok', 'Aktif'],
  ['HT-1041', 'Mehmet Kaya', '31458219664', '1969-01-03', 'Erkek', '0544 315 09 12', 'mehmet.kaya@example.com', '0 Rh+', 'Yok', 'Diyabet', 'Metformin', 'Aktif'],
  ['HT-1042', 'Ayşe Yılmaz', '12345678978', '1984-03-14', 'Kadın', '0532 421 18 26', 'ayse.yilmaz@example.com', 'A Rh+', 'Penisilin', 'Hipertansiyon', 'Amlodipin 5 mg', 'Aktif'],
]

async function syncNumberSequences() {
  await pool.query(`
    SELECT setval(
      'examination_no_seq',
      (SELECT COALESCE(MAX(CAST(substring(examination_no FROM '[0-9]+$') AS BIGINT)), 1) FROM examinations)
    )
  `)
  await pool.query(`
    SELECT setval(
      'prescription_no_seq',
      (SELECT COALESCE(MAX(CAST(substring(prescription_no FROM '[0-9]+$') AS BIGINT)), 1) FROM prescriptions)
    )
  `)
}

export async function ensureSuiteFixtures() {
  const existing = await pool.query(`SELECT 1 FROM patients WHERE patient_no = 'HT-1042'`)
  if (existing.rowCount > 0) {
    await syncNumberSequences()
    return
  }

  for (const row of patients) {
    await pool.query(
      `
        INSERT INTO patients (
          patient_no, full_name, identity_number, birth_date, gender, phone,
          email, blood_type, allergy, chronic_disease, regular_medicine, status
        )
        VALUES ($1, $2, $3, $4::DATE, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (patient_no) DO NOTHING
      `,
      row
    )
  }

  await pool.query(
    `
      INSERT INTO examinations (
        examination_no, patient_id, examination_date, examination_time,
        examination_type, status, complaint, findings, preliminary_diagnosis
      )
      SELECT 'DOS-2026-1002', id, '2026-09-23', '10:30', 'Genel Muayene', 'Tamamlandı',
             'baş ağrısı', 'baş ağrısı', 'aa'
      FROM patients WHERE patient_no = 'HT-1040'
      ON CONFLICT (examination_no) DO NOTHING
    `
  )

  await pool.query(
    `
      INSERT INTO examinations (
        examination_no, patient_id, examination_date, examination_time,
        examination_type, status, complaint, findings, preliminary_diagnosis
      )
      SELECT 'DOS-2026-1003', id, '2026-09-23', '10:30', 'Dahiliye Muayenesi', 'Tamamlandı',
             'bel ağrısı', 'Kol ağrısı', 'kol ağrısı'
      FROM patients WHERE patient_no = 'HT-1042'
      ON CONFLICT (examination_no) DO NOTHING
    `
  )

  await pool.query(
    `
      INSERT INTO examinations (
        examination_no, patient_id, examination_date, examination_time,
        examination_type, status, complaint, findings, preliminary_diagnosis
      )
      SELECT 'DOS-2026-1004', id, '2026-09-24', '10:30', 'Genel Muayene', 'Tamamlandı',
             'bağ ağrısı', 'baş ağrısı', 'baş ağrısı'
      FROM patients WHERE patient_no = 'HT-1041'
      ON CONFLICT (examination_no) DO NOTHING
    `
  )

  await pool.query(
    `
      INSERT INTO examination_notes (examination_id, title, note_date, note_time)
      SELECT id, 'kol ağrısı', '2026-09-23', '10:30'
      FROM examinations WHERE examination_no = 'DOS-2026-1003'
      AND NOT EXISTS (
        SELECT 1 FROM examination_notes WHERE examination_id = examinations.id
      )
    `
  )

  await pool.query(
    `
      INSERT INTO prescriptions (prescription_no, examination_id, prescription_date, status)
      SELECT 'REC-2026-1001', id, '2026-09-24', 'Aktif'
      FROM examinations WHERE examination_no = 'DOS-2026-1004'
      ON CONFLICT (prescription_no) DO NOTHING
    `
  )

  await pool.query(
    `
      INSERT INTO prescription_medicines (prescription_id, medicine_name, dose, frequency)
      SELECT id, 'arveles', '1 mg', 's-1 a-1'
      FROM prescriptions WHERE prescription_no = 'REC-2026-1001'
      AND NOT EXISTS (
        SELECT 1 FROM prescription_medicines WHERE prescription_id = prescriptions.id
      )
    `
  )

  await syncNumberSequences()
}
