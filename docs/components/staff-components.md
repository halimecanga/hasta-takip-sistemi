# Personel Componentleri

## Staff

**Dosya:** `src/pages/Staff.jsx`

**Amaç:** Klinik personellerini kart listesi halinde gösterir.

**Kullandığı veriler / props:** `StaffContext.staffItems`, modal/bildirim state'i.

**Ana davranış:** Personel durum aksiyonlarını `updateStaffStatus` ile Context'e yazar; detay ve yeni personel route'larına link verir.

**Bağımlılıklar:** `StaffContext`, `RowActionsMenu`, `ConfirmActionModal`, `InlineNotification`, `StatusBadge`.

**Notlar:** “Düzenle” satır aksiyonu no-op bildirim verir; detay sayfasındaki düzenleme aktiftir.

## AddStaff

**Dosya:** `src/pages/AddStaff.jsx`

**Amaç:** Yeni personel form sayfasını yönetir.

**Kullandığı veriler / props:** `StaffContext.addStaff`, `hasDoctor`.

**Ana davranış:** Form başarılıysa Context'e kayıt ekler ve personel listesine tek seferlik bildirimle döner.

**Bağımlılıklar:** `AddStaffForm`, `PageTitle`, `useNavigate`.

**Notlar:** Yeni kayıtlar sayfa yenilenince kaybolur.

## AddStaffForm

**Dosya:** `src/components/staff-add/AddStaffForm.jsx`

**Amaç:** Yeni personel bilgilerini toplar ve doğrular.

**Kullandığı veriler / props:** `hasDoctor`, `onSubmit`, form state'i.

**Ana davranış:** Zorunlu alan/e-posta doğrular, doktor rolü için tek doktor kuralını uygular.

**Bağımlılıklar:** `uiClasses`, Lucide ikonları.

**Notlar:** Backend veya localStorage entegrasyonu yoktur.

## StaffDetail

**Dosya:** `src/pages/StaffDetail.jsx`

**Amaç:** Personel detayını, sekmeleri ve düzenleme modunu yönetir.

**Kullandığı veriler / props:** Route `:id`, `StaffContext.getStaffById`, `updateStaff`.

**Ana davranış:** Context'teki personel kaydını gösterir; düzenleme formu kaydedince Context'i günceller.

**Bağımlılıklar:** Staff detay componentleri, `activityLogs`.

**Notlar:** Aktivite logları mock kayıtlardan filtrelenir.

## StaffHeader

**Dosya:** `src/components/staff-detail/StaffHeader.jsx`

**Amaç:** Personel detay üst aksiyonlarını gösterir.

**Kullandığı veriler / props:** `staff`, `editMode`, `onEdit`.

**Ana davranış:** Listeye dönüş, bilgileri düzenleme ve izin ekleme butonlarını gösterir.

**Bağımlılıklar:** `Link`, Lucide ikonları.

**Notlar:** “İzin Ekle” ve üç nokta butonu şu an gerçek işleme bağlı değildir.

## StaffSummaryCard

**Dosya:** `src/components/staff-detail/StaffSummaryCard.jsx`

**Amaç:** Personel kimlik, rol ve çalışma özetini gösterir.

**Kullandığı veriler / props:** `staff`.

**Ana davranış:** Avatar, durum, rol, iletişim ve çalışma saatlerini render eder.

**Bağımlılıklar:** `StatusBadge`, Lucide ikonları.

**Notlar:** Sadece görüntüleme componentidir.

## StaffQuickStats

**Dosya:** `src/components/staff-detail/StaffQuickStats.jsx`

**Amaç:** Personel hızlı metriklerini gösterir.

**Kullandığı veriler / props:** `stats`.

**Ana davranış:** Dört metrik kartını ikonlarla render eder.

**Bağımlılıklar:** Lucide ikonları, `cardClass`.

**Notlar:** Yeni personel için varsayılan metrikler Context içinde üretilir.

## StaffTabs

**Dosya:** `src/components/staff-detail/StaffTabs.jsx`

