# İşlem Kaydı Componentleri

## Logs

**Dosya:** `src/pages/Logs.jsx`

**Amaç:** Sistem işlem kayıtlarını listeler ve filtreler.

**Kullandığı veriler / props:** `activityLogs`, `search`, `status`, `staff`, `date`.

**Ana davranış:** Kullanıcı/işlem/sayfa/metin araması, durum/personel/tarih filtreleri ve detay linki sağlar.

**Bağımlılıklar:** `PageTitle`, `activityLogsMock`, Lucide ikonları, `uiClasses`.

**Notlar:** Loglar mock veridir; backend audit servisi yoktur.

## ActivityLogDetail

**Dosya:** `src/pages/ActivityLogDetail.jsx`

**Amaç:** Tek işlem kaydının detayını gösterir.

**Kullandığı veriler / props:** Route `:id`, `activityLogs`.

**Ana davranış:** Kullanıcı, işlem, cihaz, teknik detay ve ilgili kayıt bağlantılarını kartlar halinde gösterir.

**Bağımlılıklar:** `PageTitle`, `Link`, Lucide ikonları.

**Notlar:** `targetRoute` varsa ilgili kayda gider; personel ID varsa personel profiline link verir.

## Badge

**Dosya:** `src/pages/ActivityLogDetail.jsx`

**Amaç:** İşlem detayındaki küçük durum/seviye rozetini render eder.

**Kullandığı veriler / props:** `children`, `className`.

**Ana davranış:** Verilen class map sonucunu ortak rozet yapısına uygular.

**Bağımlılıklar:** Yok.

**Notlar:** Sayfa içi küçük yardımcı componenttir; ayrı dosyaya taşınması gerekmiyor.

## DetailRow

**Dosya:** `src/pages/ActivityLogDetail.jsx`

**Amaç:** İşlem detayında label/value satırı gösterir.

**Kullandığı veriler / props:** `label`, `value`.

**Ana davranış:** Boş değerleri `-` olarak gösterir.

**Bağımlılıklar:** Yok.

**Notlar:** Sadece `ActivityLogDetail` içinde kullanılır.

## EmptyState

**Dosya:** `src/pages/ActivityLogDetail.jsx`

**Amaç:** İşlem kaydı bulunamadığında geri dönüş kartı gösterir.

**Kullandığı veriler / props:** Yok.

**Ana davranış:** İşlem kayıtları listesine dönüş linki sağlar.

**Bağımlılıklar:** `PageTitle`, `Link`, `primaryButtonClass`.

**Notlar:** Sayfa içi helper component olarak kalması uygundur.
