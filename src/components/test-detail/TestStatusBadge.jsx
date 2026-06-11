import { statusClasses } from './testUtils'

export default function TestStatusBadge({ status }) {
  return <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2 py-[5px] text-[9px] font-bold ${statusClasses[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>
}
