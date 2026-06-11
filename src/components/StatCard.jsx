const iconClasses = {
  orange: 'bg-orange-50 text-orange-600',
  blue: 'bg-blue-50 text-blue-600',
  yellow: 'bg-yellow-50 text-yellow-600',
  green: 'bg-green-50 text-green-600',
  purple: 'bg-violet-50 text-violet-600',
  red: 'bg-red-50 text-red-600',
}

export default function StatCard({ title, value, trend, trendDown, icon: Icon, color = 'orange' }) {
  return (
    <div className="relative flex min-h-32 items-start gap-[13px] overflow-hidden rounded-2xl border border-[#edf0f3] bg-white p-[18px] shadow-[0_10px_30px_rgba(17,24,39,.06)] after:absolute after:inset-y-0 after:left-0 after:w-[3px] after:bg-orange-500 max-[640px]:min-h-[108px]">
      <div className={`grid h-[42px] w-[42px] shrink-0 place-items-center rounded-xl ${iconClasses[color] || iconClasses.orange}`}><Icon size={22} /></div>
      <div>
        <span className="mb-2 block text-[11px] font-medium text-gray-500">{title}</span>
        <strong className="mb-[7px] block text-[22px] tracking-[-.5px]">{value}</strong>
        <small className={`block text-[10px] ${trendDown ? 'text-orange-600' : 'text-green-600'}`}>{trend}</small>
      </div>
    </div>
  )
}
