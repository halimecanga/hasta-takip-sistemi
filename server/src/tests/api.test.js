import assert from 'node:assert/strict'
import { after, afterEach, before, test } from 'node:test'
import pool from '../db/index.js'
import { ensureSuiteFixtures } from '../db/testFixtures.js'

const API = process.env.API_URL || 'http://localhost:5050'
const TEST_RUN = `TEST-${Date.now()}-${process.pid}`
const TEST_LIKE = `${TEST_RUN}%`

const request = async (path, options = {}) => {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  })
  const data = await response.json().catch(() => ({}))
  return { response, data }
}

const cleanupTestRecords = async () => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const examIds = await client.query(
      `
        SELECT id, examination_no
        FROM examinations
        WHERE complaint LIKE $1 OR findings LIKE $1 OR diagnosis LIKE $1 OR preliminary_diagnosis LIKE $1
      `,
      [TEST_LIKE]
    )
    const examPk = examIds.rows.map((row) => row.id)
    const examNos = examIds.rows.map((row) => row.examination_no)

    const rxIds = await client.query(
      `
        SELECT pr.id, pr.prescription_no
        FROM prescriptions pr
        LEFT JOIN examinations e ON e.id = pr.examination_id
        WHERE pr.diagnosis LIKE $1
           OR pr.complaint LIKE $1
           OR e.complaint LIKE $1
           OR e.findings LIKE $1
      `,
      [TEST_LIKE]
    )
    const rxPk = rxIds.rows.map((row) => row.id)
    const rxNos = rxIds.rows.map((row) => row.prescription_no)

    const apptIds = await client.query(
      `
        SELECT id, appointment_no
        FROM appointments
        WHERE reason LIKE $1 OR COALESCE(complaint, '') LIKE $1
      `,
      [TEST_LIKE]
    )
    const apptPk = apptIds.rows.map((row) => row.id)
    const apptNos = apptIds.rows.map((row) => row.appointment_no)

    const targetIds = [...examNos, ...rxNos, ...apptNos]

    if (targetIds.length > 0) {
      await client.query(
        `
          DELETE FROM activity_logs
          WHERE target_id = ANY($1::text[])
             OR COALESCE(description, '') LIKE $2
             OR COALESCE(target_name, '') LIKE $2
        `,
        [targetIds, TEST_LIKE]
      )
    } else {
      await client.query(
        `
          DELETE FROM activity_logs
          WHERE COALESCE(description, '') LIKE $1
             OR COALESCE(target_name, '') LIKE $1
        `,
        [TEST_LIKE]
      )
    }

    if (examPk.length > 0) {
      await client.query(
        `
          DELETE FROM payment_movements
          WHERE payment_id IN (
            SELECT id FROM examination_payments WHERE examination_id = ANY($1::bigint[])
          )
        `,
        [examPk]
      )
      await client.query(
        'DELETE FROM examination_payments WHERE examination_id = ANY($1::bigint[])',
        [examPk]
      )
      await client.query(
        'DELETE FROM examination_notes WHERE examination_id = ANY($1::bigint[])',
        [examPk]
      )
    }

    if (rxPk.length > 0) {
      await client.query(
        'DELETE FROM prescription_medicines WHERE prescription_id = ANY($1::bigint[])',
        [rxPk]
      )
      await client.query(
        'DELETE FROM prescriptions WHERE id = ANY($1::bigint[])',
        [rxPk]
      )
    }

    if (apptPk.length > 0) {
      await client.query(
        'DELETE FROM appointment_status_history WHERE appointment_id = ANY($1::bigint[])',
        [apptPk]
      )
      await client.query(
        'DELETE FROM appointments WHERE id = ANY($1::bigint[])',
        [apptPk]
      )
    }

    if (examPk.length > 0) {
      await client.query(
        'DELETE FROM examinations WHERE id = ANY($1::bigint[])',
        [examPk]
      )
    }

    await client.query('COMMIT')
  } catch (error) {
    try {
      await client.query('ROLLBACK')
    } catch {
      // ignore rollback failure
    }
    throw error
  } finally {
    client.release()
  }
}

before(async () => {
  await ensureSuiteFixtures()
})

afterEach(async () => {
  await cleanupTestRecords()
})

after(async () => {
  await cleanupTestRecords()
  await pool.end()
})

test('health endpoint çalışır', async () => {
  const { response, data } = await request('/api/health')
  assert.equal(response.status, 200)
  assert.equal(data.status, 'ok')
})

