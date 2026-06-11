# Mimari

Bu proje React + Vite üzerine kurulmuş, Tailwind CSS ile stillendirilen bir frontend hasta takip sistemi prototipidir. Veri kaynağı mock dosyalardır; backend, API, veritabanı, localStorage veya harici state kütüphanesi kullanılmaz.

## Uygulama Yapısı

- `src/main.jsx` uygulamayı `BrowserRouter` içinde başlatır.
- `src/App.jsx` route ağacını tanımlar ve session state sağlayan context provider'ları route ağacının üstünde mount eder.
- `src/layouts/AdminLayout.jsx` sidebar, header ve sayfa içerik alanını yönetir.
- `src/pages/` route karşılığı sayfa componentlerini içerir.
- `src/components/` ortak UI parçaları ve detay ekranı alt componentlerini içerir.
- `src/styles/uiClasses.js` sık kullanılan Tailwind class gruplarını paylaşır.
- `src/styles/global.css` global/base stil kurallarını taşır.

## Tailwind CSS

Stiller çoğunlukla JSX üzerinde Tailwind class'larıyla verilir. Ortak kart, buton, input ve form sınıfları `uiClasses.js` içinde toplanmıştır. Durum renkleri `StatusBadge` ve ilgili tablo/detail componentlerinde class map yaklaşımıyla yönetilir.

## Sayfa ve Component Ayrımı

Sayfalar veri seçme, route parametresi okuma, modal/bildirim state'i ve üst seviye akışı yönetir. Alt componentler çoğunlukla aldığı props üzerinden özet kart, sekme, tablo, form veya durum paneli render eder.

## Mock Data Katmanı

Mock veriler `src/data/` altında bulunur. Liste sayfalarının bir kısmı `mockData.js` içindeki kısa kayıtları, detay sayfaları ise alan bazlı detay mock dosyalarını kullanır. Aynı domainin liste ve detay mockları ayrı dosyalarda tekrar edebilir; backend bağlandığında bu tekrarların tek kaynaklı API modelleriyle sadeleşmesi gerekir.

## Context Katmanı

- `StaffContext` personel listesi/detay/düzenleme/yeni personel akışını session state içinde tutar.
- `AppointmentContext` randevu listesini ve yeni randevu kayıtlarını session state içinde tutar.

Context state'i route değişimlerinde korunur, sayfa yenilenince başlangıç mock verisine döner.

## Route Yapısı

Route'lar `App.jsx` içinde `AdminLayout` altında tanımlıdır. Statik yeni kayıt route'ları (`/randevular/yeni`, `/personeller/yeni`) ilgili dinamik detay route'larından önce tutulur.

## Liste → Detay → Düzenleme Akışı

Liste sayfaları tablo/kart görünümü verir ve detay route'una yönlendirir. Detay sayfaları route parametresiyle kaydı bulur, bazıları sayfa içi state ile düzenleme veya durum değişikliği yapar. Bu değişikliklerin çoğu frontend session state içindedir ve yenilemede kaybolur.

## Backend Bağlanırken Değişecek Noktalar

- Mock data importları API çağrılarıyla değişir.
- Context veya sayfa içi state kalıcı veri kaynağına bağlanır.
- No-op butonlar gerçek form, işlem veya endpoint entegrasyonu alır.
- Liste/detay mock veri tekrarları tek veri modeline indirgenir.
