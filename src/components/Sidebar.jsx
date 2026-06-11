import {
  CalendarDays, ClipboardList, CreditCard, FileBarChart, FileText, FlaskConical,
  Headphones, LayoutDashboard, LogOut, Settings, Stethoscope, UserRound, UsersRound, X,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const items = [
  ['/', 'Dashboard', LayoutDashboard],
  ['/randevular', 'Randevular', CalendarDays],
  ['/hastalar', 'Hastalar', UsersRound],
  ['/muayeneler', 'Muayeneler', Stethoscope],
  ['/receteler', 'Reçeteler', FileText],
  ['/tetkikler', 'Tetkikler', FlaskConical],
  ['/personeller', 'Personeller', UserRound],
  ['/fiyat-listesi', 'Fiyat Listesi', CreditCard],
  ['/islem-kayitlari', 'İşlem Kayıtları', ClipboardList],
  ['/raporlar', 'Raporlar', FileBarChart],
  ['/ayarlar', 'Ayarlar', Settings],
  ['/profil', 'Profil', UserRound],
  ['/destek', 'Destek', Headphones],
]

export default function Sidebar({ open, onClose }) {
  const baseLinkClass = 'flex items-center gap-3 rounded-[11px] px-3 py-[11px] text-[13px] font-medium no-underline transition duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111827]'

  return (
    <>
      <aside id="app-sidebar" className={`fixed inset-y-0 left-0 z-30 flex w-[268px] flex-col bg-[#111827] px-4 pb-[18px] pt-6 text-white max-[900px]:-translate-x-full max-[900px]:transition-transform max-[900px]:duration-[250ms] max-[900px]:ease-in-out ${open ? 'max-[900px]:translate-x-0' : ''}`}>
        <div className="relative flex items-center gap-[11px] border-b border-white/[0.08] px-2 pb-[22px]">
          <div className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-[13px] bg-gradient-to-br from-orange-400 to-orange-600"><Stethoscope size={23} /></div>
          <div><strong className="block text-sm tracking-[-.2px]">Hasta Takip Sistemi</strong><span className="mt-1 block text-[11px] text-gray-400">Klinik Yönetim Paneli</span></div>
          <button aria-label="Menüyü kapat" className="absolute -right-1 -top-2 hidden h-[30px] w-[30px] place-items-center border-0 bg-transparent text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111827] max-[900px]:grid" type="button" onClick={onClose}><X size={20} /></button>
        </div>
        <nav className="flex flex-col gap-1 overflow-y-auto py-5">
          {items.map(([to, label, Icon]) => (
            <NavLink
              className={({ isActive }) => `${baseLinkClass} ${isActive ? 'bg-orange-500 text-white shadow-[0_6px_15px_rgba(249,115,22,.22)]' : 'text-slate-300 hover:bg-orange-500/[0.11] hover:text-white'}`}
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
            >
              <Icon size={19} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <button className="mt-auto flex w-full items-center gap-3 border-0 border-t border-white/[0.08] bg-transparent px-3 py-[11px] text-[13px] text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111827]" type="button"><LogOut size={19} />Çıkış Yap</button>
      </aside>
      {open && <button className="fixed inset-0 z-[25] block border-0 bg-gray-900/[0.48]" aria-label="Menüyü kapat" type="button" onClick={onClose} />}
    </>
  )
}
