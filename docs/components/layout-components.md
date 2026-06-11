# Layout Componentleri

## AdminLayout

**Dosya:** `src/layouts/AdminLayout.jsx`

**Amaç:** Yönetim paneli iskeletini kurar.

**Kullandığı veriler / props:** Route `Outlet`, `useLocation`, `sidebarOpen` state'i.

**Ana davranış:** `Sidebar`, `Header` ve `<main>` alanını yerleştirir; route path'ine göre başlık seçer.

**Bağımlılıklar:** `Header`, `Sidebar`, `Outlet`.

**Notlar:** Sidebar mobil açık/kapalı state'i layout içinde tutulur.

## Header

**Dosya:** `src/components/Header.jsx`

**Amaç:** Üst başlık çubuğunu ve mobil menü kontrolünü gösterir.

**Kullandığı veriler / props:** `title`, `sidebarOpen`, `onMenuClick`.

**Ana davranış:** Sayfa başlığı ve profil alanı render eder; mobilde menü butonu `Sidebar`ı açar.

**Bağımlılıklar:** Lucide ikonları.

**Notlar:** Profil aksiyonları görseldir; backend/auth entegrasyonu yoktur.

## Sidebar

**Dosya:** `src/components/Sidebar.jsx`

**Amaç:** Ana navigasyon menüsünü sağlar.

**Kullandığı veriler / props:** `open`, `onClose`.

**Ana davranış:** `NavLink` ile aktif route'u işaretler, mobil overlay davranışı verir.

**Bağımlılıklar:** `NavLink`, Lucide ikonları.

**Notlar:** Route listesi component içinde sabittir; yeni route eklendiğinde menüye ayrıca eklemek gerekir.