**Amaç:** Personel detay sekme kontrolünü sağlar.

**Kullandığı veriler / props:** `activeTab`, `onChange`.

**Ana davranış:** Genel, program, izin, aktivite ve belge sekmelerini değiştirir.

**Bağımlılıklar:** Sabit sekme listesi.

**Notlar:** State parent sayfada tutulur.

## StaffGeneralInfo

**Dosya:** `src/components/staff-detail/StaffGeneralInfo.jsx`

**Amaç:** Personelin temel bilgilerini gösterir.

**Kullandığı veriler / props:** `staff`.

**Ana davranış:** Kimlik, iletişim, çalışma ve acil durum bilgilerini listeler.

**Bağımlılıklar:** `paddedCardClass`, Lucide ikonları.

**Notlar:** Form değildir; düzenleme `StaffEditForm` ile yapılır.

## StaffRoleDetails

**Dosya:** `src/components/staff-detail/StaffRoleDetails.jsx`

**Amaç:** Role özel personel alanlarını gösterir.

**Kullandığı veriler / props:** `roleDetails`.

**Ana davranış:** Başlık ve label/value item listesini render eder.

**Bağımlılıklar:** `paddedCardClass`.

**Notlar:** Yeni personelde role göre varsayılan detaylar üretilir.

## StaffSchedule

**Dosya:** `src/components/staff-detail/StaffSchedule.jsx`

**Amaç:** Personel çalışma planını gösterir.

**Kullandığı veriler / props:** `staff`.

**Ana davranış:** Gün, vardiya, lokasyon ve durum satırlarını listeler.

**Bağımlılıklar:** `StatusBadge`.

**Notlar:** Program düzenleme yoktur.

## StaffLeaves

**Dosya:** `src/components/staff-detail/StaffLeaves.jsx`

**Amaç:** İzin özeti ve izin geçmişini gösterir.

**Kullandığı veriler / props:** `staff`.

**Ana davranış:** Yıllık/kullanılan/kalan/rapor metrikleri ve izin tablosunu render eder.

**Bağımlılıklar:** `StatusBadge`.

**Notlar:** İzin ekleme akışı henüz bağlı değildir.

## StaffActivities

**Dosya:** `src/components/staff-detail/StaffActivities.jsx`

**Amaç:** Personel aktivitelerini gösterir.

**Kullandığı veriler / props:** `staff`, `activities`.

**Ana davranış:** Harici activity log varsa onu, yoksa personel detayındaki aktiviteleri listeler.

**Bağımlılıklar:** `EmptyState` benzeri boş görünüm.

**Notlar:** Aktivite verisi mock kayıtlarıdır.

## StaffDocuments

**Dosya:** `src/components/staff-detail/StaffDocuments.jsx`

**Amaç:** Personel belgelerini listeler.

**Kullandığı veriler / props:** `staff`.

**Ana davranış:** Belge adı, tip, tarih ve durum bilgisini gösterir.

**Bağımlılıklar:** `StatusBadge`.

**Notlar:** Dosya yükleme/indirme entegrasyonu yoktur.

## StaffEditForm

**Dosya:** `src/components/staff-detail/StaffEditForm.jsx`

**Amaç:** Personel iletişim, departman, durum ve çalışma bilgilerini düzenler.

**Kullandığı veriler / props:** `staff`, `onCancel`, `onSave`.

**Ana davranış:** Form doğrular, güncellenmiş personel objesini parent'a döndürür.

**Bağımlılıklar:** `uiClasses`, Lucide ikonları.

**Notlar:** Kaydedilen bilgi Context/session içinde kalır.

## EmptyState

**Dosya:** `src/components/staff-detail/EmptyState.jsx`

**Amaç:** Personel bulunamadı durumunu gösterir.

**Kullandığı veriler / props:** Yok.

**Ana davranış:** Personel listesine dönüş linki render eder.

**Bağımlılıklar:** `Link`, `primaryButtonClass`.

**Notlar:** Yanlış ID veya session kaybında kullanılır.
