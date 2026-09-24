import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pool from './index.js'
import { createUnusablePasswordHash } from '../services/settingsService.js'

const staffSeed = [
  {
    no: 'PRS-001',
    name: 'Dr. Cumhur Kesemenli',
    initials: 'CK',
    role: 'Doktor / Yönetici',
    roleType: 'doctor',
    department: 'Dahiliye',
    phone: '0532 410 22 18',
    email: 'cumhur@klinik.com',
    birthDate: '12 Mart 1978',
    hireDate: '15 Ocak 2019',
    start: '09:00',
    end: '18:00',
    address: 'Atatürk Mah. Klinik Sok. No: 12, Kadıköy / İstanbul',
    emergencyName: 'Deniz Kesemenli',
    emergencyPhone: '0532 410 22 19',
    note: 'Klinik medikal süreçleri ve kalite kontrollerinden sorumludur.',
    roleTitle: 'Doktor Bilgileri',
    roleItems: [
      { label: 'Uzmanlık Alanı', value: 'Dahiliye' },
      { label: 'Diploma Numarası', value: 'DPL-2004-1182' },
      { label: 'Tescil Numarası', value: 'TSC-347812' },
      { label: 'Yetki', value: 'Muayene, reçete ve klinik onay' },
    ],
    leaveAnnual: 24,
    leaveUsed: 6,
    leaveRemaining: 18,
  },
  {
    no: 'PRS-002',
    name: 'Ayşe Demir',
    initials: 'AD',
    role: 'Hemşire',
    roleType: 'nurse',
    department: 'Genel Klinik',
    phone: '0533 118 70 42',
    email: 'ayse@klinik.com',
    birthDate: '08 Temmuz 1991',
    hireDate: '03 Mart 2021',
    start: '08:00',
    end: '17:00',
  },
  {
    no: 'PRS-003',
    name: 'Zeynep Kaya',
    initials: 'ZK',
    role: 'Hemşire',
    roleType: 'nurse',
    department: 'Genel Klinik',
    phone: '0542 302 40 19',
    email: 'zeynep@klinik.com',
    birthDate: '22 Kasım 1993',
    hireDate: '11 Eylül 2022',
    start: '08:00',
    end: '17:00',
  },
  {
    no: 'PRS-004',
    name: 'Merve Şahin',
    initials: 'MŞ',
    role: 'Tıbbi Sekreter',
    roleType: 'secretary',
    department: 'Hasta Kabul',
    phone: '0505 610 83 26',
    email: 'merve@klinik.com',
    birthDate: '14 Nisan 1996',
    hireDate: '02 Şubat 2023',
    start: '09:00',
    end: '18:00',
  },
  {
    no: 'PRS-005',
    name: 'Burak Yıldız',
    initials: 'BY',
    role: 'Hasta Danışmanı',
    roleType: 'advisor',
    department: 'Hasta İlişkileri',
    phone: '0536 240 18 90',
    email: 'burak@klinik.com',
    birthDate: '19 Ağustos 1994',
    hireDate: '20 Mayıs 2023',
    start: '09:00',
    end: '18:00',
  },
  {
    no: 'PRS-006',
    name: 'Selin Acar',
    initials: 'SA',
    role: 'Muhasebe Sorumlusu',
    roleType: 'accounting',
    department: 'Muhasebe',
    phone: '0552 410 12 45',
    email: 'selin@klinik.com',
    birthDate: '03 Ocak 1990',
    hireDate: '08 Ocak 2022',
    start: '09:00',
    end: '18:00',
  },
  {
    no: 'PRS-007',
    name: 'Emre Koç',
    initials: 'EK',
    role: 'Destek Personeli',
    roleType: 'support',
    department: 'Destek Hizmetleri',
    phone: '0544 280 19 63',
    email: 'emre@klinik.com',
    birthDate: '27 Eylül 1997',
    hireDate: '15 Nisan 2024',
    start: '09:00',
    end: '18:00',
    status: 'İzinli',
  },
]

