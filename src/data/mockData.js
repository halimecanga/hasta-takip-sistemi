export const appointments = [
  { patientNo: 'HT-1042', patient: 'Ayşe Yılmaz', date: '04 Haz 2026', dateIso: '2026-06-04', time: '09:30', department: 'Genel Muayene', status: 'Onaylandı' },
  { patientNo: 'HT-1041', patient: 'Mehmet Kaya', date: '04 Haz 2026', dateIso: '2026-06-04', time: '10:15', department: 'Dahiliye Muayenesi', status: 'Bekliyor' },
  { patientNo: 'HT-1040', patient: 'Zeynep Arslan', date: '04 Haz 2026', dateIso: '2026-06-04', time: '11:00', department: 'Kontrol Muayenesi', status: 'Tamamlandı' },
  { patientNo: 'HT-1039', patient: 'Ali Çetin', date: '05 Haz 2026', dateIso: '2026-06-05', time: '13:45', department: 'Genel Muayene', status: 'İptal Edildi' },
  { patientNo: 'HT-1038', patient: 'Emine Şahin', date: '05 Haz 2026', dateIso: '2026-06-05', time: '15:20', department: 'Tetkik Değerlendirme', status: 'Onaylandı' },
]

export const patients = [
  { no: 'HT-1042', name: 'Ayşe Yılmaz', identity: '42******18', phone: '0532 421 18 26', age: 42, gender: 'Kadın', lastExam: '28 May 2026', status: 'Aktif' },
  { no: 'HT-1041', name: 'Mehmet Kaya', identity: '31******64', phone: '0544 315 09 12', age: 57, gender: 'Erkek', lastExam: '26 May 2026', status: 'Aktif' },
  { no: 'HT-1040', name: 'Zeynep Arslan', identity: '55******32', phone: '0505 782 44 60', age: 29, gender: 'Kadın', lastExam: '20 May 2026', status: 'Aktif' },
  { no: 'HT-1039', name: 'Ali Çetin', identity: '18******90', phone: '0536 118 25 71', age: 64, gender: 'Erkek', lastExam: '14 May 2026', status: 'Pasif' },
  { no: 'HT-1038', name: 'Emine Şahin', identity: '60******44', phone: '0552 337 81 03', age: 36, gender: 'Kadın', lastExam: '08 May 2026', status: 'Aktif' },
]

export const examinations = [
  { id: 'EXM-2026-001', patientNo: 'HT-1042', visitId: 'DOS-2026-003', patient: 'Ayşe Yılmaz', date: '04 Haz 2026', complaint: 'Baş dönmesi ve halsizlik', diagnosis: 'Demir eksikliği şüphesi', status: 'Bekliyor' },
  { id: 'EXM-2026-002', patientNo: 'HT-1040', visitId: 'DOS-2026-005', patient: 'Zeynep Arslan', date: '04 Haz 2026', complaint: 'Diz ağrısı kontrolü', diagnosis: 'Kas zorlanması', status: 'Tamamlandı' },
  { id: 'EXM-2026-003', patientNo: 'HT-1041', visitId: 'DOS-2026-006', patient: 'Mehmet Kaya', date: '04 Haz 2026', complaint: 'Kan şekeri takibi', diagnosis: 'Tip 2 diyabet', status: 'Takipte' },
  { id: 'EXM-2026-004', patientNo: 'HT-1038', visitId: 'DOS-2026-008', patient: 'Emine Şahin', date: '02 Haz 2026', complaint: 'Nefes darlığı', diagnosis: 'Alerjik reaksiyon', status: 'Tamamlandı' },
]

export const prescriptions = [
  { id: 'REC-2026-001', patientNo: 'HT-1040', visitId: 'DOS-2026-005', patient: 'Zeynep Arslan', count: 2, date: '04 Haz 2026', status: 'Aktif' },
  { id: 'REC-2026-002', patientNo: 'HT-1041', visitId: 'DOS-2026-006', patient: 'Mehmet Kaya', count: 3, date: '03 Haz 2026', status: 'Aktif' },
  { id: 'REC-2026-003', patientNo: 'HT-1038', visitId: 'DOS-2026-008', patient: 'Emine Şahin', count: 1, date: '02 Haz 2026', status: 'Tamamlandı' },
  { id: 'REC-2026-004', patientNo: 'HT-1039', visitId: 'DOS-2026-007', patient: 'Ali Çetin', count: 4, date: '28 May 2026', status: 'Süresi Doldu' },
]

