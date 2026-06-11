import { CalendarCheck, CircleDollarSign, ClipboardCheck, Stethoscope, UserRoundCheck, UsersRound } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import DataTable from '../components/DataTable'
import PageTitle from '../components/PageTitle'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import { appointments, appointmentStatus, examinations, monthlyPatients } from '../data/mockData'
import { cardHeaderClass, linkButtonClass, mutedSmallTextClass, paddedCardClass, sectionHeadingClass } from '../styles/uiClasses'

const appointmentColumns = [
  { key: 'patient', label: 'Hasta Adı' }, { key: 'date', label: 'Tarih' },
  { key: 'time', label: 'Saat' }, { key: 'status', label: 'Durum', render: (row) => <StatusBadge status={row.status} /> },
]

export default function Dashboard() {
  return (
    <>
      <PageTitle title="Dashboard" subtitle="Kliniğinizin bugünkü performansına genel bakış." />
      <section className="mb-5 grid grid-cols-3 gap-4 max-[1180px]:grid-cols-2 max-[640px]:grid-cols-1 max-[640px]:gap-3">
        <StatCard title="Bugünkü Randevular" value="24" trend="+%12 geçen haftaya göre" icon={CalendarCheck} />
        <StatCard title="Toplam Hasta" value="1.842" trend="+48 bu ay" icon={UsersRound} color="blue" />
        <StatCard title="Bekleyen Muayene" value="8" trend="-3 düne göre" trendDown icon={Stethoscope} color="yellow" />
        <StatCard title="Aylık Gelir" value="₺482.500" trend="+%18 geçen aya göre" icon={CircleDollarSign} color="green" />
        <StatCard title="Tamamlanan İşlem" value="156" trend="+%9 bu hafta" icon={ClipboardCheck} color="purple" />
        <StatCard title="Aktif Personel" value="7" trend="1 doktor, 6 klinik personeli" icon={UserRoundCheck} color="red" />
      </section>
      <section className="grid grid-cols-[1.4fr_1fr] gap-5 max-[900px]:grid-cols-1">
        <div className={`${paddedCardClass} col-span-full`}>
          <div className={cardHeaderClass}><div><h3 className={sectionHeadingClass}>Son Randevular</h3><p className={mutedSmallTextClass}>Güncel randevu hareketleri</p></div><button className={linkButtonClass} type="button">Tümünü Gör</button></div>
          <DataTable columns={appointmentColumns} data={appointments.slice(0, 4)} />
        </div>
        <div className={paddedCardClass}>
          <div className={cardHeaderClass}><div><h3 className={sectionHeadingClass}>Yaklaşan Muayeneler</h3><p className={mutedSmallTextClass}>Sıradaki hasta planı</p></div></div>
          <div className="flex flex-col gap-3">
            {examinations.slice(0, 3).map((item, index) => (
              <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2.5 rounded-[11px] bg-gray-50 p-[9px]" key={item.patient}><div className="rounded-lg bg-orange-50 p-[7px] text-[10px] font-bold text-orange-600">{['10:15', '11:00', '13:30'][index]}</div><div><strong className="mb-[3px] block text-[11px]">{item.patient}</strong><span className="block text-[10px] text-gray-500">{item.diagnosis}</span></div><StatusBadge status={item.status} /></div>
            ))}
          </div>
        </div>
        <div className={`${paddedCardClass} min-w-0`}>
          <div className={cardHeaderClass}><div><h3 className={sectionHeadingClass}>Aylık Hasta Grafiği</h3><p className={mutedSmallTextClass}>Son 6 aylık hasta sayısı</p></div></div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyPatients}><defs><linearGradient id="patientFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f97316" stopOpacity={0.28}/><stop offset="95%" stopColor="#f97316" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb"/><XAxis dataKey="month" axisLine={false} tickLine={false}/><YAxis axisLine={false} tickLine={false}/><Tooltip/><Area type="monotone" dataKey="patients" stroke="#f97316" strokeWidth={3} fill="url(#patientFill)"/></AreaChart>
          </ResponsiveContainer>
        </div>
        <div className={`${paddedCardClass} min-w-0`}>
          <div className={cardHeaderClass}><div><h3 className={sectionHeadingClass}>Randevu Durum Grafiği</h3><p className={mutedSmallTextClass}>Bu ayın dağılımı</p></div></div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart><Pie data={appointmentStatus} dataKey="value" innerRadius={60} outerRadius={88} paddingAngle={4}>{appointmentStatus.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
          <div className="-mt-[3px] flex flex-wrap justify-center gap-3.5">{appointmentStatus.map((item) => <span className="text-[10px] text-gray-500" key={item.name}><i className="mr-[5px] inline-block h-[7px] w-[7px] rounded-full" style={{ background: item.color }} />{item.name} <strong className="ml-[3px] text-gray-700">%{item.value}</strong></span>)}</div>
        </div>
      </section>
    </>
  )
}
