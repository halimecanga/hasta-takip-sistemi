# Ortak Componentler

## PageTitle

**Dosya:** `src/components/PageTitle.jsx`

**Amaç:** Sayfa başlığı, alt açıklama ve sağ aksiyon alanını standartlaştırır.

**Kullandığı veriler / props:** `title`, `subtitle`, `action`.

**Ana davranış:** Başlık alanını responsive flex düzeniyle gösterir; aksiyon butonu veya link parent tarafından verilir.

**Bağımlılıklar:** Yok.

**Notlar:** Sadece görsel container'dır; state yönetmez.

## DataTable

**Dosya:** `src/components/DataTable.jsx`

**Amaç:** Liste sayfaları için ortak tablo render eder.

**Kullandığı veriler / props:** `columns`, `data`, `emptyText`.

**Ana davranış:** Kolonların `render` fonksiyonunu destekler, boş veri mesajı gösterir ve yatay scroll container'ı sağlar.

**Bağımlılıklar:** Parent componentlerden gelen render fonksiyonları.

**Notlar:** Sıralama veya filtreleme yapmaz; veri parent tarafından hazırlanır.

## FilterBar

**Dosya:** `src/components/FilterBar.jsx`

**Amaç:** Basit arama, durum ve tarih filtre arayüzü sağlar.

**Kullandığı veriler / props:** `status`, `date`, `placeholder`.

**Ana davranış:** Kontrollü olmayan input/select alanları render eder.

**Bağımlılıklar:** `Search` ikonu, `formInputClass`.

**Notlar:** Şu an filtre state'ini dışarı vermez; aktif filtreleme gereken sayfalarda özel filtre alanları kullanılır.

## StatusBadge

**Dosya:** `src/components/StatusBadge.jsx`

**Amaç:** Durum metnini class map üzerinden renkli rozete dönüştürür.

**Kullandığı veriler / props:** `status`.

**Ana davranış:** Bilinen durumlar için sabit Tailwind class döndürür; bilinmeyen durumlar gri rozet olur.

**Bağımlılıklar:** Yok.

**Notlar:** Dinamik Tailwind class üretmez.

## RowActionsMenu

**Dosya:** `src/components/RowActionsMenu.jsx`

**Amaç:** Liste satırlarında üç nokta aksiyon menüsü sağlar.

**Kullandığı veriler / props:** `items`, `label`.

**Ana davranış:** Link veya callback tabanlı aksiyonları render eder; menü dışında tıklamada kapanır.

**Bağımlılıklar:** `MoreVertical` ikonu, `Link`.

**Notlar:** Aksiyonların gerçek etkisi parent componentte tanımlıdır.

## ConfirmActionModal

**Dosya:** `src/components/ConfirmActionModal.jsx`

**Amaç:** Riskli işlemler için erişilebilir onay modalı sağlar.

**Kullandığı veriler / props:** `isOpen`, `title`, `description`, `confirmLabel`, `cancelLabel`, `variant`, `onConfirm`, `onCancel`, `children`, `isConfirmDisabled`.

**Ana davranış:** Açıldığında focus yönetir, Escape ile kapanır, backdrop tıklamasını destekler.

**Bağımlılıklar:** `X` ikonu, `outlineButtonClass`.

**Notlar:** Arşiv/iptal/pasife alma gibi frontend session işlemlerinde kullanılır.

## InlineNotification

**Dosya:** `src/components/InlineNotification.jsx`

**Amaç:** Kısa süreli sayfa içi bildirim gösterir.

**Kullandığı veriler / props:** `message`, `tone`, `onClose`, `duration`.

**Ana davranış:** Mesaj varsa render eder, süre sonunda `onClose` çağırır.

**Bağımlılıklar:** `useEffect`.

**Notlar:** Backend bildirimi değil; frontend state mesajıdır.

## StatCard

**Dosya:** `src/components/StatCard.jsx`

**Amaç:** Dashboard ve rapor metrik kartlarını gösterir.

**Kullandığı veriler / props:** `title`, `value`, `trend`, `trendDown`, `icon`, `color`.

**Ana davranış:** Renk map'i ve ikon ile metrik kartı render eder.

**Bağımlılıklar:** `uiClasses`.

**Notlar:** Metrikler mock veriden veya sabit sayfa içeriğinden gelir.
