import pool from '../db/index.js'
import { HttpError } from '../utils/errors.js'
import { writeAudit } from '../utils/audit.js'
import { getPatientVisits } from './examinationsService.js'

export async function listPatients() {
  const result = await pool.query(`
    SELECT
      patient_no AS "no",
      full_name AS "name",
      LEFT(identity_number, 2)
        || '*******'
        || RIGHT(identity_number, 2) AS "identity",
      phone,
      EXTRACT(YEAR FROM AGE(CURRENT_DATE, birth_date))::INTEGER AS "age",
      gender,
      COALESCE(
        TO_CHAR(
          (
            SELECT MAX(examination_date)
            FROM examinations
            WHERE patient_id = patients.id
          ),
          'DD.MM.YYYY'
        ),
        'Henüz yok'
      ) AS "lastExam",
      status
    FROM patients
    ORDER BY id
  `)

  return result.rows
}

export async function createPatient(payload, actor) {
  const {
    fullName,
    identityNumber,
    birthDate,
    gender,
    phone,
    email,
    bloodType,
    allergy,
    chronicDisease,
    regularMedicine,
  } = payload

  if (!fullName || !identityNumber || !birthDate || !gender || !phone) {
    throw new HttpError(400, 'Ad soyad, TC kimlik, doğum tarihi, cinsiyet ve telefon zorunludur.')
  }

  if (!/^\d{11}$/.test(identityNumber)) {
    throw new HttpError(400, 'TC kimlik numarası 11 rakamdan oluşmalıdır.')
  }

  try {
    const patientNoResult = await pool.query(`
      SELECT 'HT-' ||
        (
          COALESCE(
            MAX(CAST(SUBSTRING(patient_no FROM '[0-9]+') AS INTEGER)),
            1000
          ) + 1
        ) AS patient_no
      FROM patients
    `)

    const patientNo = patientNoResult.rows[0].patient_no

    const result = await pool.query(
      `
        INSERT INTO patients (
          patient_no, full_name, identity_number, birth_date, gender, phone,
          email, blood_type, allergy, chronic_disease, regular_medicine, status
        )
        VALUES (
          $1, $2, $3, $4, $5, $6,
          NULLIF($7, ''), NULLIF($8, ''), NULLIF($9, ''), NULLIF($10, ''), NULLIF($11, ''),
          'Aktif'
        )
        RETURNING
          patient_no AS "no",
          full_name AS "name",
          identity_number AS "identityNumber",
          birth_date AS "birthDate",
          gender,
          phone,
          email,
          blood_type AS "bloodType",
          allergy,
          chronic_disease AS "chronicDisease",
          regular_medicine AS "regularMedicine",
          status
      `,
      [
        patientNo,
        fullName.trim(),
        identityNumber,
        birthDate,
        gender,
        phone.trim(),
        email?.trim() || '',
        bloodType || '',
        allergy?.trim() || '',
        chronicDisease?.trim() || '',
        regularMedicine?.trim() || '',
      ]
    )

    await writeAudit(pool, {
      ...actor,
      action: 'Hasta kaydı oluşturuldu',
      page: 'Hastalar',
      module: 'Hasta Yönetimi',
      targetType: 'Hasta',
      targetId: patientNo,
      targetName: fullName.trim(),
      targetRoute: `/hastalar/${patientNo}`,
      eventCode: 'PATIENT_CREATED',
      description: `${fullName.trim()} hasta kaydı oluşturuldu.`,
      afterSummary: { patientNo, status: 'Aktif' },
    })

    return result.rows[0]
  } catch (error) {
    if (error.code === '23505') {
      throw new HttpError(409, 'Bu TC kimlik numarası veya e-posta zaten kayıtlı.')
    }
    if (error.code === '23514') {
      throw new HttpError(400, 'Cinsiyet veya hasta durumu geçersiz.')
    }
    throw error
  }
}