const priceSeed = [
  { no: 'PRICE-001', name: 'Genel Muayene', category: 'Muayene', price: 1250, description: 'Dahiliye genel muayene hizmeti', status: 'Aktif', vatRate: 20, discountAllowed: true, minimumPrice: 1000, duration: 30, usageArea: 'Dahiliye polikliniği', usageCount: 3, internalNote: 'Standart doktor muayenesi fiyatıdır.' },
  { no: 'PRICE-002', name: 'Kontrol Muayenesi', category: 'Muayene', price: 750, description: 'İlk muayene sonrası kontrol', status: 'Aktif', vatRate: 20, discountAllowed: true, minimumPrice: 600, duration: 20, usageArea: 'Kontrol muayeneleri', usageCount: 0, internalNote: 'İlk muayene sonrası 15 gün içinde kullanılır.' },
  { no: 'PRICE-003', name: 'Kan Tahlili', category: 'Laboratuvar', price: 980, description: 'Temel hemogram ve biyokimya', status: 'Aktif', vatRate: 10, discountAllowed: false, minimumPrice: 980, duration: 15, usageArea: 'Laboratuvar', usageCount: 0, internalNote: 'Paket dışı ek tetkikler ayrıca ücretlendirilir.' },
  { no: 'PRICE-004', name: 'Röntgen', category: 'Görüntüleme', price: 1100, description: 'Tek bölge dijital röntgen', status: 'Aktif', vatRate: 10, discountAllowed: true, minimumPrice: 950, duration: 20, usageArea: 'Görüntüleme birimi', usageCount: 0 },
  { no: 'PRICE-005', name: 'Ultrason', category: 'Görüntüleme', price: 1850, description: 'Standart ultrason görüntüleme', status: 'Aktif', vatRate: 10, discountAllowed: true, minimumPrice: 1600, duration: 25, usageArea: 'Görüntüleme birimi', usageCount: 0 },
  { no: 'PRICE-006', name: 'Aşı Uygulaması', category: 'Uygulama', price: 600, description: 'Aşı bedeli hariç uygulama ücreti', status: 'Pasif', vatRate: 20, discountAllowed: false, minimumPrice: 600, duration: 10, usageArea: 'Hemşire uygulama odası', usageCount: 0, vatIncluded: false, patientVisible: false },
]

const appointmentSeed = [
  { no: 'RND-2026-001', patientNo: 'HT-1042', date: '2026-06-04', time: '09:30', type: 'Genel Muayene', status: 'Onaylandı', reason: 'Genel muayene' },
  { no: 'RND-2026-002', patientNo: 'HT-1041', date: '2026-06-04', time: '10:15', type: 'Dahiliye Muayenesi', status: 'Bekliyor', reason: 'Dahiliye kontrolü' },
  { no: 'RND-2026-003', patientNo: 'HT-1040', date: '2026-06-04', time: '11:00', type: 'Kontrol Muayenesi', status: 'Tamamlandı', reason: 'Kontrol muayenesi' },
  { no: 'RND-2026-004', patientNo: 'HT-1039', date: '2026-06-05', time: '13:45', type: 'Genel Muayene', status: 'İptal Edildi', reason: 'Genel muayene' },
  { no: 'RND-2026-005', patientNo: 'HT-1038', date: '2026-06-05', time: '15:20', type: 'Tetkik Değerlendirme', status: 'Onaylandı', reason: 'Tetkik değerlendirme' },
]

async function seedStaff() {
  const count = await pool.query('SELECT COUNT(*)::INTEGER AS total FROM staff')
  if (count.rows[0].total > 0) return

  for (const person of staffSeed) {
    const inserted = await pool.query(
      `
        INSERT INTO staff (
          staff_no, full_name, initials, role, role_type, department, status,
          phone, email, birth_date, hire_date, work_start, work_end, address,
          emergency_name, emergency_phone, note, role_title, role_items,
          leave_annual, leave_used, leave_remaining
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::TIME, $13::TIME,
          $14, $15, $16, $17, $18, $19::jsonb, $20, $21, $22
        )
        ON CONFLICT (staff_no) DO NOTHING
        RETURNING id
      `,
      [
        person.no,
        person.name,
        person.initials,
        person.role,
        person.roleType,
        person.department,
        person.status || 'Aktif',
        person.phone,
        person.email,
        person.birthDate || null,
        person.hireDate || null,
        person.start,
        person.end,
        person.address || null,
        person.emergencyName || null,
        person.emergencyPhone || null,
        person.note || null,
        person.roleTitle || 'Personel Bilgileri',
        JSON.stringify(person.roleItems || [
          { label: 'Sorumlu Alan', value: person.department },
          { label: 'Çalışma Şekli', value: 'Tam Zamanlı' },
        ]),
        person.leaveAnnual || 20,
        person.leaveUsed || 0,
        person.leaveRemaining ?? 20,
      ]
    )

    const staffId = inserted.rows[0]?.id
    if (!staffId) continue

    for (const [index, day] of ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'].entries()) {
      await pool.query(
        `
          INSERT INTO staff_schedules (staff_id, day_name, shift, location, sort_order)
          VALUES ($1, $2, $3, $4, $5)
        `,
        [staffId, day, `${person.start} - ${person.end}`, 'Ana Klinik', index]
      )
    }
  }

  await pool.query(`SELECT setval('staff_no_seq', GREATEST((SELECT COUNT(*) FROM staff), 1))`)
}

