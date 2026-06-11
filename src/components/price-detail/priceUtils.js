export const formatCurrency = (value) => `₺${Number(value || 0).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}`

export const statusClasses = {
  Aktif: 'bg-green-100 text-green-700',
  Pasif: 'bg-red-100 text-red-700',
  Arşivlendi: 'bg-gray-100 text-gray-600',
}

export const boolText = (value, trueText = 'Evet', falseText = 'Hayır') => value ? trueText : falseText
