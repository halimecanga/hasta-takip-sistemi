# Component Dizini

| Component | Dosya | Kategori | Kullanıldığı Yer | Görevi |
| --- | --- | --- | --- | --- |
| `App` | `src/App.jsx` | Uygulama | `main.jsx` | Provider ve route ağacını kurar. |
| `AdminLayout` | `src/layouts/AdminLayout.jsx` | Layout | Route layout | Sidebar/header/main yerleşimini sağlar. |
| `Header` | `src/components/Header.jsx` | Layout | `AdminLayout` | Üst başlık ve mobil menü butonu. |
| `Sidebar` | `src/components/Sidebar.jsx` | Layout | `AdminLayout` | Ana navigasyon menüsü. |
| `PageTitle` | `src/components/PageTitle.jsx` | Ortak | Çoğu sayfa | Başlık, açıklama ve aksiyon alanı. |
| `DataTable` | `src/components/DataTable.jsx` | Ortak | Liste sayfaları | Kolon tanımına göre responsive tablo render eder. |
| `FilterBar` | `src/components/FilterBar.jsx` | Ortak | `Appointments` | Basit arama/durum/tarih filtre arayüzü. |
| `StatusBadge` | `src/components/StatusBadge.jsx` | Ortak | Liste/detay sayfaları | Durum metnine göre rozet gösterir. |
| `RowActionsMenu` | `src/components/RowActionsMenu.jsx` | Ortak | Liste satırları | Üç nokta satır aksiyon menüsü. |
| `ConfirmActionModal` | `src/components/ConfirmActionModal.jsx` | Ortak | Durum/iptal/onay akışları | Erişilebilir onay modalı. |
| `InlineNotification` | `src/components/InlineNotification.jsx` | Ortak | Liste/form sayfaları | Geçici başarı/uyarı/hata bildirimi. |
| `StatCard` | `src/components/StatCard.jsx` | Ortak | `Dashboard`, `Reports` | Metrik kartı. |
| `Dashboard` | `src/pages/Dashboard.jsx` | Sayfa | `/` | Klinik özet dashboard'u. |
| `Appointments` | `src/pages/Appointments.jsx` | Randevu | `/randevular` | Randevu listesini Context'ten gösterir. |
| `AddAppointment` | `src/pages/AddAppointment.jsx` | Randevu | `/randevular/yeni` | Yeni randevu formu ve doğrulamaları. |
| `Patients` | `src/pages/Patients.jsx` | Hasta | `/hastalar` | Hasta listesi, arama ve arşivleme. |
| `PatientDetail` | `src/pages/PatientDetail.jsx` | Hasta | `/hastalar/:id` | Hasta detay, dosya seçimi ve yeni muayene akışı. |
| `EmptyState` | `src/components/patient-detail/EmptyState.jsx` | Hasta | `PatientDetail` | Hasta bulunamadı durumu. |
| `PatientHeader` | `src/components/patient-detail/PatientHeader.jsx` | Hasta | `PatientDetail` | Hasta detay üst aksiyonları. |
| `PatientAlerts` | `src/components/patient-detail/PatientAlerts.jsx` | Hasta | `PatientDetail` | Alerji/kronik hastalık uyarıları. |
| `PatientSummaryCard` | `src/components/patient-detail/PatientSummaryCard.jsx` | Hasta | `PatientDetail` | Hasta kimlik ve sağlık özeti. |
| `PatientQuickStats` | `src/components/patient-detail/PatientQuickStats.jsx` | Hasta | `PatientDetail` | Hasta hızlı istatistikleri. |
| `VisitHistory` | `src/components/patient-detail/VisitHistory.jsx` | Hasta | `PatientDetail` | Muayene dosyası listesi. |
| `VisitDetails` | `src/components/patient-detail/VisitDetails.jsx` | Hasta | `PatientDetail` | Seçili muayene dosyası sekmeleri. |
| `VisitTabs` | `src/components/patient-detail/VisitTabs.jsx` | Hasta | `VisitDetails` | Muayene detay sekmeleri. |
| `NewExaminationForm` | `src/components/patient-detail/NewExaminationForm.jsx` | Hasta | `PatientDetail` | Frontend state içinde yeni muayene kaydı oluşturur. |
| `Examinations` | `src/pages/Examinations.jsx` | Muayene | `/muayeneler` | Muayene listesi ve durum işlemleri. |
| `Prescriptions` | `src/pages/Prescriptions.jsx` | Reçete | `/receteler` | Reçete listesi ve taslak/iptal işlemleri. |
| `PrescriptionDetail` | `src/pages/PrescriptionDetail.jsx` | Reçete | `/receteler/:id` | Reçete detay, sekme ve iptal akışı. |
| `PrescriptionHeader` | `src/components/prescription-detail/PrescriptionHeader.jsx` | Reçete | `PrescriptionDetail` | Detay üst aksiyonları. |
| `PrescriptionSummary` | `src/components/prescription-detail/PrescriptionSummary.jsx` | Reçete | `PrescriptionDetail` | Reçete özet kartı. |
| `PrescriptionQuickStats` | `src/components/prescription-detail/PrescriptionQuickStats.jsx` | Reçete | `PrescriptionDetail` | Reçete hızlı metrikleri. |
| `PrescriptionAlerts` | `src/components/prescription-detail/PrescriptionAlerts.jsx` | Reçete | `PrescriptionDetail` | Reçete uyarıları. |
| `PrescriptionTabs` | `src/components/prescription-detail/PrescriptionTabs.jsx` | Reçete | `PrescriptionDetail` | Reçete sekmeleri. |
| `PrescriptionOverview` | `src/components/prescription-detail/PrescriptionOverview.jsx` | Reçete | `PrescriptionDetail` | Reçete genel bilgileri. |
| `PrescriptionEditForm` | `src/components/prescription-detail/PrescriptionEditForm.jsx` | Reçete | `PrescriptionDetail` | Reçete frontend düzenleme formu. |
| `MedicineList` | `src/components/prescription-detail/MedicineList.jsx` | Reçete | `PrescriptionDetail` | İlaç listesi. |
| `MedicationSchedule` | `src/components/prescription-detail/MedicationSchedule.jsx` | Reçete | `PrescriptionDetail` | İlaç kullanım planı. |
| `InstructionsTab` | `src/components/prescription-detail/InstructionsTab.jsx` | Reçete | `PrescriptionDetail` | Kullanım talimatları. |
| `PrescriptionHistory` | `src/components/prescription-detail/PrescriptionHistory.jsx` | Reçete | `PrescriptionDetail` | Reçete işlem geçmişi. |
| `PrescriptionDocuments` | `src/components/prescription-detail/PrescriptionDocuments.jsx` | Reçete | `PrescriptionDetail` | Reçete belgeleri. |
| `PatientInfoCard` | `src/components/prescription-detail/PatientInfoCard.jsx` | Reçete | `PrescriptionSummary` | Reçete hasta bilgi kartı. |
| `EmptyState` | `src/components/prescription-detail/EmptyState.jsx` | Reçete | `PrescriptionDetail` | Reçete bulunamadı durumu. |
| `Tests` | `src/pages/Tests.jsx` | Tetkik | `/tetkikler` | Tetkik listesi ve durum işlemleri. |
| `TestDetail` | `src/pages/TestDetail.jsx` | Tetkik | `/tetkikler/:id` | Tetkik sonuç detay sayfası. |
| `TestDetailHeader` | `src/components/test-detail/TestDetailHeader.jsx` | Tetkik | `TestDetail` | Tetkik üst aksiyonları. |
| `TestSummaryCard` | `src/components/test-detail/TestSummaryCard.jsx` | Tetkik | `TestDetail` | Tetkik özet kartı. |
| `TestQuickStats` | `src/components/test-detail/TestQuickStats.jsx` | Tetkik | `TestDetail` | Tetkik hızlı metrikleri. |
| `TestStatusPanel` | `src/components/test-detail/TestStatusPanel.jsx` | Tetkik | `TestDetail` | Duruma göre açıklama paneli. |
| `TestTabs` | `src/components/test-detail/TestTabs.jsx` | Tetkik | `TestDetail` | Tetkik sekmeleri. |
| `TestOverview` | `src/components/test-detail/TestOverview.jsx` | Tetkik | `TestDetail` | Tetkik genel bilgileri. |
| `LaboratoryResults` | `src/components/test-detail/LaboratoryResults.jsx` | Tetkik | `TestDetail` | Laboratuvar sonuç tablosu. |
| `ImagingFindings` | `src/components/test-detail/ImagingFindings.jsx` | Tetkik | `TestDetail` | Görüntüleme bulguları. |
| `DoctorEvaluation` | `src/components/test-detail/DoctorEvaluation.jsx` | Tetkik | `TestDetail` | Doktor değerlendirmesi. |
| `TestHistory` | `src/components/test-detail/TestHistory.jsx` | Tetkik | `TestDetail` | Tetkik işlem geçmişi. |
| `TestDocuments` | `src/components/test-detail/TestDocuments.jsx` | Tetkik | `TestDetail` | Tetkik belgeleri. |
| `TestStatusBadge` | `src/components/test-detail/TestStatusBadge.jsx` | Tetkik | Tetkik alt componentleri | Tetkik özel durum rozeti. |
| `PatientInfoCard` | `src/components/test-detail/PatientInfoCard.jsx` | Tetkik | `TestSummaryCard` | Tetkik hasta bilgi kartı. |
| `EmptyState` | `src/components/test-detail/EmptyState.jsx` | Tetkik | `TestDetail` | Tetkik bulunamadı durumu. |
| `Staff` | `src/pages/Staff.jsx` | Personel | `/personeller` | Personel kart listesi ve durum işlemleri. |
| `AddStaff` | `src/pages/AddStaff.jsx` | Personel | `/personeller/yeni` | Yeni personel sayfası. |
| `AddStaffForm` | `src/components/staff-add/AddStaffForm.jsx` | Personel | `AddStaff` | Yeni personel formu. |
| `StaffDetail` | `src/pages/StaffDetail.jsx` | Personel | `/personeller/:id` | Personel detay ve düzenleme. |
| `StaffHeader` | `src/components/staff-detail/StaffHeader.jsx` | Personel | `StaffDetail` | Detay üst aksiyonları. |
| `StaffSummaryCard` | `src/components/staff-detail/StaffSummaryCard.jsx` | Personel | `StaffDetail` | Personel özet kartı. |
| `StaffQuickStats` | `src/components/staff-detail/StaffQuickStats.jsx` | Personel | `StaffDetail` | Personel hızlı metrikleri. |
| `StaffTabs` | `src/components/staff-detail/StaffTabs.jsx` | Personel | `StaffDetail` | Personel sekmeleri. |
| `StaffGeneralInfo` | `src/components/staff-detail/StaffGeneralInfo.jsx` | Personel | `StaffDetail` | Genel personel bilgileri. |
| `StaffRoleDetails` | `src/components/staff-detail/StaffRoleDetails.jsx` | Personel | `StaffDetail` | Role özel bilgiler. |
| `StaffSchedule` | `src/components/staff-detail/StaffSchedule.jsx` | Personel | `StaffDetail` | Çalışma planı. |
| `StaffLeaves` | `src/components/staff-detail/StaffLeaves.jsx` | Personel | `StaffDetail` | İzin özeti ve geçmişi. |
| `StaffActivities` | `src/components/staff-detail/StaffActivities.jsx` | Personel | `StaffDetail` | Aktivite geçmişi. |
| `StaffDocuments` | `src/components/staff-detail/StaffDocuments.jsx` | Personel | `StaffDetail` | Personel belgeleri. |
| `StaffEditForm` | `src/components/staff-detail/StaffEditForm.jsx` | Personel | `StaffDetail` | Personel frontend düzenleme formu. |
| `EmptyState` | `src/components/staff-detail/EmptyState.jsx` | Personel | `StaffDetail` | Personel bulunamadı durumu. |
| `PriceList` | `src/pages/PriceList.jsx` | Fiyat | `/fiyat-listesi` | Fiyat listesi ve durum işlemleri. |
| `PriceDetail` | `src/pages/PriceDetail.jsx` | Fiyat | `/fiyat-listesi/:id` | Fiyat detay ve düzenleme. |
| `PriceDetailHeader` | `src/components/price-detail/PriceDetailHeader.jsx` | Fiyat | `PriceDetail` | Detay üst aksiyonu. |
| `PriceSummaryCard` | `src/components/price-detail/PriceSummaryCard.jsx` | Fiyat | `PriceDetail` | Fiyat özet kartı. |
| `PriceInfoCards` | `src/components/price-detail/PriceInfoCards.jsx` | Fiyat | `PriceDetail` | Vergi/kullanım/kural bilgileri. |
| `PriceEditForm` | `src/components/price-detail/PriceEditForm.jsx` | Fiyat | `PriceDetail` | Fiyat frontend düzenleme formu. |
| `EmptyState` | `src/components/price-detail/EmptyState.jsx` | Fiyat | `PriceDetail` | Fiyat kaydı bulunamadı durumu. |
| `Logs` | `src/pages/Logs.jsx` | İşlem kaydı | `/islem-kayitlari` | Audit log listesi ve filtreleri. |
| `ActivityLogDetail` | `src/pages/ActivityLogDetail.jsx` | İşlem kaydı | `/islem-kayitlari/:id` | Audit log detay sayfası. |
| `Reports` | `src/pages/Reports.jsx` | Sayfa | `/raporlar` | Rapor özetleri ve grafikler. |
| `Settings` | `src/pages/Settings.jsx` | Sayfa | `/ayarlar` | Ayar arayüzü. |
| `Profile` | `src/pages/Profile.jsx` | Sayfa | `/profil` | Profil arayüzü. |
| `Support` | `src/pages/Support.jsx` | Sayfa | `/destek` | Destek bilgi arayüzü. |

## Temizlik Notu

`src/components/ActionButtons.jsx` kullanılmadığı için kaldırıldı. Kalan component dosyaları import ilişkilerinde kullanılıyor göründüğü için bu turda silinmedi.
