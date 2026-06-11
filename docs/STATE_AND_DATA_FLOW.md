# State ve Veri Akışı

## Context Kullanılan Alanlar

### StaffContext

**Dosya:** `src/context/StaffContext.jsx`

- **State:** `staffItems`
- **Fonksiyonlar:** `addStaff`, `updateStaff`, `updateStaffStatus`, `getStaffById`
- **Kullanan sayfalar:** `Staff`, `StaffDetail`, `AddStaff`
- **Davranış:** Personel liste, detay düzenleme, durum değişikliği ve yeni personel kayıtları session içinde korunur.
- **Yenileme:** Sayfa yenilenince `staffDetailsMock` başlangıç verisine döner.

### AppointmentContext

**Dosya:** `src/context/AppointmentContext.jsx`

- **State:** `appointmentItems`
- **Fonksiyonlar:** `addAppointment`, `updateAppointment`, `updateAppointmentStatus`, `getAppointmentById`
- **Kullanan sayfalar:** `Appointments`, `AddAppointment`
- **Davranış:** Mock randevular clone edilerek state'e alınır; ID yoksa `RND-2026-001...` formatıyla normalize edilir. Yeni randevular route değişiminde korunur.
- **Yenileme:** Sayfa yenilenince `mockData.appointments` başlangıç verisine döner.

## Sayfa İçi State Kullanılan Alanlar

- `Patients`: arama, arşiv filtresi, arşivleme/geri alma ve bildirim state'i.
- `PatientDetail`: seçili dosya, yeni muayene modu, aktif sekme ve frontend içinde eklenen muayene kayıtları.
- `Examinations`: filtreler, taslak kayıt, iptal/geçersiz işlem modalı ve gerekçe state'i.
- `Prescriptions`: filtreler, taslak reçete, iptal modalı ve gerekçe state'i.
- `PrescriptionDetail`: detay düzenleme modu, aktif sekme ve iptal nedeni state'i.
- `Tests`: filtreler, durum güncelleme modalı ve gerekçe state'i.
- `TestDetail`: aktif sekme, iptal modalı ve tetkik durum state'i.
- `PriceList`: filtreler, pasif/aktif/arşiv/sil modalı ve bildirim state'i.
- `PriceDetail`: `duzenle=true` query parametresine bağlı düzenleme modu ve fiyat detay state'i.
- `Staff`: durum değişikliği modalı ve bildirim state'i; asıl personel verisi `StaffContext` içindedir.
- `AddAppointment` / `AddStaff`: form state'i, doğrulama hataları ve iptal onay modalı.

## Mock Data

- `src/data/mockData.js`: dashboard, randevu, hasta, muayene, reçete, tetkik, personel ve fiyat liste verileri.
- `src/data/patientDetailsMock.js`: hasta detayları, ziyaretler, reçete/ödeme/belge alt kayıtları.
- `src/data/staffDetailsMock.js`: personel detayları, program, izin, belge ve rol bilgileri.
- `src/data/prescriptionDetailsMock.js`: reçete detay, ilaç, talimat, geçmiş ve belge verileri.
- `src/data/testDetailsMock.js`: tetkik detay, sonuç, değerlendirme, geçmiş ve belge verileri.
- `src/data/activityLogsMock.js`: işlem kayıtları ve detay bağlantı verileri.

## Tekrar Eden Veri Notu

Liste mockları ve detay mockları aynı domain için ayrı tutulur. Örneğin hasta adı/telefon bilgisi hem `mockData.js` hem `patientDetailsMock.js` içinde bulunabilir. Bu tekrar prototip seviyesinde kabul edilmiştir; backend bağlanınca tek kaynaklı veri modeliyle giderilmelidir.
