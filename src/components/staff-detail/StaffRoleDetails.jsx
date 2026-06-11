import { BriefcaseBusiness } from 'lucide-react'
import { paddedCardClass } from '../../styles/uiClasses'

export default function StaffRoleDetails({ roleDetails }) {
  if (!roleDetails) return null

  return (
    <section className={paddedCardClass}>
      <div className="mb-4 flex items-center gap-2">
        <BriefcaseBusiness className="text-orange-500" size={18} />
        <h2 className="text-sm font-bold text-gray-900">{roleDetails.title}</h2>
      </div>
      <dl className="grid grid-cols-2 gap-3 max-[640px]:grid-cols-1">
        {roleDetails.items.map((item) => (
          <div className="rounded-[12px] bg-gray-50 p-3" key={item.label}>
            <dt className="text-[10px] font-semibold uppercase text-gray-400">{item.label}</dt>
            <dd className="mt-1 text-xs font-semibold text-gray-700">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
