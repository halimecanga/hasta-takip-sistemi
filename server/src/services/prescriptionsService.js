import pool, { withTransaction } from '../db/index.js'
import { HttpError } from '../utils/errors.js'
import { formatLongDate } from '../utils/dates.js'
import { writeAudit } from '../utils/audit.js'
import { listDocumentsForOwners } from './uploadsService.js'

const VALID_STATUSES = ['Taslak', 'Aktif', 'Pasif', 'İptal', 'Tamamlandı', 'Süresi Doldu']
const CANCELLED_STATUS = 'İptal'

const mapMedicine = (row) => ({
  id: row.medicine_id || `MED-${row.id}`,
  name: row.medicine_name,
  activeIngredient: row.active_ingredient || '',
  form: row.form || '',
  dose: row.dose || '',
  frequency: row.frequency || '',
  time: row.time_label || '',
  duration: row.duration || '',
  quantity: row.quantity || '',
  note: row.note || '',
  schedule: row.schedule || [],
  instruction: row.instruction || '',
  storage: row.storage || '',
  missedDose: row.missed_dose || '',
})

export async function listPrescriptions({ search = '', status = '', doctor = '', date = '', patientNo = '' } = {}) {
  const result = await pool.query(
    `
      SELECT
        prescriptions.prescription_no AS id,
        patients.patient_no AS "patientNo",
        examinations.examination_no AS "visitId",
        patients.full_name AS patient,
        COUNT(prescription_medicines.id)::INTEGER AS count,
        TO_CHAR(prescriptions.prescription_date, 'DD.MM.YYYY') AS date,
        TO_CHAR(prescriptions.prescription_date, 'YYYY-MM-DD') AS "dateIso",
        prescriptions.status,
        COALESCE(staff.full_name, prescriptions.doctor_name) AS doctor
      FROM prescriptions
      INNER JOIN examinations ON examinations.id = prescriptions.examination_id
      INNER JOIN patients ON patients.id = examinations.patient_id
      LEFT JOIN staff ON staff.id = prescriptions.doctor_id
      LEFT JOIN prescription_medicines ON prescription_medicines.prescription_id = prescriptions.id
      WHERE
        ($1 = '' OR patients.full_name ILIKE '%' || $1 || '%'
          OR prescriptions.prescription_no ILIKE '%' || $1 || '%'
          OR patients.patient_no ILIKE '%' || $1 || '%')
        AND ($2 = '' OR prescriptions.status = $2)
        AND ($3 = '' OR COALESCE(staff.full_name, prescriptions.doctor_name) = $3)
        AND ($4 = '' OR prescriptions.prescription_date = $4::DATE)
        AND ($5 = '' OR patients.patient_no = $5)
      GROUP BY
        prescriptions.id, patients.patient_no, examinations.examination_no,
        patients.full_name, prescriptions.prescription_date, prescriptions.status,
        staff.full_name, prescriptions.doctor_name
      ORDER BY prescriptions.prescription_date DESC, prescriptions.id DESC
    `,
    [search.trim(), status, doctor, date, patientNo]
  )

  return result.rows
}