export async function archivePatient(patientNo, actor) {
  const result = await pool.query(
    `
      UPDATE patients
      SET
        previous_status = status,
        status = 'Arşivlendi',
        updated_at = CURRENT_TIMESTAMP
      WHERE patient_no = $1
        AND status <> 'Arşivlendi'
      RETURNING
        patient_no AS "no",
        status,
        previous_status AS "previousStatus"
    `,
    [patientNo]
  )

  if (result.rowCount === 0) {
    throw new HttpError(404, 'Hasta bulunamadı veya zaten arşivlenmiş.')
  }

  await writeAudit(pool, {
    ...actor,
    action: 'Hasta arşivlendi',
    page: 'Hastalar',
    module: 'Hasta Yönetimi',
    targetType: 'Hasta',
    targetId: patientNo,
    targetRoute: `/hastalar/${patientNo}`,
    eventCode: 'PATIENT_ARCHIVED',
    description: `${patientNo} numaralı hasta arşivlendi.`,
    afterSummary: { status: 'Arşivlendi' },
  })

  return result.rows[0]
}

export async function restorePatient(patientNo, actor) {
  const result = await pool.query(
    `
      UPDATE patients
      SET
        status = COALESCE(previous_status, 'Aktif'),
        previous_status = NULL,
        updated_at = CURRENT_TIMESTAMP
      WHERE patient_no = $1
        AND status = 'Arşivlendi'
      RETURNING
        patient_no AS "no",
        status,
        previous_status AS "previousStatus"
    `,
    [patientNo]
  )

  if (result.rowCount === 0) {
    throw new HttpError(404, 'Hasta bulunamadı veya arşivde değil.')
  }

  await writeAudit(pool, {
    ...actor,
    action: 'Hasta arşivden çıkarıldı',
    page: 'Hastalar',
    module: 'Hasta Yönetimi',
    targetType: 'Hasta',
    targetId: patientNo,
    targetRoute: `/hastalar/${patientNo}`,
    eventCode: 'PATIENT_RESTORED',
    description: `${patientNo} numaralı hasta geri yüklendi.`,
    afterSummary: { status: result.rows[0].status },
  })

  return result.rows[0]
}

export async function getPatientByNo(patientNo) {
  const result = await pool.query(
    `
      SELECT
        id AS "databaseId",
        patient_no AS "id",
        full_name AS "name",
        identity_number AS "identityNumber",
        TO_CHAR(birth_date, 'YYYY-MM-DD') AS "birthDate",
        EXTRACT(YEAR FROM AGE(CURRENT_DATE, birth_date))::INTEGER AS "age",
        gender,
        phone,
        email,
        blood_type AS "bloodType",
        allergy,
        chronic_disease AS "chronicDisease",
        regular_medicine AS "regularMedicine",
        TO_CHAR(created_at, 'YYYY-MM-DD') AS "registeredAt",
        CASE
          WHEN status = 'Aktif' THEN 'Aktif Hasta'
          WHEN status = 'Pasif' THEN 'Pasif Hasta'
          ELSE status
        END AS "status"
      FROM patients
      WHERE patient_no = $1
    `,
    [patientNo]
  )

  if (result.rowCount === 0) {
    throw new HttpError(404, 'Hasta bulunamadı.')
  }

  const patient = result.rows[0]
  const visits = await getPatientVisits(patient.databaseId)
  const nextControlVisit = visits.find(
    (visit) => visit.overview.controlDate && visit.overview.controlDate !== 'Gerekli değil'
  )

  return {
    ...patient,
    databaseId: undefined,
    lastVisit: visits[0]?.date || null,
    paymentStatus: visits[0]?.payment?.status || null,
    nextControl: nextControlVisit?.overview.controlDate || null,
    visits,
  }
}

export async function getPatientOptions() {
  const result = await pool.query(`
    SELECT
      patient_no AS "no",
      full_name AS "name",
      phone,
      email
    FROM patients
    WHERE status <> 'Arşivlendi'
    ORDER BY full_name
  `)

  return result.rows
}
