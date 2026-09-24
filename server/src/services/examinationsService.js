import pool, { withTransaction } from '../db/index.js'
import { HttpError } from '../utils/errors.js'
import { calculatePayment, formatCurrency } from '../utils/money.js'
import { maskCard, sanitizeCardLastFour } from '../utils/mask.js'
import { writeAudit } from '../utils/audit.js'
import { listDocumentsForOwners } from './uploadsService.js'

const VALID_EXAM_STATUSES = ['Taslak', 'Bekliyor', 'Takipte', 'Tamamlandı', 'İptal']
const CANCELLED_STATUS = 'İptal'
const CARD_METHODS = ['Kredi Kartı', 'Banka Kartı']

const mapPayment = (row, movements = []) => {
  if (!row) {
    return {
      service: 'Kayıt yok',
      total: '₺0',
      discount: '₺0',
      paid: '₺0',
      remaining: '₺0',
      status: 'Kayıt yok',
      method: 'Henüz Ödenmedi',
      maskedCard: '',
      transactionDate: null,
      receiptNo: '-',
      movements: [],
    }
  }

  return {
    service: row.service_name,
    total: formatCurrency(row.total_amount),
    discount: formatCurrency(row.discount_amount),
    paid: formatCurrency(row.paid_amount),
    remaining: formatCurrency(row.remaining_amount),
    status: row.payment_status,
    method: row.payment_method,
    maskedCard: CARD_METHODS.includes(row.payment_method) ? maskCard(row.card_last_four) : '',
    transactionDate: row.transaction_date,
    receiptNo: row.receipt_no || '-',
    note: row.payment_note || '',
    movements: movements.map((movement) => ({
      date: movement.movement_date,
      amount: formatCurrency(movement.amount),
      method: movement.method,
      status: movement.status,
      receiptNo: movement.receipt_no || '-',
    })),
  }
}

export async function insertPayment(client, examinationId, payload, fallbackDate) {
  const payment = calculatePayment({
    total: payload.total,
    discount: payload.discount,
    paid: payload.paid,
  })
  const method = payload.paymentMethod || 'Henüz Ödenmedi'
  const cardLastFour = CARD_METHODS.includes(method)
    ? sanitizeCardLastFour(payload.cardLastFour)
    : ''

  const paymentResult = await client.query(
    `
      INSERT INTO examination_payments (
        examination_id, service_name, total_amount, discount_amount,
        payable_amount, paid_amount, remaining_amount, payment_status,
        payment_method, receipt_no, payment_note, card_last_four, transaction_date
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, NULLIF($10, ''), NULLIF($11, ''),
        NULLIF($12, ''), COALESCE(NULLIF($13, '')::DATE, $14::DATE)
      )
      RETURNING *
    `,
    [
      examinationId,
      payload.service || payload.type || 'Genel Muayene',
      payment.totalAmount,
      payment.discountAmount,
      payment.payable,
      payment.paidAmount,
      payment.remaining,
      payment.status,
      method,
      payload.receiptNo || '',
      payload.paymentNote || '',
      cardLastFour,
      payload.transactionDate || '',
      fallbackDate,
    ]
  )

  const saved = paymentResult.rows[0]
  let movements = []

  if (payment.paidAmount > 0) {
    const movementResult = await client.query(
      `
        INSERT INTO payment_movements (
          payment_id, movement_date, amount, method, status, receipt_no
        )
        VALUES ($1, $2::DATE, $3, $4, 'Başarılı', NULLIF($5, ''))
        RETURNING
          TO_CHAR(movement_date, 'YYYY-MM-DD') AS movement_date,
          amount,
          method,
          status,
          receipt_no
      `,
      [
        saved.id,
        saved.transaction_date,
        payment.paidAmount,
        method,
        payload.receiptNo || '',
      ]
    )
    movements = movementResult.rows
  }

  return mapPayment({
    ...saved,
    transaction_date: saved.transaction_date
      ? String(saved.transaction_date).slice(0, 10)
      : fallbackDate,
  }, movements)
}