test('hasta listesi TC maskeli gelir', async () => {
  const { response, data } = await request('/api/patients')
  assert.equal(response.status, 200)
  assert.ok(Array.isArray(data))
  assert.ok(data.length >= 5)
  assert.ok(data.every((patient) => String(patient.identity).includes('*******')))
  assert.ok(!data.some((patient) => /Selin Demir|Utku İray/.test(patient.name)))
})

test('olmayan hasta 404 döner', async () => {
  const { response, data } = await request('/api/patients/HT-9999')
  assert.equal(response.status, 404)
  assert.ok(data.message)
})

test('zorunlu alan olmadan hasta 400 döner', async () => {
  const { response } = await request('/api/patients', {
    method: 'POST',
    body: JSON.stringify({ fullName: 'Test' }),
  })
  assert.equal(response.status, 400)
})

test('çift TC 409 döner', async () => {
  const existing = await request('/api/patients/HT-1042')
  const { response } = await request('/api/patients', {
    method: 'POST',
    body: JSON.stringify({
      fullName: 'Tekrar Hasta',
      identityNumber: existing.data.identityNumber,
      birthDate: '1990-01-01',
      gender: 'Kadın',
      phone: '0555 000 00 00',
    }),
  })
  assert.equal(response.status, 409)
})

test('geçersiz muayene durumu 400 döner', async () => {
  const { response } = await request('/api/examinations/DOS-2026-1002/status', {
    method: 'PATCH',
    body: JSON.stringify({ status: 'Geçersiz' }),
  })
  assert.equal(response.status, 400)
})

test('hasta detayı ilişkili kayıtlarla gelir', async () => {
  const { response, data } = await request('/api/patients/HT-1042')
  assert.equal(response.status, 200)
  assert.ok(Array.isArray(data.visits))
  if (data.visits[0]) {
    assert.ok(data.visits[0].payment)
    assert.ok('service' in data.visits[0].payment)
  }
})

test('ödeme hesaplaması backend tarafında yapılır', async () => {
  const { calculatePayment } = await import('../utils/money.js')
  const full = calculatePayment({ total: 1000, discount: 200, paid: 800 })
  assert.equal(full.payable, 800)
  assert.equal(full.remaining, 0)
  assert.equal(full.status, 'Ödendi')

  const partial = calculatePayment({ total: 1000, discount: 100, paid: 200 })
  assert.equal(partial.payable, 900)
  assert.equal(partial.paidAmount, 200)
  assert.equal(partial.remaining, 700)
  assert.equal(partial.status, 'Kısmi Ödeme')

  const waiting = calculatePayment({ total: 500, discount: 0, paid: 0 })
  assert.equal(waiting.status, 'Ödeme Bekliyor')
})

test('randevu çakışması 409 döner', async () => {
  const first = await request('/api/appointments', {
    method: 'POST',
    body: JSON.stringify({
      patientNo: 'HT-1042',
      dateIso: '2028-11-20',
      time: '09:00',
      type: 'Genel Muayene',
      reason: `${TEST_RUN} conflict-a`,
      duration: 30,
    }),
  })

  try {
    if (first.response.status === 201) {
      const second = await request('/api/appointments', {
        method: 'POST',
        body: JSON.stringify({
          patientNo: 'HT-1041',
          dateIso: '2028-11-20',
          time: '09:00',
          type: 'Genel Muayene',
          reason: `${TEST_RUN} conflict-b`,
          duration: 30,
        }),
      })
      assert.equal(second.response.status, 409)
    } else {
      assert.ok([400, 409].includes(first.response.status))
    }
  } finally {
    await cleanupTestRecords()
  }
})

test('yetkisiz dosya türü reddedilir', async () => {
  const form = new FormData()
  form.append('files', new Blob(['hello'], { type: 'text/plain' }), 'not-allowed.txt')
  const response = await fetch(`${API}/api/documents/examination/DOS-2026-1002`, {
    method: 'POST',
    body: form,
  })
  assert.equal(response.status, 400)
})

test('transaction rollback: olmayan hasta muayene 404', async () => {
  const { response } = await request('/api/patients/HT-0000/examinations', {
    method: 'POST',
    body: JSON.stringify({
      date: '2028-11-21',
      time: '10:00',
      type: 'Genel Muayene',
      complaint: `${TEST_RUN} missing-patient`,
      findings: `${TEST_RUN} findings`,
      diagnosis: `${TEST_RUN} diagnosis`,
    }),
  })
  assert.equal(response.status, 404)
})

