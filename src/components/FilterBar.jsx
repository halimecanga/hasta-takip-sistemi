import { Search } from 'lucide-react'
import { formInputClass } from '../styles/uiClasses'

export default function FilterBar({ status = true, date = true, placeholder = 'Kayıtlarda ara...' }) {
  return (
    <div className="mb-[18px] flex justify-end gap-2.5 max-[640px]:flex-wrap max-[640px]:justify-stretch">
      <label className="flex w-[260px] items-center gap-2 rounded-[11px] border border-gray-200 bg-gray-50 px-[11px] py-2 text-gray-400 transition duration-200 ease-in-out focus-within:border-orange-300 focus-within:shadow-[0_0_0_3px_#fff7ed] max-[640px]:w-full"><Search size={17} /><input aria-label={placeholder} className="w-full border-0 bg-transparent text-xs text-gray-900 outline-0 placeholder:text-gray-400" placeholder={placeholder} /></label>
      {status && <select aria-label="Duruma göre filtrele" className={`${formInputClass} w-auto px-2.5 py-[9px] max-[640px]:min-w-[130px] max-[640px]:flex-1`} defaultValue=""><option value="">Tüm Durumlar</option><option>Aktif</option><option>Bekliyor</option><option>Tamamlandı</option></select>}
      {date && <input aria-label="Tarihe göre filtrele" className={`${formInputClass} w-auto px-2.5 py-[9px] max-[640px]:min-w-[130px] max-[640px]:flex-1`} type="date" />}
    </div>
  )
}
