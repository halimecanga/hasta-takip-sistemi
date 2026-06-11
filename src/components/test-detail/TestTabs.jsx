import { isLaboratoryTest } from './testUtils'

export default function TestTabs({ activeTab, onChange, test }) {
  const tabs = [
    { key: 'overview', label: 'Sonuç Özeti' },
    { key: 'results', label: isLaboratoryTest(test) ? 'Parametreler' : 'Bulgular' },
    { key: 'evaluation', label: 'Doktor Değerlendirmesi' },
    { key: 'history', label: 'Geçmiş' },
    { key: 'documents', label: 'Belgeler' },
  ]

  return (
    <div className="-mx-1 mb-5 overflow-x-auto px-1" role="tablist" aria-label="Tetkik detay sekmeleri">
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
