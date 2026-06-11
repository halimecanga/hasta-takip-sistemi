# Hasta Componentleri

## Patients

**Dosya:** `src/pages/Patients.jsx`

**Amaç:** Kayıtlı hastaları listeler ve arşivleme akışını yönetir.

**Kullandığı veriler / props:** `mockData.patients`, sayfa içi `patientItems`, `search`, `archiveFilter`.

**Ana davranış:** Arama/arşiv filtresi uygular, `DataTable` içinde detay linki ve satır aksiyonları gösterir.

**Bağımlılıklar:** `DataTable`, `RowActionsMenu`, `ConfirmActionModal`, `InlineNotification`, `StatusBadge`.

**Notlar:** `Yeni Hasta Ekle` ve satırdaki `Düzenle` butonu gerçek forma bağlı değildir.

## PatientDetail

**Dosya:** `src/pages/PatientDetail.jsx`

**Amaç:** Hasta detayını, muayene dosyalarını ve yeni muayene oluşturma modunu yönetir.

**Kullandığı veriler / props:** `patientDetails`, `appointments`, route `:id`, query `yeniMuayene`, `dosya`.

**Ana davranış:** Dosya seçimini URL query ile senkronlar; yeni muayene kaydını sayfa içi state'e ekler.

**Bağımlılıklar:** Hasta detay componentleri, `useNavigate`, `useSearchParams`.

**Notlar:** Yeni muayene kaydı session içinde kalır; yenilemede mock veriye döner.

## PatientHeader

**Dosya:** `src/components/patient-detail/PatientHeader.jsx`

**Amaç:** Hasta detay üst barını ve geri/yeni muayene aksiyonlarını gösterir.

**Kullandığı veriler / props:** `patient`, `returnLabel`, `returnPath`, `onStartNewVisit`.

**Ana davranış:** Kaynak sayfaya döner ve yeni muayene modunu başlatır.

**Bağımlılıklar:** `Link`, Lucide ikonları, `uiClasses`.

**Notlar:** Geri dönüş label/path bilgisi route state'ten gelir.

## PatientSummaryCard

**Dosya:** `src/components/patient-detail/PatientSummaryCard.jsx`

**Amaç:** Hasta kimlik ve klinik özet bilgilerini gösterir.

**Kullandığı veriler / props:** `patient`.

**Ana davranış:** İletişim, kan grubu, alerji ve kayıt bilgilerini kart içinde listeler.

**Bağımlılıklar:** Lucide ikonları, `paddedCardClass`.

**Notlar:** Sadece görüntüleme yapar.

## PatientAlerts

**Dosya:** `src/components/patient-detail/PatientAlerts.jsx`

**Amaç:** Hasta için önemli uyarıları gösterir.

**Kullandığı veriler / props:** `patient`.

**Ana davranış:** Alerji, kronik hastalık ve ödeme durumunu uyarı bandı olarak render eder.

**Bağımlılıklar:** Lucide ikonları.

**Notlar:** Uyarılar mock hasta alanlarından türetilir.

## PatientQuickStats

**Dosya:** `src/components/patient-detail/PatientQuickStats.jsx`

**Amaç:** Hasta detayında hızlı metrikleri gösterir.

**Kullandığı veriler / props:** `patient`, `visits`.

**Ana davranış:** Muayene sayısı, son ziyaret ve ödeme gibi özetler üretir.

**Bağımlılıklar:** Kart stilleri.

**Notlar:** Veriler sayfa içi ziyaret state'inden etkilenir.

## VisitHistory

**Dosya:** `src/components/patient-detail/VisitHistory.jsx`

**Amaç:** Hastanın muayene dosyalarını listeler.

**Kullandığı veriler / props:** `visits`, `selectedVisitId`, `onSelect`.

**Ana davranış:** Seçili dosyayı işaretler, tıklamada parent seçim callback'ini çağırır.

**Bağımlılıklar:** `StatusBadge`.

**Notlar:** Dosya sıralaması parent state sırasını izler.

## VisitDetails

**Dosya:** `src/components/patient-detail/VisitDetails.jsx`

**Amaç:** Seçili muayene dosyasının sekmeli detayını gösterir.

**Kullandığı veriler / props:** `visit`, `activeTab`, `onTabChange`.

**Ana davranış:** Özet, tedavi notları, reçete, ödeme ve belge sekmelerini render eder.

**Bağımlılıklar:** `VisitTabs`, `StatusBadge`, Lucide ikonları.

**Notlar:** “Yeni not/ödeme” gibi bazı aksiyonlar sadece arayüz butonudur.

## VisitTabs

**Dosya:** `src/components/patient-detail/VisitTabs.jsx`

**Amaç:** Muayene detay sekme kontrolünü sağlar.

**Kullandığı veriler / props:** `activeTab`, `onChange`.

**Ana davranış:** Sekme butonlarını render eder ve seçimi parent'a bildirir.

**Bağımlılıklar:** Sabit sekme listesi.

**Notlar:** State parent componentte tutulur.

## NewExaminationForm

**Dosya:** `src/components/patient-detail/NewExaminationForm.jsx`

**Amaç:** Hasta detayında yeni muayene dosyası oluşturur.

**Kullandığı veriler / props:** `patient`, `appointment`, `onCancel`, `onSave`.

**Ana davranış:** Klinik form doğrulaması yapar, yeni visit objesi üretir ve parent'a iletir.

**Bağımlılıklar:** `uiClasses`, Lucide ikonları.

**Notlar:** Backend kaydı yoktur; oluşturulan dosya sadece sayfa/session state'indedir.

## EmptyState

**Dosya:** `src/components/patient-detail/EmptyState.jsx`

**Amaç:** Hasta bulunamadığında geri dönüş arayüzü sağlar.

**Kullandığı veriler / props:** `title`, `text`.

**Ana davranış:** Bilgilendirme kartı ve hastalara dönüş linki gösterir.

**Bağımlılıklar:** `Link`, `primaryButtonClass`.

**Notlar:** Detay sayfası yanlış ID aldığında kullanılır.
