# Fiyat Componentleri

## PriceList

**Dosya:** `src/pages/PriceList.jsx`

**Amaç:** Klinik hizmet fiyatlarını listeler ve durum işlemlerini yönetir.

**Kullandığı veriler / props:** `mockData.priceList`, filtre/modal/bildirim state'i.

**Ana davranış:** Arama/durum filtresi uygular; aktif/pasif/arşiv/sil işlemlerini sayfa state'ine yazar.

**Bağımlılıklar:** `DataTable`, `RowActionsMenu`, `ConfirmActionModal`, `InlineNotification`, `StatusBadge`, `formatCurrency`.

**Notlar:** `Yeni İşlem` butonu şu an gerçek forma bağlı değildir.

## PriceDetail

**Dosya:** `src/pages/PriceDetail.jsx`

**Amaç:** Fiyat detayını ve `duzenle=true` düzenleme modunu yönetir.

**Kullandığı veriler / props:** Route `:id`, `priceList`, query `duzenle`.

**Ana davranış:** Detay kartlarını veya düzenleme formunu render eder.

**Bağımlılıklar:** Fiyat detay componentleri, `useNavigate`.

**Notlar:** Değişiklikler sayfa state'indedir; yenilemede mock veriye döner.

## PriceDetailHeader

**Dosya:** `src/components/price-detail/PriceDetailHeader.jsx`

**Amaç:** Fiyat detay üst aksiyonlarını gösterir.

**Kullandığı veriler / props:** `price`, `editMode`.

**Ana davranış:** Listeye dönüş ve düzenle/detaya dön linklerini sağlar.

**Bağımlılıklar:** `Link`, Lucide ikonları.

**Notlar:** Edit mode URL query ile kontrol edilir.

## PriceSummaryCard

**Dosya:** `src/components/price-detail/PriceSummaryCard.jsx`

**Amaç:** Fiyat kaydı özetini gösterir.

**Kullandığı veriler / props:** `price`.

**Ana davranış:** Ad, kategori, ücret, durum ve temel meta bilgileri render eder.

**Bağımlılıklar:** `StatusBadge`, `formatCurrency`.

**Notlar:** Sadece görüntüleme yapar.

## PriceInfoCards

**Dosya:** `src/components/price-detail/PriceInfoCards.jsx`

**Amaç:** Fiyat kaydının vergi, kullanım ve görünürlük bilgilerini gösterir.

**Kullandığı veriler / props:** `price`.

**Ana davranış:** Bilgileri bölümlü kartlar halinde render eder.

**Bağımlılıklar:** Lucide ikonları, `paddedCardClass`.

**Notlar:** Form değildir.

## PriceEditForm

**Dosya:** `src/components/price-detail/PriceEditForm.jsx`

**Amaç:** Fiyat kaydı alanlarını düzenler.

**Kullandığı veriler / props:** `price`, `onCancel`, `onSave`.

**Ana davranış:** Fiyat, durum, KDV ve görünürlük alanlarını doğrular/günceller.

**Bağımlılıklar:** `uiClasses`, Lucide ikonları.

**Notlar:** Kaydedilen veri sadece sayfa state'indedir.

## EmptyState

**Dosya:** `src/components/price-detail/EmptyState.jsx`

**Amaç:** Fiyat kaydı bulunamadı durumunu gösterir.

**Kullandığı veriler / props:** Yok.

**Ana davranış:** Fiyat listesine dönüş linki render eder.

**Bağımlılıklar:** `Link`, `primaryButtonClass`.

**Notlar:** Yanlış ID durumunda kullanılır.

## priceUtils

**Dosya:** `src/components/price-detail/priceUtils.js`

**Amaç:** Fiyat domaini için yardımcı format fonksiyonları sağlar.

**Kullandığı veriler / props:** `formatCurrency(value)`.

**Ana davranış:** Sayısal tutarı Türk Lirası formatına çevirir.

**Bağımlılıklar:** `Intl.NumberFormat`.

**Notlar:** `PriceList` ve fiyat detay componentlerinde kullanılır.