export const tests = [
  { id: 'TET-2026-001', patientNo: 'HT-1042', visitId: 'DOS-2026-003', patient: 'Ayşe Yılmaz', type: 'Tam Kan Sayımı', date: '04 Haz 2026', dateIso: '2026-06-04', status: 'Bekliyor' },
  { id: 'TET-2026-002', patientNo: 'HT-1041', visitId: 'DOS-2026-006', patient: 'Mehmet Kaya', type: 'EKG', date: '03 Haz 2026', dateIso: '2026-06-03', status: 'Hazır' },
  { id: 'TET-2026-003', patientNo: 'HT-1040', visitId: 'DOS-2026-005', patient: 'Zeynep Arslan', type: 'Diz MR', date: '03 Haz 2026', dateIso: '2026-06-03', status: 'Hazır' },
  { id: 'TET-2026-004', patientNo: 'HT-1038', visitId: 'DOS-2026-008', patient: 'Emine Şahin', type: 'Alerji Paneli', date: '02 Haz 2026', dateIso: '2026-06-02', status: 'İnceleniyor' },
]

export const staff = [
  { id: 'PRS-001', name: 'Dr. Cumhur Kesemenli', role: 'Doktor / Yönetici', department: 'Dahiliye', phone: '0532 410 22 18', email: 'cumhur@klinik.com', status: 'Aktif', initials: 'CK' },
  { id: 'PRS-002', name: 'Ayşe Demir', role: 'Hemşire', department: 'Genel Klinik', phone: '0533 118 70 42', email: 'ayse@klinik.com', status: 'Aktif', initials: 'AD' },
  { id: 'PRS-003', name: 'Zeynep Kaya', role: 'Hemşire', department: 'Genel Klinik', phone: '0542 302 40 19', email: 'zeynep@klinik.com', status: 'Aktif', initials: 'ZK' },
  { id: 'PRS-004', name: 'Merve Şahin', role: 'Tıbbi Sekreter', department: 'Hasta Kabul', phone: '0505 610 83 26', email: 'merve@klinik.com', status: 'Aktif', initials: 'MŞ' },
  { id: 'PRS-005', name: 'Burak Yıldız', role: 'Hasta Danışmanı', department: 'Hasta İlişkileri', phone: '0536 240 18 90', email: 'burak@klinik.com', status: 'Aktif', initials: 'BY' },
  { id: 'PRS-006', name: 'Selin Acar', role: 'Muhasebe Sorumlusu', department: 'Muhasebe', phone: '0552 410 12 45', email: 'selin@klinik.com', status: 'Aktif', initials: 'SA' },
  { id: 'PRS-007', name: 'Emre Koç', role: 'Destek Personeli', department: 'Destek Hizmetleri', phone: '0544 280 19 63', email: 'emre@klinik.com', status: 'İzinli', initials: 'EK' },
]

