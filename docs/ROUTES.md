# Route Listesi

| Route | Sayfa | Amaç | Query Parametreleri |
| --- | --- | --- | --- |
| `/` | `Dashboard` | Klinik özet metrikleri ve grafikler | Yok |
| `/randevular` | `Appointments` | Randevu listesi | Router state ile tek seferlik bildirim |
| `/randevular/yeni` | `AddAppointment` | Yeni randevu oluşturma | Yok |
| `/hastalar` | `Patients` | Hasta listesi ve arşiv yönetimi | Yok |
| `/hastalar/:id` | `PatientDetail` | Hasta detay ve muayene dosyaları | `yeniMuayene=true`, `dosya=...` |
| `/muayeneler` | `Examinations` | Muayene liste ve durum yönetimi | Yok |
| `/receteler` | `Prescriptions` | Reçete liste ve iptal/taslak işlemleri | Yok |
| `/receteler/:id` | `PrescriptionDetail` | Reçete detay ve düzenleme | `duzenle=true` geleceğe açık; mevcut detay sayfasında edit mode route'tan okunmuyor |
| `/tetkikler` | `Tests` | Tetkik liste ve durum yönetimi | Yok |
| `/tetkikler/:id` | `TestDetail` | Tetkik sonuç detayı | Yok |
| `/personeller` | `Staff` | Personel kart listesi ve durum yönetimi | Router state ile tek seferlik bildirim |
| `/personeller/yeni` | `AddStaff` | Yeni personel oluşturma | Yok |
| `/personeller/:id` | `StaffDetail` | Personel detay ve düzenleme | Yok |
| `/fiyat-listesi` | `PriceList` | Fiyat listesi ve durum yönetimi | Yok |
| `/fiyat-listesi/:id` | `PriceDetail` | Fiyat detayı ve düzenleme | `duzenle=true` |
| `/islem-kayitlari` | `Logs` | İşlem kayıtları listesi ve filtreler | Yok |
| `/islem-kayitlari/:id` | `ActivityLogDetail` | İşlem kaydı detayı | Yok |
| `/raporlar` | `Reports` | Rapor grafikleri ve özet kartları | Yok |
| `/ayarlar` | `Settings` | Klinik/profil/bildirim ayar arayüzü | Yok |
| `/profil` | `Profile` | Kullanıcı profil arayüzü | Yok |
| `/destek` | `Support` | Destek kanalları ve yardım içeriği | Yok |

## Route Sırası Notları

- `/randevular/yeni`, gelecekte eklenebilecek `/randevular/:id` route'undan önce kalmalıdır.
- `/personeller/yeni`, `/personeller/:id` route'undan önce tanımlıdır.
- `/tetkikler/:id` mevcut dosyada `/tetkikler` statik route'undan sonra tanımlıdır ve bu kullanım güvenlidir.

## Query Parametreleri

- `yeniMuayene=true`: Hasta detayında yeni muayene formunu açar. Randevu listesindeki `Görüntüle` bağlantısı bu parametreyle hasta detayına gider.
- `dosya=...`: Hasta detayında belirli muayene dosyasını seçer.
- `duzenle=true`: Fiyat detayında düzenleme formunu açar.
