import pool, { withTransaction } from '../db/index.js'
import { HttpError } from '../utils/errors.js'
import { formatLongDate } from '../utils/dates.js'
import { writeAudit } from '../utils/audit.js'
import { listDocumentsForOwners } from './uploadsService.js'

const VALID_STATUSES = ['Bekliyor', 'İnceleniyor', 'Hazır', 'İptal Edildi']

const isAbnormal = (status) => status && status !== 'Normal'

const mapTest = (row, extras = {}) => ({
  id: row.test_no,
  number: row.test_no,
  databaseId: row.id,
  patientNo: row.patient_no,
  patientName: row.patient_name,
  visitId: row.examination_no || '',
  type: row.test_type,
  category: row.category,
  requestReason: row.request_reason || '',
  doctor: row.doctor_name,
  testDate: formatLongDate(row.test_date),
  date: formatLongDate(row.test_date),
  dateIso: row.test_date,
  sampleDateTime: row.sample_at || '',
  resultDateTime: row.result_at || '',
  status: row.status,
  sampleType: row.sample_type || '',
  unit: row.unit || '',
  summary: row.summary || '',
  clinicalSuggestion: row.clinical_suggestion || '',
  controlDate: row.control_date ? formatLongDate(row.control_date) : '',
  patientInformed: row.patient_informed,
  cancellationReason: row.cancellation_reason || '',
  doctorEvaluation: row.evaluation,
  metrics: row.metrics,
  patient: extras.patient,
  parameters: extras.parameters || [],
  findings: extras.findings || [],
  documents: extras.documents || [],
  history: extras.history || [],
})

export async function listTests({ search = '', status = '', date = '', patientNo = '' } = {}) {
  const result = await pool.query(
    `
      SELECT
        medical_tests.test_no AS id,
        patients.patient_no AS "patientNo",
        examinations.examination_no AS "visitId",
        patients.full_name AS patient,
        medical_tests.test_type AS type,
        TO_CHAR(medical_tests.test_date, 'DD.MM.YYYY') AS date,
        TO_CHAR(medical_tests.test_date, 'YYYY-MM-DD') AS "dateIso",
        medical_tests.status
      FROM medical_tests
      INNER JOIN patients ON patients.id = medical_tests.patient_id
      LEFT JOIN examinations ON examinations.id = medical_tests.examination_id
      WHERE
        ($1 = '' OR patients.full_name ILIKE '%' || $1 || '%'
          OR medical_tests.test_type ILIKE '%' || $1 || '%'
          OR medical_tests.test_no ILIKE '%' || $1 || '%')
        AND ($2 = '' OR medical_tests.status = $2)
        AND ($3 = '' OR medical_tests.test_date = $3::DATE)
        AND ($4 = '' OR patients.patient_no = $4)
      ORDER BY medical_tests.test_date DESC, medical_tests.id DESC
    `,
    [search.trim(), status, date, patientNo]
  )

  return result.rows
}

