import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

const titles = {
  '/': 'Dashboard', '/randevular': 'Randevular', '/randevular/yeni': 'Yeni Randevu', '/hastalar': 'Hastalar', '/muayeneler': 'Muayeneler',
  '/receteler': 'Reçeteler', '/tetkikler': 'Tetkikler', '/personeller': 'Personeller', '/personeller/yeni': 'Personel Ekle',
  '/fiyat-listesi': 'Fiyat Listesi', '/islem-kayitlari': 'İşlem Kayıtları', '/raporlar': 'Raporlar',
  '/ayarlar': 'Ayarlar', '/profil': 'Profil', '/destek': 'Destek',
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="ml-[268px] min-h-screen max-[900px]:ml-0">
        <Header title={titles[location.pathname] || 'Hasta Takip Sistemi'} sidebarOpen={sidebarOpen} onMenuClick={() => setSidebarOpen(true)} />
        <main className="px-[30px] pb-10 pt-7 max-[640px]:px-3.5 max-[640px]:pb-[30px] max-[640px]:pt-5"><Outlet /></main>
      </div>
    </div>
  )
}
