import { Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout'
import ActivityLogDetail from './pages/ActivityLogDetail'
import AddAppointment from './pages/AddAppointment'
import AddStaff from './pages/AddStaff'
import Appointments from './pages/Appointments'
import Dashboard from './pages/Dashboard'
import Examinations from './pages/Examinations'
import Logs from './pages/Logs'
import Patients from './pages/Patients'
import PatientDetail from './pages/PatientDetail'
import AddPatient from './pages/AddPatient'
import Prescriptions from './pages/Prescriptions'
import PrescriptionDetail from './pages/PrescriptionDetail'
import PriceDetail from './pages/PriceDetail'
import PriceList from './pages/PriceList'
import Profile from './pages/Profile'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Staff from './pages/Staff'
import StaffDetail from './pages/StaffDetail'
import Support from './pages/Support'
import Tests from './pages/Tests'
import TestDetail from './pages/TestDetail'

export default function App() {
  return (
    <Routes>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="randevular" element={<Appointments />} />
            <Route path="randevular/yeni" element={<AddAppointment />} />
            <Route path="hastalar" element={<Patients />} />
            <Route path="hastalar/yeni" element={<AddPatient />} />
            <Route path="hastalar/:id" element={<PatientDetail />} />
            <Route path="muayeneler" element={<Examinations />} />
            <Route path="receteler" element={<Prescriptions />} />
            <Route path="receteler/:id" element={<PrescriptionDetail />} />
            <Route path="tetkikler" element={<Tests />} />
            <Route path="personeller" element={<Staff />} />
            <Route path="personeller/yeni" element={<AddStaff />} />
            <Route path="personeller/:id" element={<StaffDetail />} />
            <Route path="fiyat-listesi" element={<PriceList />} />
            <Route path="fiyat-listesi/:id" element={<PriceDetail />} />
            <Route path="islem-kayitlari" element={<Logs />} />
            <Route path="islem-kayitlari/:id" element={<ActivityLogDetail />} />
            <Route path="raporlar" element={<Reports />} />
            <Route path="ayarlar" element={<Settings />} />
            <Route path="profil" element={<Profile />} />
            <Route path="destek" element={<Support />} />
            <Route path="tetkikler/:id" element={<TestDetail />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
  )
}
