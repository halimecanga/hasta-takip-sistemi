# Randevu Componentleri

## Appointments

**Dosya:** `src/pages/Appointments.jsx`

**Amaç:** Randevu listesini gösterir.

**Kullandığı veriler / props:** `AppointmentContext.appointmentItems`, Router state bildirimi.

**Ana davranış:** Randevuları kopya dizi üzerinden tarih/saat sıralar, tabloya aktarır, yeni randevu route'una link verir.

**Bağımlılıklar:** `AppointmentContext`, `DataTable`, `FilterBar`, `InlineNotification`, `StatusBadge`.

**Notlar:** `Görüntüle` linki hasta detayında `?yeniMuayene=true` akışını açar.

## AddAppointment

**Dosya:** `src/pages/AddAppointment.jsx`

**Amaç:** Yeni randevu oluşturma formunu yönetir.

**Kullandığı veriler / props:** `AppointmentContext`, `patients`, `patientDetails`, form/error/modal state'i.

**Ana davranış:** Hasta seçince telefon/e-posta doldurur, doktoru readonly gösterir, randevu saatleri ve çakışmaları doğrular, kayıt sonrası listeye döner.

**Bağımlılıklar:** `ConfirmActionModal`, `InlineNotification`, `PageTitle`, `uiClasses`, Lucide ikonları.

**Notlar:** Yeni hasta butonu yalnızca uyarı gösterir. Kayıtlar session state içindedir; yenilemede kaybolur.

## AppointmentProvider

**Dosya:** `src/context/AppointmentContext.jsx`

**Amaç:** Randevu state'ini route değişimlerinde koruyan Context sağlar.

**Kullandığı veriler / props:** `mockData.appointments`, `children`.

**Ana davranış:** ID'siz mock kayıtları `RND-2026-...` formatında normalize eder; ekleme/güncelleme/durum değiştirme fonksiyonları sağlar.

**Bağımlılıklar:** React Context API.

**Notlar:** Backend, localStorage veya harici state kütüphanesi yoktur.
