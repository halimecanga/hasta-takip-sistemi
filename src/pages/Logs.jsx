import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Search } from 'lucide-react'
import PageTitle from '../components/PageTitle'
import { logsApi } from '../services/api'
import { formInputClass, paddedCardClass, textButtonClass } from '../styles/uiClasses'

const statusClasses = {
  Başarılı: 'bg-green-50 text-green-700 border-green-100',
  Hata: 'bg-red-50 text-red-700 border-red-100',
  Uyarı: 'bg-orange-50 text-orange-700 border-orange-100',
}

const initialsFor = (name) => {
  if (name === 'Sistem') return 'S'
  return name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
}

export default function Logs() {
  const [logs, setLogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [staff, setStaff] = useState('')
  const [date, setDate] = useState('')

  useEffect(() => {
    logsApi.list({ search, status, staff, date })
      .then(setLogs)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setIsLoading(false))
  }, [search, status, staff, date])

  const staffOptions = useMemo(() => [...new Set(logs.map((log) => log.user))], [logs])

  return (
    <>
      <PageTitle title="İşlem Kayıtları" subtitle="Sistem üzerindeki kullanıcı hareketlerini inceleyin." />
      <div className={paddedCardClass}>
        <div className="mb-5 grid grid-cols-[minmax(220px,1.5fr)_repeat(3,minmax(135px,1fr))] gap-3 max-[980px]:grid-cols-2 max-[520px]:grid-cols-1">
          <label className="relative block">
            <span className="sr-only">Kullanıcı veya işlem ara</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input aria-label="Kullanıcı veya işlem ara" className={`${formInputClass} pl-9`} onChange={(event) => setSearch(event.target.value)} placeholder="Kullanıcı veya işlem ara..." type="search" value={search} />
          </label>
          <select aria-label="Duruma göre filtrele" className={formInputClass} onChange={(event) => setStatus(event.target.value)} value={status}>
            <option value="">Tüm Durumlar</option>
            <option value="Başarılı">Başarılı</option>
            <option value="Hata">Hata</option>
            <option value="Uyarı">Uyarı</option>
          </select>
          <select aria-label="Personele göre filtrele" className={formInputClass} onChange={(event) => setStaff(event.target.value)} value={staff}>
            <option value="">Tüm Personeller</option>
            {staffOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
          <input aria-label="Tarihe göre filtrele" className={formInputClass} onChange={(event) => setDate(event.target.value)} type="date" value={date} />
        </div>
        {isLoading ? <p className="py-8 text-center text-sm text-gray-500">İşlem kayıtları yükleniyor...</p> : error ? <p className="py-8 text-center text-sm text-red-600">{error}</p> : (
          <div className="-mx-5 -mb-5 overflow-x-auto max-[640px]:-mx-4 max-[640px]:-mb-4">
            <table className="w-full min-w-[680px] table-fixed border-collapse">
              <thead>
                <tr>
                  {['Kullanıcı', 'İşlem', 'Sayfa', 'Tarih', 'Saat', 'Durum', 'Detay'].map((label) => (
                    <th className="whitespace-nowrap border-y border-gray-200 bg-gray-50 px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-[.35px] text-gray-500" key={label}>{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 && (
                  <tr>
                    <td className="px-3 py-3 text-center text-[11px] text-gray-500" colSpan={7}>Filtrelere uygun işlem kaydı bulunamadı.</td>
                  </tr>
                )}
                {logs.map((row) => (
                  <tr className="hover:bg-[#fffaf5]" key={row.id}>
                    <td className="border-b border-[#f1f3f5] px-3 py-2 text-[11px] text-gray-700">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-50 text-[10px] font-semibold text-orange-700">{initialsFor(row.user)}</span>
                        <span className="min-w-0 truncate text-[11px] font-semibold text-gray-800">{row.user}</span>
                      </div>
                    </td>
                    <td className="border-b border-[#f1f3f5] px-3 py-2 text-[11px] font-semibold text-gray-800">{row.action}</td>
                    <td className="border-b border-[#f1f3f5] px-3 py-2 text-[11px] text-gray-700">{row.page}</td>
                    <td className="border-b border-[#f1f3f5] px-3 py-2 text-[11px] text-gray-700">{row.date}</td>
                    <td className="border-b border-[#f1f3f5] px-3 py-2 text-[11px] text-gray-700">{row.time}</td>
                    <td className="border-b border-[#f1f3f5] px-3 py-2 text-[11px] text-gray-700">
                      <span className={`inline-flex rounded-full border px-2 py-1 text-[10px] font-semibold ${statusClasses[row.status] || statusClasses.Başarılı}`}>{row.status}</span>
                    </td>
                    <td className="border-b border-[#f1f3f5] px-3 py-2 text-[11px] text-gray-700">
                      <Link aria-label={`${row.id} işlem kaydı detayını görüntüle`} className={textButtonClass} to={`/islem-kayitlari/${row.id}`}>
                        <Eye size={15} />
                        Detay
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