export const priceList = [
  { id: 'PRICE-001', name: 'Genel Muayene', category: 'Muayene', price: 1250, description: 'Dahiliye genel muayene hizmeti', status: 'Aktif', createdAt: '12 Ocak 2026', updatedAt: '01 Haziran 2026', vatRate: 20, vatIncluded: true, discountAllowed: true, minimumPrice: 1000, duration: 30, usageArea: 'Dahiliye polikliniği', patientVisible: true, includedInInvoice: true, usageCount: 42, internalNote: 'Standart doktor muayenesi fiyatıdır.' },
  { id: 'PRICE-002', name: 'Kontrol Muayenesi', category: 'Muayene', price: 750, description: 'İlk muayene sonrası kontrol', status: 'Aktif', createdAt: '12 Ocak 2026', updatedAt: '01 Haziran 2026', vatRate: 20, vatIncluded: true, discountAllowed: true, minimumPrice: 600, duration: 20, usageArea: 'Kontrol muayeneleri', patientVisible: true, includedInInvoice: true, usageCount: 28, internalNote: 'İlk muayene sonrası 15 gün içinde kullanılır.' },
  { id: 'PRICE-003', name: 'Kan Tahlili', category: 'Laboratuvar', price: 980, description: 'Temel hemogram ve biyokimya', status: 'Aktif', createdAt: '20 Ocak 2026', updatedAt: '28 Mayıs 2026', vatRate: 10, vatIncluded: true, discountAllowed: false, minimumPrice: 980, duration: 15, usageArea: 'Laboratuvar', patientVisible: true, includedInInvoice: true, usageCount: 16, internalNote: 'Paket dışı ek tetkikler ayrıca ücretlendirilir.' },
  { id: 'PRICE-004', name: 'Röntgen', category: 'Görüntüleme', price: 1100, description: 'Tek bölge dijital röntgen', status: 'Aktif', createdAt: '05 Şubat 2026', updatedAt: '22 Mayıs 2026', vatRate: 10, vatIncluded: true, discountAllowed: true, minimumPrice: 950, duration: 20, usageArea: 'Görüntüleme birimi', patientVisible: true, includedInInvoice: true, usageCount: 9, internalNote: 'Tek bölge çekim fiyatıdır.' },
  { id: 'PRICE-005', name: 'Ultrason', category: 'Görüntüleme', price: 1850, description: 'Standart ultrason görüntüleme', status: 'Aktif', createdAt: '05 Şubat 2026', updatedAt: '25 Mayıs 2026', vatRate: 10, vatIncluded: true, discountAllowed: true, minimumPrice: 1600, duration: 25, usageArea: 'Görüntüleme birimi', patientVisible: true, includedInInvoice: true, usageCount: 7, internalNote: 'Bölge sayısına göre farklı fiyat uygulanabilir.' },
  { id: 'PRICE-006', name: 'Aşı Uygulaması', category: 'Uygulama', price: 600, description: 'Aşı bedeli hariç uygulama ücreti', status: 'Pasif', createdAt: '18 Mart 2026', updatedAt: '30 Mayıs 2026', vatRate: 20, vatIncluded: false, discountAllowed: false, minimumPrice: 600, duration: 10, usageArea: 'Hemşire uygulama odası', patientVisible: false, includedInInvoice: true, usageCount: 0, internalNote: 'Aşı tedarik bedeli bu kaleme dahil değildir.' },
]

export const logs = [
  { user: 'Dr. Cumhur Kesemenli', action: 'Hasta kaydı güncellendi', page: 'Hastalar', date: '04 Haz 2026', time: '10:42', status: 'Başarılı' },
  { user: 'Merve Şahin', action: 'Yeni randevu oluşturuldu', page: 'Randevular', date: '04 Haz 2026', time: '10:28', status: 'Başarılı' },
  { user: 'Ayşe Demir', action: 'Tetkik sonucu görüntülendi', page: 'Tetkikler', date: '04 Haz 2026', time: '09:56', status: 'Başarılı' },
  { user: 'Sistem', action: 'Rapor dışa aktarımı başarısız', page: 'Raporlar', date: '04 Haz 2026', time: '09:15', status: 'Hata' },
  { user: 'Dr. Cumhur Kesemenli', action: 'Muayene tamamlandı', page: 'Muayeneler', date: '04 Haz 2026', time: '08:47', status: 'Başarılı' },
]

export const monthlyPatients = [
  { month: 'Oca', patients: 280, income: 320000 },
  { month: 'Şub', patients: 310, income: 355000 },
  { month: 'Mar', patients: 340, income: 390000 },
  { month: 'Nis', patients: 325, income: 375000 },
  { month: 'May', patients: 390, income: 440000 },
  { month: 'Haz', patients: 428, income: 482500 },
]

export const appointmentStatus = [
  { name: 'Onaylandı', value: 46, color: '#f97316' },
  { name: 'Tamamlandı', value: 32, color: '#22c55e' },
  { name: 'Bekliyor', value: 15, color: '#f59e0b' },
  { name: 'İptal', value: 7, color: '#ef4444' },
]