async function seedPrices() {
  const count = await pool.query('SELECT COUNT(*)::INTEGER AS total FROM price_list')
  if (count.rows[0].total > 0) return

  for (const item of priceSeed) {
    await pool.query(
      `
        INSERT INTO price_list (
          price_no, name, category, price, description, status, vat_rate,
          vat_included, discount_allowed, minimum_price, duration, usage_area,
          patient_visible, usage_count, internal_note
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        ON CONFLICT (price_no) DO NOTHING
      `,
      [
        item.no,
        item.name,
        item.category,
        item.price,
        item.description,
        item.status,
        item.vatRate,
        item.vatIncluded !== false,
        item.discountAllowed !== false,
        item.minimumPrice,
        item.duration,
        item.usageArea,
        item.patientVisible !== false,
        item.usageCount || 0,
        item.internalNote || null,
      ]
    )
  }

  await pool.query(`SELECT setval('price_no_seq', GREATEST((SELECT COUNT(*) FROM price_list), 1))`)
}

async function seedAppointments() {
  const count = await pool.query('SELECT COUNT(*)::INTEGER AS total FROM appointments')
  if (count.rows[0].total > 0) return

  const doctor = await pool.query(`SELECT id FROM staff WHERE role_type = 'doctor' ORDER BY id LIMIT 1`)
  const doctorId = doctor.rows[0]?.id || null

  for (const item of appointmentSeed) {
    await pool.query(
      `
        INSERT INTO appointments (
          appointment_no, patient_id, doctor_id, appointment_date, appointment_time,
          appointment_type, status, reason
        )
        SELECT $1, patients.id, $2, $3::DATE, $4::TIME, $5, $6, $7
        FROM patients
        WHERE patients.patient_no = $8
        ON CONFLICT (appointment_no) DO NOTHING
      `,
      [item.no, doctorId, item.date, item.time, item.type, item.status, item.reason, item.patientNo]
    )
  }

  await pool.query(`SELECT setval('appointment_no_seq', GREATEST((SELECT COUNT(*) FROM appointments), 1))`)
}

