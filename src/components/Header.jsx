import { Bell, Menu, Search } from 'lucide-react'

const iconButtonFocusClass = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2'

export default function Header({ title, sidebarOpen, onMenuClick }) {
  return (
    <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-gray-200 bg-white/[0.94] px-[30px] backdrop-blur-[14px] max-[640px]:h-[66px] max-[640px]:px-4">
      <div className="flex items-center gap-3">
        <button
          aria-controls="app-sidebar"
          aria-expanded={sidebarOpen}
          aria-label="Menüyü aç"
          className={`hidden h-[34px] w-[34px] place-items-center rounded-[9px] border-0 bg-gray-50 text-gray-600 max-[900px]:grid ${iconButtonFocusClass}`}
          type="button"
          onClick={onMenuClick}
        ><Menu size={22} /></button>
        <h2 className="m-0 text-lg max-[640px]:text-[15px]">{title}</h2>
      </div>
      <div className="flex items-center gap-[17px] max-[640px]:gap-[7px]">
        <label className="flex w-[285px] items-center gap-2 rounded-[11px] border border-gray-200 bg-gray-50 px-3 py-[9px] text-gray-400 transition duration-200 ease-in-out focus-within:border-orange-300 focus-within:shadow-[0_0_0_3px_#fff7ed] max-[1180px]:w-[230px] max-[900px]:hidden"><Search size={18} /><input aria-label="Hasta, randevu veya işlem ara" className="w-full border-0 bg-transparent text-xs text-gray-900 outline-0 placeholder:text-gray-400" placeholder="Hasta, randevu veya işlem ara..." /></label>
        <button aria-label="Bildirimleri görüntüle" className={`relative grid h-9 w-9 place-items-center rounded-[10px] border-0 bg-gray-50 text-gray-600 ${iconButtonFocusClass}`} type="button"><Bell size={20} /><span className="absolute right-2 top-[7px] h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_0_2px_#fff]" /></button>
        <div className="flex items-center gap-[9px] border-l border-gray-200 pl-4 max-[640px]:pl-2"><div className="grid h-[38px] w-[38px] place-items-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-xs font-bold text-white">CK</div><div className="max-[640px]:hidden"><strong className="block text-xs">Dr. Cumhur Kesemenli</strong><span className="mt-[3px] block text-[11px] text-gray-500">Yönetici</span></div></div>
      </div>
    </header>
  )
}