async function loadPrescription(prescriptionNo) {
  const result = await pool.query(
    `
      SELECT
        prescriptions.id,
        prescriptions.prescription_no,
        patients.patient_no,
        patients.full_name,
        patients.phone,
        EXTRACT(YEAR FROM AGE(CURRENT_DATE, patients.birth_date))::INTEGER AS age,
        patients.gender,
        patients.allergy,
        patients.chronic_disease,
        patients.regular_medicine,
        examinations.examination_no,
        TO_CHAR(prescriptions.prescription_date, 'YYYY-MM-DD') AS prescription_date,
        TO_CHAR(examinations.examination_date, 'YYYY-MM-DD') AS examination_date,
        prescriptions.status,
        COALESCE(staff.full_name, prescriptions.doctor_name) AS doctor,
        COALESCE(prescriptions.diagnosis, examinations.diagnosis, examinations.preliminary_diagnosis) AS diagnosis,
        COALESCE(prescriptions.complaint, examinations.complaint) AS complaint,
        prescriptions.treatment_goal,
        prescriptions.doctor_note,
        prescriptions.general_warning,
        TO_CHAR(COALESCE(prescriptions.control_date, examinations.control_date), 'YYYY-MM-DD') AS control_date,
        TO_CHAR(prescriptions.created_at, 'YYYY-MM-DD') AS created_at,
        TO_CHAR(prescriptions.updated_at, 'YYYY-MM-DD') AS updated_at,
        prescriptions.cancellation_reason
      FROM prescriptions
      INNER JOIN examinations ON examinations.id = prescriptions.examination_id
      INNER JOIN patients ON patients.id = examinations.patient_id
      LEFT JOIN staff ON staff.id = prescriptions.doctor_id
      WHERE prescriptions.prescription_no = $1
    `,
    [prescriptionNo]
  )

  if (result.rowCount === 0) {
    throw new HttpError(404, 'Reçete bulunamadı.')
  }

  const row = result.rows[0]
  const medicinesResult = await pool.query(
    `
      SELECT
        id,
        id AS medicine_id,
        medicine_name,
        active_ingredient,
        form,
        dose,
        frequency,
        time_label,
        duration,
        quantity,
        note,
        schedule,
        instruction,
        storage,
        missed_dose
      FROM prescription_medicines
      WHERE prescription_id = $1
      ORDER BY sort_order, id
    `,
    [row.id]
  )

  const documents = await listDocumentsForOwners('prescription', [row.id])
  const medicines = medicinesResult.rows.map(mapMedicine)

  return {
    id: row.prescription_no,
    number: row.prescription_no,
    databaseId: row.id,
    patientNo: row.patient_no,
    patientName: row.full_name,
    visitId: row.examination_no,
    prescriptionDate: formatLongDate(row.prescription_date),
    examinationDate: formatLongDate(row.examination_date),
    status: row.status,
    doctor: row.doctor,
    diagnosis: row.diagnosis || '',
    complaint: row.complaint || '',
    treatmentGoal: row.treatment_goal || '',
    doctorNote: row.doctor_note || '',
    generalWarning: row.general_warning || 'Bu bilgiler klinik kayıt özetidir.',
    controlDate: row.control_date ? formatLongDate(row.control_date) : '-',
    createdAt: formatLongDate(row.created_at),
    updatedAt: formatLongDate(row.updated_at),
    remainingDays: '',
    cancellationReason: row.cancellation_reason || '',
    patient: {
      phone: row.phone,
      age: row.age,
      gender: row.gender,
      allergy: row.allergy || 'Yok',
      chronicDisease: row.chronic_disease || 'Yok',
      regularMedicine: row.regular_medicine || 'Yok',
      pregnancyInfo: 'Belirtilmedi',
      lastVisit: formatLongDate(row.examination_date),
    },
    alerts: [
      {
        id: 'ALT-ALLERGY',
        tone: row.allergy && row.allergy !== 'Yok' ? 'warning' : 'info',
        title: 'Alerji bilgisi',
        description: row.allergy && row.allergy !== 'Yok' ? row.allergy : 'Kayıtlı ilaç alerjisi bulunmuyor.',
      },
    ],
    medicines,
    history: [
      {
        id: 'HIS-001',
        date: formatLongDate(row.created_at),
        time: '',
        action: 'Reçete oluşturuldu',
        description: 'Reçete muayene dosyası üzerinden oluşturuldu.',
        actor: row.doctor,
      },
    ],
    documents: documents.map((document) => ({
      id: document.id,
      name: document.name,
      type: document.type,
      size: document.size,
      date: document.uploadedAt,
      url: document.url,
    })),
  }
}

export async function getPrescriptionByNo(prescriptionNo) {
  return loadPrescription(prescriptionNo)
}

