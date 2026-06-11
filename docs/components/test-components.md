# Tetkik Componentleri

## Tests

**Dosya:** `src/pages/Tests.jsx`

**Amaç:** Tetkik listesini ve durum güncelleme akışını yönetir.

**Kullandığı veriler / props:** `mockData.tests`, filtre ve modal state'i.

**Ana davranış:** Arama/durum filtresi uygular, iptal/geçersiz işaretleme için gerekçeli modal açar.

**Bağımlılıklar:** `DataTable`, `RowActionsMenu`, `ConfirmActionModal`, `InlineNotification`, `StatusBadge`.

**Notlar:** Durum güncellemesi yalnızca sayfa içi state'te kalır.

## TestDetail

**Dosya:** `src/pages/TestDetail.jsx`

**Amaç:** Tetkik sonuç detayını ve sekme akışını yönetir.

**Kullandığı veriler / props:** Route `:id`, `testDetails`, aktif sekme ve iptal state'i.

**Ana davranış:** Laboratuvar/görüntüleme tipine göre sonuç componenti seçer; iptal modalı durum ve geçmiş bilgisini günceller.

**Bağımlılıklar:** Tetkik detay componentleri, `isLaboratoryTest`, `ConfirmActionModal`.

**Notlar:** Değişiklikler session state içindedir.

## TestDetailHeader

**Dosya:** `src/components/test-detail/TestDetailHeader.jsx`

**Amaç:** Tetkik detay üst aksiyonlarını gösterir.

**Kullandığı veriler / props:** `test`, `onCancelTest`.

**Ana davranış:** Listeye dönüş, hasta detayına geçiş ve iptal aksiyonu sağlar.

**Bağımlılıklar:** `Link`, Lucide ikonları, `uiClasses`.

**Notlar:** Hasta detay linki kaynak sayfa state'i taşır.

## TestSummaryCard

**Dosya:** `src/components/test-detail/TestSummaryCard.jsx`

**Amaç:** Tetkik özet kartını gösterir.

**Kullandığı veriler / props:** `test`.

**Ana davranış:** Hasta, doktor, tetkik türü ve durum bilgilerini render eder.

**Bağımlılıklar:** `TestStatusBadge`.

**Notlar:** Sadece görüntüleme yapar.

## TestQuickStats

**Dosya:** `src/components/test-detail/TestQuickStats.jsx`

**Amaç:** Tetkik hızlı metriklerini gösterir.

**Kullandığı veriler / props:** `test`.

**Ana davranış:** Parametre, belge, sonuç ve süre özetlerini kartlar halinde gösterir.

**Bağımlılıklar:** Lucide ikonları.

**Notlar:** Mock detay verisinden türetilir.

## TestStatusPanel

**Dosya:** `src/components/test-detail/TestStatusPanel.jsx`

**Amaç:** Tetkik durumuna göre açıklama paneli gösterir.

**Kullandığı veriler / props:** `test`.

**Ana davranış:** Durum metnine göre ikon, başlık ve açıklama seçer.

**Bağımlılıklar:** Lucide ikonları, class map.

**Notlar:** Dinamik Tailwind class üretmez.

## TestTabs

**Dosya:** `src/components/test-detail/TestTabs.jsx`

**Amaç:** Tetkik detay sekmelerini yönetir.

**Kullandığı veriler / props:** `activeTab`, `onChange`, `test`.

**Ana davranış:** Genel, sonuç, değerlendirme, geçmiş ve belge sekmelerini render eder.

**Bağımlılıklar:** `isLaboratoryTest` kararından gelen parent davranışı.

**Notlar:** State parent sayfada tutulur.

## TestOverview

**Dosya:** `src/components/test-detail/TestOverview.jsx`

**Amaç:** Tetkik genel bilgilerini gösterir.

**Kullandığı veriler / props:** `test`.

**Ana davranış:** İstem, klinik bilgi, hasta ve işlem alanlarını listeler.

**Bağımlılıklar:** `paddedCardClass`.

**Notlar:** Mock detay verisinden gelir.

## LaboratoryResults

**Dosya:** `src/components/test-detail/LaboratoryResults.jsx`

**Amaç:** Laboratuvar parametre sonuçlarını gösterir.

**Kullandığı veriler / props:** `test`.

**Ana davranış:** Parametre, sonuç, referans aralığı ve durum tablosu render eder.

**Bağımlılıklar:** `TestStatusBadge`.

**Notlar:** Yalnız laboratuvar tipinde kullanılır.

## ImagingFindings

**Dosya:** `src/components/test-detail/ImagingFindings.jsx`

**Amaç:** Görüntüleme bulgularını gösterir.

**Kullandığı veriler / props:** `test`.

**Ana davranış:** Bulgular, teknik bilgi ve sonuç özetlerini render eder.

**Bağımlılıklar:** `paddedCardClass`.

**Notlar:** Laboratuvar dışı tetkikler için kullanılır.

## DoctorEvaluation

**Dosya:** `src/components/test-detail/DoctorEvaluation.jsx`

**Amaç:** Doktor değerlendirme alanını gösterir.

**Kullandığı veriler / props:** `test`.

**Ana davranış:** Klinik yorum, öneri ve takip bilgisini listeler.

**Bağımlılıklar:** `paddedCardClass`.

**Notlar:** Düzenleme formu yoktur.

## TestHistory

**Dosya:** `src/components/test-detail/TestHistory.jsx`

**Amaç:** Tetkik işlem geçmişini gösterir.

**Kullandığı veriler / props:** `history`.

**Ana davranış:** Aksiyon zaman çizelgesini render eder.

**Bağımlılıklar:** `paddedCardClass`.

**Notlar:** İptal işlemi parent state ile geçmişe satır ekler.

## TestDocuments

**Dosya:** `src/components/test-detail/TestDocuments.jsx`

**Amaç:** Tetkik belgelerini gösterir.

**Kullandığı veriler / props:** `documents`.

**Ana davranış:** Belge ad, tür, boyut ve tarih bilgilerini listeler.

**Bağımlılıklar:** Lucide ikonları.

**Notlar:** Dosya indirme/yükleme entegrasyonu yoktur.

## TestStatusBadge

**Dosya:** `src/components/test-detail/TestStatusBadge.jsx`

**Amaç:** Tetkik domainine özel durum rozeti gösterir.

**Kullandığı veriler / props:** `status`.

**Ana davranış:** Test durumuna göre sabit class map ile rozet render eder.

**Bağımlılıklar:** Yok.

**Notlar:** Genel `StatusBadge`den bağımsız, tetkik detay alanına özeldir.

## PatientInfoCard

**Dosya:** `src/components/test-detail/PatientInfoCard.jsx`

**Amaç:** Tetkik domaini için hasta bilgi kartı.

**Kullandığı veriler / props:** `test`.

**Ana davranış:** Hasta iletişim/kimlik bilgisi göstermek üzere tasarlanmıştır.

**Bağımlılıklar:** `paddedCardClass`.

**Notlar:** `TestSummaryCard` içinde özet kartın bir parçası olarak kullanılır.

## EmptyState

**Dosya:** `src/components/test-detail/EmptyState.jsx`

**Amaç:** Tetkik bulunamadı durumunu gösterir.

**Kullandığı veriler / props:** Yok.

**Ana davranış:** Tetkik listesine dönüş linki render eder.

**Bağımlılıklar:** `Link`, `primaryButtonClass`.

**Notlar:** Yanlış ID durumunda kullanılır.
