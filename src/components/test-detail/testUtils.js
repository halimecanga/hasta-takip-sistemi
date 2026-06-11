export const statusClasses = {
  Bekliyor: 'bg-yellow-100 text-yellow-700',
  İnceleniyor: 'bg-orange-100 text-orange-700',
  Hazır: 'bg-green-100 text-green-700',
  'İptal Edildi': 'bg-red-100 text-red-700',
}

export const parameterStatusClasses = {
  Normal: 'bg-green-100 text-green-700',
  Düşük: 'bg-yellow-100 text-yellow-700',
  Yüksek: 'bg-orange-100 text-orange-700',
  Kritik: 'bg-red-100 text-red-700',
}

export const boolText = (value) => value ? 'Evet' : 'Hayır'

export const isLaboratoryTest = (test) => test.category === 'Laboratuvar' || test.category === 'Alerji'