export async function getPatientVisits(patientId) {
  const examinationsResult = await pool.query(
    `
      SELECT
        examinations.id AS "databaseId",
        examinations.examination_no AS "id",
        TO_CHAR(examinations.examination_date, 'YYYY-MM-DD') AS "date",
        TO_CHAR(examinations.examination_time, 'HH24:MI') AS "time",
        examinations.examination_type AS "type",
        examinations.status,
        examinations.complaint,
        COALESCE(staff.full_name, examinations.doctor_name) AS "doctor",
        TO_CHAR(examinations.updated_at, 'YYYY-MM-DD') AS "updatedAt",
        examinations.complaint_start_date AS "complaintStartDate",
        examinations.medical_history AS "medicalHistory",
        examinations.blood_pressure AS "bloodPressure",
        examinations.pulse,
        examinations.fever,
        examinations.height,
        examinations.weight,
        examinations.oxygen,
        examinations.findings,
        examinations.preliminary_diagnosis AS "preliminaryDiagnosis",
        examinations.diagnosis,
        examinations.performed_procedure AS "procedure",
        examinations.treatment_plan AS "treatmentPlan",
        examinations.doctor_note AS "doctorNote",
        examinations.needs_control AS "needsControl",
        TO_CHAR(examinations.control_date, 'YYYY-MM-DD') AS "controlDate"
      FROM examinations
      LEFT JOIN staff ON staff.id = examinations.doctor_id
      WHERE examinations.patient_id = $1
      ORDER BY
        examinations.examination_date DESC,
        examinations.examination_time DESC,
        examinations.id DESC
    `,
    [patientId]
  )

  const notesResult = await pool.query(
    `
      SELECT
        examination_notes.id,
        examinations.examination_no AS "examinationId",
        examination_notes.title,
        examination_notes.content,
        TO_CHAR(examination_notes.note_date, 'DD.MM.YYYY') AS "date",
        TO_CHAR(examination_notes.note_time, 'HH24:MI') AS "time",
        examination_notes.author_name AS "author",
        TO_CHAR(examination_notes.updated_at, 'DD.MM.YYYY') AS "updatedAt"
      FROM examination_notes
      INNER JOIN examinations ON examinations.id = examination_notes.examination_id
      WHERE examinations.patient_id = $1
      ORDER BY
        examination_notes.note_date DESC,
        examination_notes.note_time DESC,
        examination_notes.id DESC
    `,
    [patientId]
  )

  const prescriptionsResult = await pool.query(
    `
      SELECT
        prescriptions.prescription_no AS "no",
        examinations.examination_no AS "examinationId",
        TO_CHAR(prescriptions.prescription_date, 'DD.MM.YYYY') AS "date",
        prescriptions.status,
        COALESCE(staff.full_name, prescriptions.doctor_name) AS "doctor",
        prescription_medicines.id AS "medicineId",
        prescription_medicines.medicine_name AS "medicineName",
        prescription_medicines.dose,
        prescription_medicines.frequency,
        prescription_medicines.duration,
        prescription_medicines.note
      FROM prescriptions
      INNER JOIN examinations ON examinations.id = prescriptions.examination_id
      LEFT JOIN staff ON staff.id = prescriptions.doctor_id
      LEFT JOIN prescription_medicines ON prescription_medicines.prescription_id = prescriptions.id
      WHERE examinations.patient_id = $1
      ORDER BY prescriptions.id DESC, prescription_medicines.sort_order ASC, prescription_medicines.id ASC
    `,
    [patientId]
  )

  const paymentsResult = await pool.query(
    `
      SELECT
        examinations.examination_no AS "examinationId",
        examination_payments.*,
        TO_CHAR(examination_payments.transaction_date, 'YYYY-MM-DD') AS transaction_date
      FROM examination_payments
      INNER JOIN examinations ON examinations.id = examination_payments.examination_id
      WHERE examinations.patient_id = $1
    `,
    [patientId]
  )

  const movementsResult = await pool.query(
    `
      SELECT
        examinations.examination_no AS "examinationId",
        TO_CHAR(payment_movements.movement_date, 'YYYY-MM-DD') AS movement_date,
        payment_movements.amount,
        payment_movements.method,
        payment_movements.status,
        payment_movements.receipt_no
      FROM payment_movements
      INNER JOIN examination_payments ON examination_payments.id = payment_movements.payment_id
      INNER JOIN examinations ON examinations.id = examination_payments.examination_id
      WHERE examinations.patient_id = $1
      ORDER BY payment_movements.id
    `,
    [patientId]
  )

  const documents = await listDocumentsForOwners(
    'examination',
    examinationsResult.rows.map((row) => row.databaseId)
  )

  const prescriptionsByExamination = prescriptionsResult.rows.reduce((grouped, row) => {
    if (!grouped[row.examinationId]) {
      grouped[row.examinationId] = {
        no: row.no,
        date: row.date,
        status: row.status,
        doctor: row.doctor,
        medicines: [],
      }
    }

    if (row.medicineId) {
      grouped[row.examinationId].medicines.push({
        name: row.medicineName,
        dose: row.dose,
        frequency: row.frequency,
        duration: row.duration,
        note: row.note,
      })
    }

    return grouped
  }, {})

  const paymentsByExamination = paymentsResult.rows.reduce((grouped, row) => {
    grouped[row.examinationId] = row
    return grouped
  }, {})

  const movementsByExamination = movementsResult.rows.reduce((grouped, row) => {
    grouped[row.examinationId] = grouped[row.examinationId] || []
    grouped[row.examinationId].push(row)
    return grouped
  }, {})

  return examinationsResult.rows.map((examination) => ({
    id: examination.id,
    date: examination.date,
    time: examination.time,
    type: examination.type,
    status: examination.status,
    complaint: examination.complaint,
    doctor: examination.doctor,
    updatedAt: examination.updatedAt,
    overview: {
      complaint: examination.complaint,
      complaintStartDate: examination.complaintStartDate,
      medicalHistory: examination.medicalHistory,
      findings: examination.findings,
      vitals: {
        bloodPressure: examination.bloodPressure,
        pulse: examination.pulse,
        fever: examination.fever,
        height: examination.height,
        weight: examination.weight,
        oxygen: examination.oxygen,
      },
      preliminaryDiagnosis: examination.preliminaryDiagnosis,
      diagnosis: examination.diagnosis || examination.preliminaryDiagnosis,
      procedure: examination.procedure,
      treatmentPlan: examination.treatmentPlan,
      controlDate: examination.needsControl ? examination.controlDate : 'Gerekli değil',
      doctorNote: examination.doctorNote,
    },
    treatmentNotes: notesResult.rows
      .filter((note) => note.examinationId === examination.id)
      .map(({ examinationId, ...note }) => note),
    prescription: prescriptionsByExamination[examination.id] || null,
    payment: mapPayment(
      paymentsByExamination[examination.id],
      movementsByExamination[examination.id] || []
    ),
    documents: documents
      .filter((document) => document.ownerId === examination.databaseId)
      .map((document) => ({
        id: document.id,
        name: document.name,
        type: document.type,
        size: document.size,
        uploadedAt: document.uploadedAt,
        url: document.url,
      })),
  }))
}

