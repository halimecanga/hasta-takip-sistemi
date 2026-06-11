import { CalendarCheck, CircleDollarSign, TrendingUp, UsersRound } from 'lucide-react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import PageTitle from '../components/PageTitle'
import StatCard from '../components/StatCard'
import { appointmentStatus, monthlyPatients } from '../data/mockData'
import { cardHeaderClass, mutedSmallTextClass, paddedCardClass, sectionHeadingClass } from '../styles/uiClasses'

export default function Reports() {
  return (
    <>
      <PageTitle title="Raporlar" subtitle="Klinik performansını grafikler ve özetlerle analiz edin." />
      <section className="mb-5 grid grid-cols-3 gap-4 max-[1180px]:grid-cols-2 max-[640px]:grid-cols-1 max-[640px]:gap-3">
        <StatCard title="Aylık Hasta" value="428" trend="+%9,7 geçen aya göre" icon={UsersRound} />
        <StatCard title="Randevu Doluluk" value="%87" trend="+%4,2 geçen aya göre" icon={CalendarCheck} color="blue" />
        <StatCard title="Aylık Gelir" value="₺482.500" trend="+%9,6 geçen aya göre" icon={CircleDollarSign} color="green" />
        <StatCard title="Büyüme Oranı" value="%14,8" trend="+%2,1 yıllık" icon={TrendingUp} color="purple" />
      </section>
      <section className="grid grid-cols-2 gap-5 max-[900px]:grid-cols-1">
        <div className={`${paddedCardClass} min-w-0`}><div className={cardHeaderClass}><div><h3 className={sectionHeadingClass}>Aylık Hasta Sayısı</h3><p className={mutedSmallTextClass}>Son 6 aylık hasta gelişimi</p></div></div><ResponsiveContainer width="100%" height={280}><AreaChart data={monthlyPatients}><defs><linearGradient id="reportPatient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/><stop offset="95%" stopColor="#f97316" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="month"/><YAxis/><Tooltip/><Area type="monotone" dataKey="patients" name="Hasta" stroke="#f97316" strokeWidth={3} fill="url(#reportPatient)"/></AreaChart></ResponsiveContainer></div>
        <div className={`${paddedCardClass} min-w-0`}><div className={cardHeaderClass}><div><h3 className={sectionHeadingClass}>Randevu Durumları</h3><p className={mutedSmallTextClass}>Randevu sonuç dağılımı</p></div></div><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={appointmentStatus} dataKey="value" nameKey="name" innerRadius={62} outerRadius={95} paddingAngle={4}>{appointmentStatus.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip/><Legend /></PieChart></ResponsiveContainer></div>
        <div className={`${paddedCardClass} col-span-full min-w-0 max-[900px]:col-auto`}><div className={cardHeaderClass}><div><h3 className={sectionHeadingClass}>Gelir Özeti</h3><p className={mutedSmallTextClass}>Aylara göre tahsilat performansı</p></div></div><ResponsiveContainer width="100%" height={300}><BarChart data={monthlyPatients}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="month"/><YAxis tickFormatter={(value) => `${value / 1000}K`}/><Tooltip formatter={(value) => [`₺${value.toLocaleString('tr-TR')}`, 'Gelir']}/><Bar dataKey="income" name="Gelir" fill="#f97316" radius={[8, 8, 0, 0]} barSize={42}/></BarChart></ResponsiveContainer></div>
      </section>
    </>
  )
}