export async function getTestByNo(testNo) {
  const result = await pool.query(
    `
      SELECT
        medical_tests.*,
        TO_CHAR(medical_tests.test_date, 'YYYY-MM-DD') AS test_date,
        TO_CHAR(medical_tests.sample_at, 'DD.MM.YYYY HH24:MI') AS sample_at,
        TO_CHAR(medical_tests.result_at, 'DD.MM.YYYY HH24:MI') AS result_at,
        TO_CHAR(medical_tests.control_date, 'YYYY-MM-DD') AS control_date,
        patients.patient_no,
        patients.full_name AS patient_name,
        patients.phone,
        EXTRACT(YEAR FROM AGE(CURRENT_DATE, patients.birth_date))::INTEGER AS age,
        patients.gender,
        patients.blood_type,
        patients.allergy,
        patients.chronic_disease,
        examinations.examination_no
      FROM medical_tests
      INNER JOIN patients ON patients.id = medical_tests.patient_id
      LEFT JOIN examinations ON examinations.id = medical_tests.examination_id
      WHERE medical_tests.test_no = $1
    `,
    [testNo]
  )

  if (result.rowCount === 0) {
    throw new HttpError(404, 'Tetkik bulunamadı.')
  }

  const row = result.rows[0]
  const [parameters, findings, history, documents] = await Promise.all([
    pool.query(
      `
        SELECT
          parameter_name AS name,
          result_value AS result,
          unit,
          reference_range AS reference,
          status,
          is_abnormal AS "isAbnormal"
        FROM laboratory_results
        WHERE test_id = $1
        ORDER BY sort_order, id
      `,
      [row.id]
    ),
    pool.query(
      `
        SELECT label, value
        FROM imaging_findings
        WHERE test_id = $1
        ORDER BY sort_order, id
      `,
      [row.id]
    ),
    pool.query(
      `
        SELECT
          id,
          history_date AS date,
          history_time AS time,
          action,
          description,
          actor
        FROM test_history
        WHERE test_id = $1
        ORDER BY id
      `,
      [row.id]
    ),
    listDocumentsForOwners('test', [row.id]),
  ])

  return mapTest(row, {
    parameters: parameters.rows,
    findings: findings.rows,
    history: history.rows,
    documents: documents.map((document) => ({
      id: document.id,
      name: document.name,
      type: document.type,
      size: document.size,
      date: document.uploadedAt,
      url: document.url,
    })),
    patient: {
      phone: row.phone,
      age: row.age,
      gender: row.gender,
      bloodType: row.blood_type || '-',
      allergy: row.allergy || 'Yok',
      chronicDisease: row.chronic_disease || 'Yok',
      lastVisit: formatLongDate(row.test_date),
    },
  })
}

export async function createTest(payload, actor) {
  const {
    patientNo,
    examinationNo,
    type,
    category = 'Laboratuvar',
    requestReason,
    testDate,
    sampleType,
    unit,
    summary,
    parameters = [],
    findings = [],
    doctorId,
  } = payload

  if (!patientNo || !type?.trim() || !testDate) {
    throw new HttpError(400, 'Hasta, tetkik türü ve tarih zorunludur.')
  }

  const createdTestNo = await withTransaction(async (client) => {
    const patientResult = await client.query(
      'SELECT id, full_name FROM patients WHERE patient_no = $1',
      [patientNo]
    )
    if (patientResult.rowCount === 0) {
      throw new HttpError(404, 'Tetkik için hasta bulunamadı.')
    }

    let examinationId = null
    if (examinationNo) {
      const examResult = await client.query(
        'SELECT id FROM examinations WHERE examination_no = $1',
        [examinationNo]
      )
      examinationId = examResult.rows[0]?.id || null
    }

    const inserted = await client.query(
      `
        INSERT INTO medical_tests (
          test_no, patient_id, examination_id, doctor_id, test_type, category,
          request_reason, test_date, sample_type, unit, summary, status
        )
        VALUES (
          'TET-' || to_char(CURRENT_DATE, 'YYYY') || '-' || lpad(nextval('test_no_seq')::text, 4, '0'),
          $1, $2, $3, $4, $5, NULLIF($6, ''), $7::DATE, NULLIF($8, ''), NULLIF($9, ''),
          NULLIF($10, ''), 'Bekliyor'
        )
        RETURNING test_no, id
      `,
      [
        patientResult.rows[0].id,
        examinationId,
        doctorId || null,
        type.trim(),
        category,
        requestReason?.trim() || '',
        testDate,
        sampleType || '',
        unit || '',
        summary || '',
      ]
    )

    const testId = inserted.rows[0].id

    for (const [index, parameter] of parameters.entries()) {
      await client.query(
        `
          INSERT INTO laboratory_results (
            test_id, parameter_name, result_value, unit, reference_range, status, is_abnormal, sort_order
          )
          VALUES ($1, $2, $3, NULLIF($4, ''), NULLIF($5, ''), $6, $7, $8)
        `,
        [
          testId,
          parameter.name,
          parameter.result,
          parameter.unit || '',
          parameter.reference || '',
          parameter.status || 'Normal',
          isAbnormal(parameter.status),
          index,
        ]
      )
    }

    for (const [index, finding] of findings.entries()) {
      await client.query(
        `
          INSERT INTO imaging_findings (test_id, label, value, sort_order)
          VALUES ($1, $2, $3, $4)
        `,
        [testId, finding.label, finding.value, index]
      )
    }

    await client.query(
      `
        INSERT INTO test_history (test_id, history_date, history_time, action, description, actor)
        VALUES ($1, TO_CHAR(CURRENT_DATE, 'DD.MM.YYYY'), TO_CHAR(CURRENT_TIME, 'HH24:MI'), $2, $3, $4)
      `,
      [testId, 'Tetkik istendi', `${type} kaydı oluşturuldu.`, actor.actorName]
    )

    await writeAudit(client, {
      ...actor,
      action: 'Tetkik kaydı oluşturuldu',
      page: 'Tetkikler',
      module: 'Tetkik Yönetimi',
      targetType: 'Tetkik',
      targetId: inserted.rows[0].test_no,
      targetName: `${patientResult.rows[0].full_name} - ${type}`,
      targetRoute: `/tetkikler/${inserted.rows[0].test_no}`,
      eventCode: 'TEST_CREATED',
      description: `${patientResult.rows[0].full_name} için ${type} tetkiki oluşturuldu.`,
    })

    return inserted.rows[0].test_no
  })

  return getTestByNo(createdTestNo)
}