test('tamamlanmış muayene kalıcı silinmez', async () => {
  const { response, data } = await request('/api/examinations/DOS-2026-1002', { method: 'DELETE' })
  assert.equal(response.status, 400)
  assert.ok(data.message)

  const stillThere = await request('/api/examinations')
  assert.ok(stillThere.data.some((item) => item.id === 'DOS-2026-1002'))

  const db = await pool.query(
    `SELECT status FROM examinations WHERE examination_no = 'DOS-2026-1002'`
  )
  assert.equal(db.rows[0].status, 'Tamamlandı')
})

test('taslak muayene iptal edilince durumu İptal olur', async () => {
  const created = await request('/api/patients/HT-1041/examinations', {
    method: 'POST',
    body: JSON.stringify({
      date: '2028-11-21',
      time: '11:15',
      type: 'Genel Muayene',
      status: 'Taslak',
      complaint: `${TEST_RUN} draft-exam`,
      findings: `${TEST_RUN} findings`,
      diagnosis: `${TEST_RUN} diagnosis`,
      service: 'Genel Muayene',
      total: 0,
      discount: 0,
      paid: 0,
      paymentMethod: 'Henüz Ödenmedi',
    }),
  })

  try {
    assert.equal(created.response.status, 201)
    const examNo = created.data.examination.id

    const cancelled = await request(`/api/examinations/${examNo}`, { method: 'DELETE' })
    assert.equal(cancelled.response.status, 200)
    assert.equal(cancelled.data.examination.status, 'İptal')

    const db = await pool.query(
      'SELECT status, cancellation_reason FROM examinations WHERE examination_no = $1',
      [examNo]
    )
    assert.equal(db.rowCount, 1)
    assert.equal(db.rows[0].status, 'İptal')
    assert.ok(db.rows[0].cancellation_reason)
  } finally {
    await cleanupTestRecords()
  }
})

test('taslak reçete iptal edilince durumu İptal olur', async () => {
  const created = await request('/api/patients/HT-1040/examinations', {
    method: 'POST',
    body: JSON.stringify({
      date: '2028-11-22',
      time: '14:30',
      type: 'Genel Muayene',
      status: 'Taslak',
      complaint: `${TEST_RUN} draft-rx-exam`,
      findings: `${TEST_RUN} findings`,
      diagnosis: `${TEST_RUN} draft-rx`,
      createPrescription: true,
      medicines: [{ name: `${TEST_RUN} ilac`, dose: '1 mg', frequency: '1x1', duration: '3 gün' }],
      service: 'Genel Muayene',
      total: 0,
      discount: 0,
      paid: 0,
      paymentMethod: 'Henüz Ödenmedi',
    }),
  })

  try {
    assert.equal(created.response.status, 201)

    const prescriptions = await request('/api/prescriptions')
    assert.equal(prescriptions.response.status, 200)
    const draft = prescriptions.data.find((item) => item.patientNo === 'HT-1040' && item.status === 'Taslak')
    assert.ok(draft, 'TEST taslak reçetesi bulunmalı')

    const cancelled = await request(`/api/prescriptions/${draft.id}`, { method: 'DELETE' })
    assert.equal(cancelled.response.status, 200)
    assert.equal(cancelled.data.prescription.status, 'İptal')

    const db = await pool.query(
      'SELECT status, cancellation_reason FROM prescriptions WHERE prescription_no = $1',
      [draft.id]
    )
    assert.equal(db.rowCount, 1)
    assert.equal(db.rows[0].status, 'İptal')
    assert.ok(db.rows[0].cancellation_reason)
  } finally {
    await cleanupTestRecords()
  }
})

test('şifre değiştirme yetkisizdir', async () => {
  const { response, data } = await request('/api/profile/password', {
    method: 'PATCH',
    body: JSON.stringify({ currentPassword: 'Klinik123!', nextPassword: 'YeniSifre123' }),
  })
  assert.equal(response.status, 403)
  assert.ok(data.message)
})

test('liste GET endpointleri yanıt verir', async () => {
  const paths = [
    '/api/dashboard',
    '/api/appointments',
    '/api/examinations',
    '/api/prescriptions',
    '/api/tests',
    '/api/staff',
    '/api/prices',
    '/api/logs',
    '/api/reports',
    '/api/settings',
    '/api/profile',
    '/api/support',
  ]

  for (const path of paths) {
    const { response, data } = await request(path)
    assert.equal(response.status, 200, `${path} 200 dönmeli`)
    assert.ok(data !== null && data !== undefined, `${path} gövde döndürmeli`)
  }
})