export async function listExaminations({ search = '', status = '', doctor = '', type = '', date = '' } = {}) {
  const result = await pool.query(
    `
      SELECT
        examinations.examination_no AS id,
        patients.patient_no AS "patientNo",
        examinations.examination_no AS "visitId",
        patients.full_name AS patient,
        TO_CHAR(examinations.examination_date, 'DD.MM.YYYY') AS date,
        TO_CHAR(examinations.examination_date, 'YYYY-MM-DD') AS "dateIso",
        examinations.complaint,
        COALESCE(examinations.diagnosis, examinations.preliminary_diagnosis) AS diagnosis,
        examinations.status,
        examinations.examination_type AS type,
        COALESCE(staff.full_name, examinations.doctor_name) AS doctor
      FROM examinations
      INNER JOIN patients ON patients.id = examinations.patient_id
      LEFT JOIN staff ON staff.id = examinations.doctor_id
      WHERE
        ($1 = '' OR patients.full_name ILIKE '%' || $1 || '%'
          OR examinations.complaint ILIKE '%' || $1 || '%'
          OR COALESCE(examinations.diagnosis, '') ILIKE '%' || $1 || '%'
          OR examinations.examination_no ILIKE '%' || $1 || '%'
          OR patients.patient_no ILIKE '%' || $1 || '%')
        AND ($2 = '' OR examinations.status = $2)
        AND ($3 = '' OR COALESCE(staff.full_name, examinations.doctor_name) = $3)
        AND ($4 = '' OR examinations.examination_type = $4)
        AND ($5 = '' OR examinations.examination_date = $5::DATE)
      ORDER BY examinations.examination_date DESC, examinations.examination_time DESC, examinations.id DESC
    `,
    [search.trim(), status, doctor, type, date]
  )

  return result.rows
}

export async function updateExaminationStatus(examinationNo, { status, reason, note }, actor) {
  if (!VALID_EXAM_STATUSES.includes(status)) {
    throw new HttpError(400, 'Muayene durumu geçersiz.')
  }

  const cancellationReason = status === CANCELLED_STATUS
    ? (reason === 'Diğer' ? note : reason)
    : null

  if (status === CANCELLED_STATUS && !cancellationReason?.trim()) {
    throw new HttpError(400, 'İptal nedeni zorunludur.')
  }

  const result = await pool.query(
    `
      UPDATE examinations
      SET
        status = $2,
        cancellation_reason = $3,
        updated_at = CURRENT_TIMESTAMP
      WHERE examination_no = $1
      RETURNING examination_no AS id, status
    `,
    [examinationNo, status, cancellationReason]
  )

  if (result.rowCount === 0) {
    throw new HttpError(404, 'Muayene bulunamadı.')
  }

  await writeAudit(pool, {
    ...actor,
    action: 'Muayene durumu güncellendi',
    page: 'Muayeneler',
    module: 'Muayene Yönetimi',
    targetType: 'Muayene',
    targetId: examinationNo,
    targetRoute: `/muayeneler`,
    eventCode: 'EXAM_STATUS_UPDATED',
    description: `${examinationNo} durumu ${status} olarak güncellendi.`,
    afterSummary: { status },
  })

  return result.rows[0]
}