export async function updatePrescription(prescriptionNo, payload, actor) {
  if (payload.status && !VALID_STATUSES.includes(payload.status)) {
    throw new HttpError(400, 'Reçete durumu geçersiz.')
  }

  if (!payload.diagnosis?.trim()) {
    throw new HttpError(400, 'Tanı zorunludur.')
  }

  const medicines = Array.isArray(payload.medicines)
    ? payload.medicines.filter((medicine) => medicine?.name?.trim())
    : []

  if (medicines.length === 0) {
    throw new HttpError(400, 'En az bir ilaç eklenmelidir.')
  }

  await withTransaction(async (client) => {
    const existing = await client.query(
      'SELECT id FROM prescriptions WHERE prescription_no = $1',
      [prescriptionNo]
    )

    if (existing.rowCount === 0) {
      throw new HttpError(404, 'Reçete bulunamadı.')
    }

    const prescriptionId = existing.rows[0].id

    await client.query(
      `
        UPDATE prescriptions
        SET
          status = COALESCE($2, status),
          diagnosis = $3,
          doctor_note = NULLIF($4, ''),
          control_date = NULLIF($5, '')::DATE,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `,
      [
        prescriptionId,
        payload.status || null,
        payload.diagnosis.trim(),
        payload.doctorNote?.trim() || '',
        payload.controlDate || '',
      ]
    )

    await client.query('DELETE FROM prescription_medicines WHERE prescription_id = $1', [prescriptionId])

    for (const [index, medicine] of medicines.entries()) {
      await client.query(
        `
          INSERT INTO prescription_medicines (
            prescription_id, medicine_name, active_ingredient, form, dose, frequency,
            time_label, duration, quantity, note, schedule, instruction, storage,
            missed_dose, sort_order
          )
          VALUES (
            $1, $2, NULLIF($3, ''), NULLIF($4, ''), NULLIF($5, ''), NULLIF($6, ''),
            NULLIF($7, ''), NULLIF($8, ''), NULLIF($9, ''), NULLIF($10, ''), $11,
            NULLIF($12, ''), NULLIF($13, ''), NULLIF($14, ''), $15
          )
        `,
        [
          prescriptionId,
          medicine.name.trim(),
          medicine.activeIngredient || '',
          medicine.form || '',
          medicine.dose || '',
          medicine.frequency || '',
          medicine.time || '',
          medicine.duration || '',
          medicine.quantity || '',
          medicine.note || '',
          medicine.schedule || [],
          medicine.instruction || '',
          medicine.storage || '',
          medicine.missedDose || '',
          index,
        ]
      )
    }

    await writeAudit(client, {
      ...actor,
      action: 'Reçete güncellendi',
      page: 'Reçeteler',
      module: 'Reçete Yönetimi',
      targetType: 'Reçete',
      targetId: prescriptionNo,
      targetRoute: `/receteler/${prescriptionNo}`,
      eventCode: 'PRESCRIPTION_UPDATED',
      description: `${prescriptionNo} reçetesi güncellendi.`,
    })

  })

  return loadPrescription(prescriptionNo)
}

export async function updatePrescriptionStatus(prescriptionNo, { status, reason, note }, actor) {
  if (!VALID_STATUSES.includes(status)) {
    throw new HttpError(400, 'Reçete durumu geçersiz.')
  }

  const cancellationReason = status === CANCELLED_STATUS
    ? (reason === 'Diğer' ? note : reason)
    : null

  if (status === CANCELLED_STATUS && !cancellationReason?.trim()) {
    throw new HttpError(400, 'İptal nedeni zorunludur.')
  }

  const result = await pool.query(
    `
      UPDATE prescriptions
      SET
        status = $2,
        cancellation_reason = $3,
        updated_at = CURRENT_TIMESTAMP
      WHERE prescription_no = $1
      RETURNING prescription_no AS id, status
    `,
    [prescriptionNo, status, cancellationReason]
  )

  if (result.rowCount === 0) {
    throw new HttpError(404, 'Reçete bulunamadı.')
  }

  await writeAudit(pool, {
    ...actor,
    action: 'Reçete durumu güncellendi',
    page: 'Reçeteler',
    module: 'Reçete Yönetimi',
    targetType: 'Reçete',
    targetId: prescriptionNo,
    eventCode: 'PRESCRIPTION_STATUS_UPDATED',
    description: `${prescriptionNo} durumu ${status} olarak güncellendi.`,
    afterSummary: { status },
  })

  return result.rows[0]
}

export async function deleteDraftPrescription(prescriptionNo, actor) {
  const result = await pool.query(
    `
      UPDATE prescriptions
      SET
        status = 'İptal',
        cancellation_reason = COALESCE(NULLIF(cancellation_reason, ''), 'Taslak arşivlendi'),
        updated_at = CURRENT_TIMESTAMP
      WHERE prescription_no = $1 AND status = 'Taslak'
      RETURNING prescription_no AS id, status
    `,
    [prescriptionNo]
  )

  if (result.rowCount === 0) {
    throw new HttpError(400, 'Yalnızca taslak reçete arşivlenebilir. Tamamlanmış tıbbi kayıtlar kalıcı olarak silinmez.')
  }

  await writeAudit(pool, {
    ...actor,
    action: 'Taslak reçete arşivlendi',
    page: 'Reçeteler',
    module: 'Reçete Yönetimi',
    targetType: 'Reçete',
    targetId: prescriptionNo,
    eventCode: 'PRESCRIPTION_DRAFT_ARCHIVED',
    description: `${prescriptionNo} taslak reçetesi arşivlendi.`,
    afterSummary: { status: 'İptal' },
  })

  return result.rows[0]
}