async function seedTests() {
  const count = await pool.query('SELECT COUNT(*)::INTEGER AS total FROM medical_tests')
  if (count.rows[0].total > 0) return

  const tests = [
    {
      no: 'TET-2026-0001',
      patientNo: 'HT-1042',
      type: 'Tam Kan Sayımı',
      category: 'Laboratuvar',
      reason: 'Baş dönmesi ve halsizlik nedeniyle anemi değerlendirmesi.',
      date: '2026-06-04',
      status: 'Bekliyor',
      sampleType: 'Venöz kan',
      unit: 'Klinik Laboratuvar',
      summary: 'Bu tetkikin sonucu henüz hazır değil.',
    },
    {
      no: 'TET-2026-0002',
      patientNo: 'HT-1041',
      type: 'EKG',
      category: 'Kardiyoloji',
      reason: 'Kan şekeri takibi sırasında çarpıntı şikayeti değerlendirmesi.',
      date: '2026-06-03',
      status: 'Hazır',
      sampleType: 'EKG çıktısı',
      unit: 'Kardiyoloji birimi',
      summary: 'Akut iskemik değişiklik saptanmadı.',
      findings: [
        { label: 'Ritim', value: 'Sinüs ritmi' },
        { label: 'Kalp hızı', value: '78/dk' },
        { label: 'Bulgular', value: 'ST-T değişikliği izlenmedi.' },
        { label: 'Sonuç', value: 'Akut iskemik değişiklik saptanmadı.' },
      ],
    },
    {
      no: 'TET-2026-0003',
      patientNo: 'HT-1040',
      type: 'Diz MR',
      category: 'Görüntüleme',
      reason: 'Diz ağrısı kontrolü ve menisküs değerlendirmesi.',
      date: '2026-06-03',
      status: 'Hazır',
      sampleType: 'MR görüntüleme',
      unit: 'Görüntüleme birimi',
      summary: 'Grade 2 menisküs dejenerasyonu ile uyumlu bulgular.',
      findings: [
        { label: 'İncelenen bölge', value: 'Sağ diz' },
        { label: 'Bulgular', value: 'Medial menisküs arka boynuzunda dejeneratif sinyal artışı izlendi.' },
        { label: 'Sonuç', value: 'Grade 2 menisküs dejenerasyonu ile uyumlu bulgular.' },
      ],
    },
    {
      no: 'TET-2026-0004',
      patientNo: 'HT-1038',
      type: 'Alerji Paneli',
      category: 'Laboratuvar',
      reason: 'Nefes darlığı ve alerjik reaksiyon değerlendirmesi.',
      date: '2026-06-02',
      status: 'İnceleniyor',
      sampleType: 'Serum',
      unit: 'Klinik Laboratuvar',
      summary: 'Bazı alerjenlerde yüksek duyarlılık saptandı; doktor incelemesi sürüyor.',
      parameters: [
        { name: 'Total IgE', result: '185', unit: 'IU/mL', reference: '0-100', status: 'Yüksek' },
        { name: 'Polen karışımı', result: 'Pozitif', unit: 'kU/L', reference: 'Negatif', status: 'Yüksek' },
        { name: 'Ev tozu akarı', result: 'Sınırda', unit: 'kU/L', reference: 'Negatif', status: 'Yüksek' },
        { name: 'Gıda paneli', result: 'Negatif', unit: 'kU/L', reference: 'Negatif', status: 'Normal' },
      ],
    },
  ]

  for (const item of tests) {
    const inserted = await pool.query(
      `
        INSERT INTO medical_tests (
          test_no, patient_id, test_type, category, request_reason, test_date,
          status, sample_type, unit, summary
        )
        SELECT $1, patients.id, $2, $3, $4, $5::DATE, $6, $7, $8, $9
        FROM patients
        WHERE patients.patient_no = $10
        ON CONFLICT (test_no) DO NOTHING
        RETURNING id
      `,
      [item.no, item.type, item.category, item.reason, item.date, item.status, item.sampleType, item.unit, item.summary, item.patientNo]
    )

    const testId = inserted.rows[0]?.id
    if (!testId) continue

    for (const [index, parameter] of (item.parameters || []).entries()) {
      await pool.query(
        `
          INSERT INTO laboratory_results (
            test_id, parameter_name, result_value, unit, reference_range, status, is_abnormal, sort_order
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `,
        [testId, parameter.name, parameter.result, parameter.unit, parameter.reference, parameter.status, parameter.status !== 'Normal', index]
      )
    }

    for (const [index, finding] of (item.findings || []).entries()) {
      await pool.query(
        `
          INSERT INTO imaging_findings (test_id, label, value, sort_order)
          VALUES ($1, $2, $3, $4)
        `,
        [testId, finding.label, finding.value, index]
      )
    }
  }

  await pool.query(`SELECT setval('test_no_seq', GREATEST((SELECT COUNT(*) FROM medical_tests), 1))`)
}

async function seedSettings() {
  const settings = await pool.query('SELECT 1 FROM clinic_settings WHERE id = 1')
  if (settings.rowCount === 0) {
    await pool.query(`
      INSERT INTO clinic_settings (id, clinic_name, phone, email, tax_number, address)
      VALUES (1, 'Cumhur Kesemenli Sağlık Kliniği', '+90 212 555 24 24', 'bilgi@klinik.com', '1234567890', 'Merkez Mah. Sağlık Cad. No: 24, İstanbul')
    `)
  }

  const profile = await pool.query('SELECT 1 FROM user_profiles WHERE id = 1')
  if (profile.rowCount === 0) {
    const doctor = await pool.query(`SELECT id FROM staff WHERE role_type = 'doctor' ORDER BY id LIMIT 1`)
    const { salt, hash } = createUnusablePasswordHash()
    await pool.query(
      `
        INSERT INTO user_profiles (
          id, staff_id, full_name, email, phone, role, specialty, diploma_no, password_salt, password_hash
        )
        VALUES (1, $1, 'Dr. Cumhur Kesemenli', 'cumhur@klinik.com', '0532 410 22 18', 'Doktor / Yönetici', 'Dahiliye', 'TR-DR-28419', $2, $3)
      `,
      [doctor.rows[0]?.id || null, salt, hash]
    )
  }
}

export async function runSeed() {
  await seedStaff()
  await seedPrices()
  await seedAppointments()
  await seedTests()
  await seedSettings()
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runSeed()
    .then(async () => {
      console.log('Seed işlemi tamamlandı.')
      await pool.end()
    })
    .catch(async (error) => {
      console.error('Seed hatası:', error)
      await pool.end()
      process.exit(1)
    })
}
