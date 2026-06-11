# Reçete Componentleri

## Prescriptions

**Dosya:** `src/pages/Prescriptions.jsx`

**Amaç:** Reçete listesini ve taslak/iptal işlemlerini yönetir.

**Kullandığı veriler / props:** `mockData.prescriptions`, sayfa içi filtre ve modal state'i.

**Ana davranış:** Arama/durum filtresi uygular, taslak silme ve iptal nedeni modalı çalıştırır.

**Bağımlılıklar:** `DataTable`, `RowActionsMenu`, `ConfirmActionModal`, `InlineNotification`, `StatusBadge`.

**Notlar:** Taslak düzenleme no-op bildirim verir.

## PrescriptionDetail

**Dosya:** `src/pages/PrescriptionDetail.jsx`

**Amaç:** Reçete detayını, düzenleme modunu ve iptal akışını yönetir.

**Kullandığı veriler / props:** Route `:id`, `prescriptionDetails`, aktif sekme ve iptal state'i.

**Ana davranış:** Reçete bilgilerini sekmelerle gösterir; düzenleme formundan gelen state'i sayfa içinde saklar.

**Bağımlılıklar:** Reçete detay componentleri, `ConfirmActionModal`.

**Notlar:** Değişiklikler session state içindedir.

## PrescriptionHeader

**Dosya:** `src/components/prescription-detail/PrescriptionHeader.jsx`

**Amaç:** Reçete detay üst aksiyonlarını gösterir.

**Kullandığı veriler / props:** `prescription`, `editMode`, `onEdit`, `onCancelPrescription`.

**Ana davranış:** Listeye dönüş, düzenleme ve iptal butonlarını render eder.

**Bağımlılıklar:** `Link`, Lucide ikonları.

**Notlar:** İptal modalı parent sayfada yönetilir.

## PrescriptionSummary

**Dosya:** `src/components/prescription-detail/PrescriptionSummary.jsx`

**Amaç:** Reçete üst özet kartını gösterir.

**Kullandığı veriler / props:** `prescription`.

**Ana davranış:** Hasta, doktor, tarih ve durum bilgisini gösterir.

**Bağımlılıklar:** `StatusBadge`, `paddedCardClass`.

**Notlar:** Sadece görüntüleme yapar.

## PrescriptionQuickStats

**Dosya:** `src/components/prescription-detail/PrescriptionQuickStats.jsx`

**Amaç:** Reçete hızlı metriklerini gösterir.

**Kullandığı veriler / props:** `prescription`.

**Ana davranış:** İlaç sayısı, süre, yenileme ve durum metrikleri render eder.

**Bağımlılıklar:** Lucide ikonları, kart stilleri.

**Notlar:** Mock reçete detayından türetilir.

## PrescriptionAlerts

**Dosya:** `src/components/prescription-detail/PrescriptionAlerts.jsx`

**Amaç:** Reçete uyarılarını gösterir.

**Kullandığı veriler / props:** `alerts`.

**Ana davranış:** Uyarı tonuna göre ikon ve renk seçer.

**Bağımlılıklar:** Lucide `Info`, `AlertTriangle`.

**Notlar:** Uyarılar mock veridir.

## PrescriptionTabs

**Dosya:** `src/components/prescription-detail/PrescriptionTabs.jsx`

**Amaç:** Reçete detay sekmelerini yönetir.

**Kullandığı veriler / props:** `activeTab`, `onChange`.

**Ana davranış:** Genel, talimat, geçmiş ve belge sekmelerini değiştirir.

**Bağımlılıklar:** Sabit sekme listesi.

**Notlar:** State parent sayfada tutulur.

## PrescriptionOverview

**Dosya:** `src/components/prescription-detail/PrescriptionOverview.jsx`

**Amaç:** Reçetenin genel bilgilerini gösterir.

**Kullandığı veriler / props:** `prescription`.

**Ana davranış:** Klinik, hasta, tanı ve iptal nedeni gibi alanları listeler.

**Bağımlılıklar:** `paddedCardClass`.

**Notlar:** İptal nedeni parent state güncellemesinden gelir.

## PrescriptionEditForm

**Dosya:** `src/components/prescription-detail/PrescriptionEditForm.jsx`

**Amaç:** Reçete ilaç ve not bilgilerini düzenler.

**Kullandığı veriler / props:** `prescription`, `onCancel`, `onSave`.

**Ana davranış:** Form alanlarını doğrular, ilaç satırı ekleme/silme ve save callback'i sağlar.

**Bağımlılıklar:** `uiClasses`, Lucide ikonları.

**Notlar:** Backend kaydı yoktur.

## MedicineList

**Dosya:** `src/components/prescription-detail/MedicineList.jsx`

**Amaç:** Reçetedeki ilaçları listeler.

**Kullandığı veriler / props:** `medicines`.

**Ana davranış:** İlaç doz, kullanım ve not alanlarını kartlar halinde gösterir.

**Bağımlılıklar:** `paddedCardClass`.

**Notlar:** Sadece görüntüleme yapar.

## MedicationSchedule

**Dosya:** `src/components/prescription-detail/MedicationSchedule.jsx`

**Amaç:** İlaç kullanım planını gösterir.

**Kullandığı veriler / props:** `medicines`.

**Ana davranış:** Zaman/frekans bilgilerini liste halinde render eder.

**Bağımlılıklar:** Lucide ikonları.

**Notlar:** Hatırlatma sistemi yoktur.

## InstructionsTab

**Dosya:** `src/components/prescription-detail/InstructionsTab.jsx`

**Amaç:** Hasta kullanım talimatlarını gösterir.

**Kullandığı veriler / props:** `prescription`.

**Ana davranış:** Genel talimat, uyarı ve takip bilgilerini render eder.

**Bağımlılıklar:** `paddedCardClass`.

**Notlar:** Mock detay verisinden gelir.

## PrescriptionHistory

**Dosya:** `src/components/prescription-detail/PrescriptionHistory.jsx`

**Amaç:** Reçete işlem geçmişini gösterir.

**Kullandığı veriler / props:** `history`.

**Ana davranış:** Tarih, saat, aksiyon ve aktör listesini render eder.

**Bağımlılıklar:** `paddedCardClass`.

**Notlar:** İptal aksiyonu parent state ile geçmişe yeni satır ekler.

## PrescriptionDocuments

**Dosya:** `src/components/prescription-detail/PrescriptionDocuments.jsx`

**Amaç:** Reçete belgelerini gösterir.

**Kullandığı veriler / props:** `documents`.

**Ana davranış:** Belge adı, tip ve tarih bilgilerini listeler.

**Bağımlılıklar:** Lucide ikonları.

**Notlar:** İndirme/yükleme entegrasyonu yoktur.

## PatientInfoCard

**Dosya:** `src/components/prescription-detail/PatientInfoCard.jsx`

**Amaç:** Reçete domaini için hasta bilgi kartı.

**Kullandığı veriler / props:** `prescription`.

**Ana davranış:** Hasta iletişim/kimlik bilgisi göstermek üzere tasarlanmıştır.

**Bağımlılıklar:** `paddedCardClass`.

**Notlar:** `PrescriptionSummary` içinde özet kartın bir parçası olarak kullanılır.

## EmptyState

**Dosya:** `src/components/prescription-detail/EmptyState.jsx`

**Amaç:** Reçete bulunamadı durumunu gösterir.

**Kullandığı veriler / props:** Yok.

**Ana davranış:** Reçete listesine dönüş linki gösterir.

**Bağımlılıklar:** `Link`, `primaryButtonClass`.

**Notlar:** Yanlış ID durumunda render edilir.
