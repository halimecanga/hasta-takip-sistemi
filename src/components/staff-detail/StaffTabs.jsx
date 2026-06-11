const tabs = [
  { key: 'general', label: 'Genel Bilgiler' },
  { key: 'schedule', label: 'Çalışma Düzeni' },
  { key: 'leaves', label: 'İzinler' },
  { key: 'activities', label: 'Aktiviteler' },
  { key: 'documents', label: 'Belgeler' },
]

export default function StaffTabs({ activeTab, onChange }) {
  return (
    <div className="-mx-1 mb-5 overflow-x-auto px-1" role="tablist" aria-label="Personel detay sekmeleri">
      <div className="flex min-w-max gap-2 border-b border-gray-100">
        {tabs.map((tab) => (
          <button
            aria-selected={activeTab === tab.key}
            className={`border-b-2 px-3 py-2 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 ${activeTab === tab.key ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-orange-600'}`}
            key={tab.key}
            role="tab"
            type="button"
            onClick={() => onChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
