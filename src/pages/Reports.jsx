import { useEffect, useState } from 'react'
import { CalendarCheck, CircleDollarSign, TrendingUp, UsersRound } from 'lucide-react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import PageTitle from '../components/PageTitle'
import StatCard from '../components/StatCard'
import { reportsApi } from '../services/api'
import { cardHeaderClass, formInputClass, mutedSmallTextClass, paddedCardClass, sectionHeadingClass } from '../styles/uiClasses'

export default function Reports() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    reportsApi.get({ from, to }).then(setData).catch((requestError) => setError(requestError.message))
  }, [from, to])

  if (error) return <section className={`${paddedCardClass} py-16 text-center text-sm text-red-600`}>{error}</section>
  if (!data) return <section className={`${paddedCardClass} py-16 text-center text-sm text-gray-500`}>Raporlar yükleniyor...</section>

  return (
    <>
      <PageTitle title="Raporlar" subtitle="Klinik performansını grafikler ve özetlerle analiz edin." />
      <div className="mb-5 grid grid-cols-2 gap-3 max-[640px]:grid-cols-1">
        <input aria-label="Başlangıç tarihi" className={formInputClass} type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
        <input aria-label="Bitiş tarihi" className={formInputClass} type="date" value={to} onChange={(event) => setTo(event.target.value)} />
      </div>
      <section className="mb-5 grid grid-cols-3 gap-4 max-[1180px]:grid-cols-2 max-[640px]:grid-cols-1 max-[640px]:gap-3">
        <StatCard title="Muayene Sayısı" value={String(data.summary.examinations)} trend="Seçilen aralık" icon={UsersRound} />
        <StatCard title="Hasta Sayısı" value={String(data.summary.patients)} trend="Tekil hasta" icon={CalendarCheck} color="blue" />
        <StatCard title="Tahsilat" value={data.summary.collected} trend="Ödenen tutar" icon={CircleDollarSign} color="green" />
        <StatCard title="Kalan Ödeme" value={data.summary.remaining} trend="Bekleyen bakiye" icon={TrendingUp} color="purple" />
      </section>
      <section className="grid grid-cols-2 gap-5 max-[900px]:grid-cols-1">
        <div className={`${paddedCardClass} min-w-0`}><div className={cardHeaderClass}><div><h3 className={sectionHeadingClass}>Aylık Hasta Sayısı</h3><p className={mutedSmallTextClass}>Muayene yapılan hasta sayısı</p></div></div><ResponsiveContainer width="100%" height={280}><AreaChart data={data.monthlyPatients}><defs><linearGradient id="reportPatient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/><stop offset="95%" stopColor="#f97316" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="month"/><YAxis/><Tooltip/><Area type="monotone" dataKey="patients" name="Hasta" stroke="#f97316" strokeWidth={3} fill="url(#reportPatient)"/></AreaChart></ResponsiveContainer></div>
        <div className={`${paddedCardClass} min-w-0`}><div className={cardHeaderClass}><div><h3 className={sectionHeadingClass}>Randevu Durumları</h3><p className={mutedSmallTextClass}>Randevu sonuç dağılımı</p></div></div><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={data.appointmentStatus} dataKey="value" nameKey="name" innerRadius={62} outerRadius={95} paddingAngle={4}>{data.appointmentStatus.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip/><Legend /></PieChart></ResponsiveContainer></div>
        <div className={`${paddedCardClass} col-span-full min-w-0 max-[900px]:col-auto`}><div className={cardHeaderClass}><div><h3 className={sectionHeadingClass}>Gelir Özeti</h3><p className={mutedSmallTextClass}>Aylara göre tahsilat performansı</p></div></div><ResponsiveContainer width="100%" height={300}><BarChart data={data.monthlyPatients}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="month"/><YAxis tickFormatter={(value) => `${value / 1000}K`}/><Tooltip formatter={(value) => [`₺${Number(value).toLocaleString('tr-TR')}`, 'Gelir']}/><Bar dataKey="income" name="Gelir" fill="#f97316" radius={[8, 8, 0, 0]} barSize={42}/></BarChart></ResponsiveContainer></div>
      </section>
    </>
  )
}