export async function deleteDraftExamination(examinationNo, actor) {
  const result = await pool.query(
    `
      UPDATE examinations
      SET
        status = 'İptal',
        cancellation_reason = COALESCE(NULLIF(cancellation_reason, ''), 'Taslak arşivlendi'),
        updated_at = CURRENT_TIMESTAMP
      WHERE examination_no = $1 AND status = 'Taslak'
      RETURNING examination_no AS id, status
    `,
    [examinationNo]
  )

  if (result.rowCount === 0) {
    throw new HttpError(400, 'Yalnızca taslak muayene arşivlenebilir. Tamamlanmış tıbbi kayıtlar kalıcı olarak silinmez.')
  }

  await writeAudit(pool, {
    ...actor,
    action: 'Taslak muayene arşivlendi',
    page: 'Muayeneler',
    module: 'Muayene Yönetimi',
    targetType: 'Muayene',
    targetId: examinationNo,
    eventCode: 'EXAM_DRAFT_ARCHIVED',
    description: `${examinationNo} taslak muayenesi arşivlendi.`,
    afterSummary: { status: 'İptal' },
  })

  return result.rows[0]
}

export async function createExamination(patientNo, payload, actor) {
  const {
    date,
    time,
    type,
    status = 'Taslak',
    complaint,
    complaintStartDate,
    medicalHistory,
    pastDiseases,
    medicinesUsed,
    knownAllergies,
    bloodPressure,
    pulse,
    fever,
    height,
    weight,
    oxygen,
    findings,
    preliminaryDiagnosis,
    diagnosis,
    procedure,
    treatmentPlan,
    doctorNote,
    needsControl,
    controlDate,
    notes = [],
    createPrescription = false,
    medicines = [],
    appointmentId,
    doctorId,
  } = payload

  if (!date || !time || !type || !complaint?.trim() || !findings?.trim()) {
    throw new HttpError(400, 'Tarih, saat, muayene türü, şikâyet ve muayene bulguları zorunludur.')
  }

  if (!preliminaryDiagnosis?.trim() && !diagnosis?.trim()) {
    throw new HttpError(400, 'Ön tanı veya kesin tanı alanlarından en az biri doldurulmalıdır.')
  }

  if (!VALID_EXAM_STATUSES.includes(status)) {
    throw new HttpError(400, 'Muayene durumu geçersiz.')
  }

  const validNotes = Array.isArray(notes)
    ? notes.filter((note) => note && (note.title?.trim() || note.content?.trim()))
    : []

  const validMedicines = createPrescription && Array.isArray(medicines)
    ? medicines.filter((medicine) => medicine?.name?.trim())
    : []

  if (createPrescription && validMedicines.length === 0) {
    throw new HttpError(400, 'Reçete oluşturmak için en az bir ilaç girilmelidir.')
  }

  return withTransaction(async (client) => {
    const result = await client.query(
      `
        INSERT INTO examinations (
          patient_id, examination_date, examination_time, examination_type, status,
          complaint, complaint_start_date, medical_history, past_diseases,
          medicines_used, known_allergies, blood_pressure, pulse, fever, height,
          weight, oxygen, findings, preliminary_diagnosis, diagnosis,
          performed_procedure, treatment_plan, doctor_note, needs_control,
          control_date, doctor_id, appointment_id
        )
        SELECT
          patients.id, $2::DATE, $3::TIME, $4, $5, $6, NULLIF($7, ''), NULLIF($8, ''),
          NULLIF($9, ''), NULLIF($10, ''), NULLIF($11, ''), NULLIF($12, ''),
          NULLIF($13, ''), NULLIF($14, ''), NULLIF($15, ''), NULLIF($16, ''),
          NULLIF($17, ''), $18, NULLIF($19, ''), NULLIF($20, ''), NULLIF($21, ''),
          NULLIF($22, ''), NULLIF($23, ''), $24::BOOLEAN,
          CASE WHEN $24::BOOLEAN = TRUE THEN NULLIF($25, '')::DATE ELSE NULL END,
          $26, $27
        FROM patients
        WHERE patients.patient_no = $1
        RETURNING
          id AS "databaseId",
          examination_no AS "id",
          TO_CHAR(examination_date, 'YYYY-MM-DD') AS "date",
          TO_CHAR(examination_time, 'HH24:MI') AS "time",
          examination_type AS "type",
          status,
          complaint,
          doctor_name AS "doctor",
          TO_CHAR(updated_at, 'YYYY-MM-DD') AS "updatedAt"
      `,
      [
        patientNo,
        date,
        time,
        type,
        status,
        complaint.trim(),
        complaintStartDate?.trim() || '',
        medicalHistory?.trim() || '',
        pastDiseases?.trim() || '',
        medicinesUsed?.trim() || '',
        knownAllergies?.trim() || '',
        bloodPressure?.trim() || '',
        pulse?.trim() || '',
        fever?.trim() || '',
        height?.trim() || '',
        weight?.trim() || '',
        oxygen?.trim() || '',
        findings.trim(),
        preliminaryDiagnosis?.trim() || '',
        diagnosis?.trim() || '',
        procedure?.trim() || '',
        treatmentPlan?.trim() || '',
        doctorNote?.trim() || '',
        needsControl === true,
        controlDate || '',
        doctorId || null,
        appointmentId || null,
      ]
    )

    if (result.rowCount === 0) {
      throw new HttpError(404, 'Muayene eklenecek hasta bulunamadı.')
    }

    const savedExamination = result.rows[0]

    for (const note of validNotes) {
      await client.query(
        `
          INSERT INTO examination_notes (
            examination_id, title, content, note_date, note_time
          )
          VALUES ($1, $2, NULLIF($3, ''), $4::DATE, NULLIF($5, '')::TIME)
        `,
        [
          savedExamination.databaseId,
          note.title?.trim() || 'Tedavi Notu',
          note.content?.trim() || '',
          note.date || date,
          note.time || '',
        ]
      )
    }

    if (createPrescription) {
      const prescriptionStatus = status === 'Taslak' ? 'Taslak' : 'Aktif'
      const prescriptionResult = await client.query(
        `
          INSERT INTO prescriptions (
            examination_id, prescription_date, status, diagnosis, complaint, doctor_note, control_date, doctor_id
          )
          VALUES ($1, $2::DATE, $3, NULLIF($4, ''), NULLIF($5, ''), NULLIF($6, ''), $7::DATE, $8)
          RETURNING id
        `,
        [
          savedExamination.databaseId,
          date,
          prescriptionStatus,
          diagnosis?.trim() || preliminaryDiagnosis?.trim() || '',
          complaint.trim(),
          doctorNote?.trim() || '',
          needsControl === true && controlDate ? controlDate : null,
          doctorId || null,
        ]
      )

      const prescriptionId = prescriptionResult.rows[0].id

      for (const [index, medicine] of validMedicines.entries()) {
        await client.query(
          `
            INSERT INTO prescription_medicines (
              prescription_id, medicine_name, dose, frequency, duration, note, sort_order
            )
            VALUES ($1, $2, NULLIF($3, ''), NULLIF($4, ''), NULLIF($5, ''), NULLIF($6, ''), $7)
          `,
          [
            prescriptionId,
            medicine.name.trim(),
            medicine.dose?.trim() || '',
            medicine.frequency?.trim() || '',
            medicine.duration?.trim() || '',
            medicine.note?.trim() || '',
            index,
          ]
        )
      }
    }

    const payment = await insertPayment(client, savedExamination.databaseId, payload, date)

    if (appointmentId) {
      await client.query(
        `
          UPDATE appointments
          SET status = 'Tamamlandı', updated_at = CURRENT_TIMESTAMP
          WHERE id = $1 AND status <> 'İptal Edildi'
        `,
        [appointmentId]
      )
    }

    await writeAudit(client, {
      ...actor,
      action: status === 'Tamamlandı' ? 'Muayene tamamlandı' : 'Muayene kaydedildi',
      page: 'Muayeneler',
      module: 'Muayene Yönetimi',
      targetType: 'Muayene',
      targetId: savedExamination.id,
      targetName: `${patientNo} - ${type}`,
      targetRoute: `/hastalar/${patientNo}?dosya=${savedExamination.id}`,
      eventCode: status === 'Tamamlandı' ? 'EXAM_COMPLETED' : 'EXAM_CREATED',
      description: `${patientNo} için ${type} kaydı oluşturuldu.`,
      afterSummary: { status, type },
    })

    const { databaseId, ...examination } = savedExamination
    return { ...examination, databaseId, payment }
  })
}
