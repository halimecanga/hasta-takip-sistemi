const toneMap = {
  Aktif: 'bg-green-100 text-green-700',
  Aktifleştirildi: 'bg-green-100 text-green-700',
  Başarılı: 'bg-green-100 text-green-700',
  Hazır: 'bg-green-100 text-green-700',
  Onaylandı: 'bg-green-100 text-green-700',
  Tamamlandı: 'bg-green-100 text-green-700',
  Bekliyor: 'bg-yellow-100 text-yellow-700',
  İnceleniyor: 'bg-yellow-100 text-yellow-700',
  İzinli: 'bg-yellow-100 text-yellow-700',
  Raporlu: 'bg-yellow-100 text-yellow-700',
  Takipte: 'bg-yellow-100 text-yellow-700',
  Taslak: 'bg-slate-100 text-slate-700',
  Uyarı: 'bg-orange-100 text-orange-700',
  Arşivlendi: 'bg-gray-100 text-gray-600',
  'İşten Ayrıldı': 'bg-gray-200 text-gray-700',
  'İptal Edildi': 'bg-red-100 text-red-700',
  'Süresi Doldu': 'bg-red-100 text-red-700',
  Hata: 'bg-red-100 text-red-700',
  Pasif: 'bg-red-100 text-red-700',
}

export default function StatusBadge({ status }) {
  return <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2 py-[5px] text-[9px] font-bold ${toneMap[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>
}