export async function updateTestStatus(testNo, { status, reason, note, evaluation, patientInformed }, actor) {
  if (status && !VALID_STATUSES.includes(status)) {
    throw new HttpError(400, 'Tetkik durumu geçersiz.')
  }

  const cancellationReason = status === 'İptal Edildi'
    ? (reason === 'Diğer' ? note : reason)
    : null

  if (status === 'İptal Edildi' && !cancellationReason?.trim()) {
    throw new HttpError(400, 'İptal nedeni zorunludur.')
  }

  const result = await pool.query(
    `
      UPDATE medical_tests
      SET
        status = COALESCE($2, status),
        cancellation_reason = COALESCE($3, cancellation_reason),
        evaluation = COALESCE($4::jsonb, evaluation),
        patient_informed = COALESCE($5, patient_informed),
        updated_at = CURRENT_TIMESTAMP
      WHERE test_no = $1
      RETURNING id, test_no, status
    `,
    [
      testNo,
      status || null,
      cancellationReason,
      evaluation ? JSON.stringify(evaluation) : null,
      typeof patientInformed === 'boolean' ? patientInformed : null,
    ]
  )

  if (result.rowCount === 0) {
    throw new HttpError(404, 'Tetkik bulunamadı.')
  }

  await pool.query(
    `
      INSERT INTO test_history (test_id, history_date, history_time, action, description, actor)
      VALUES ($1, TO_CHAR(CURRENT_DATE, 'DD.MM.YYYY'), TO_CHAR(CURRENT_TIME, 'HH24:MI'), $2, $3, $4)
    `,
    [
      result.rows[0].id,
      'Tetkik durumu güncellendi',
      cancellationReason || `Durum ${result.rows[0].status} olarak güncellendi.`,
      actor.actorName,
    ]
  )

  await writeAudit(pool, {
    ...actor,
    action: 'Tetkik durumu güncellendi',
    page: 'Tetkikler',
    module: 'Tetkik Yönetimi',
    targetType: 'Tetkik',
    targetId: testNo,
    eventCode: 'TEST_STATUS_UPDATED',
    description: `${testNo} durumu güncellendi.`,
    afterSummary: { status: result.rows[0].status },
  })

  return getTestByNo(testNo)
}
