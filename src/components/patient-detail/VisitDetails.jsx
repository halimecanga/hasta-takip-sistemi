import { AlertCircle, Banknote, CheckCircle2, ClipboardPenLine, CreditCard, Download, Eye, FileText, Landmark, Plus, Printer } from 'lucide-react'
import StatusBadge from '../StatusBadge'
import { documentDownloadUrl, documentViewUrl } from '../../services/api'
import { outlineButtonClass, paddedCardClass, primaryButtonClass, sectionHeadingClass, textButtonClass } from '../../styles/uiClasses'
import VisitTabs from './VisitTabs'

const InfoBlock = ({ label, value }) => (
  <div className="rounded-[10px] bg-gray-50 p-3">
    <span className="block text-[10px] font-bold uppercase tracking-[.25px] text-gray-400">{label}</span>
    <p className="mt-1 text-xs leading-relaxed text-gray-700">{value || '-'}</p>
  </div>
)

const paymentIconMap = {
  'Kredi Kartı': CreditCard,
  'Banka Kartı': CreditCard,
  Nakit: Banknote,
  'Havale / EFT': Landmark,
}

const visitStatusPanelMap = {
  Bekliyor: {
    icon: AlertCircle,
    title: 'Muayene Bekliyor',
    description: 'Bu muayene dosyasındaki bilgiler henüz tamamlanmamış olabilir. Kayıt üzerinde devam edilebilir.',
    action: 'Muayeneye Devam Et',
    className: 'border-yellow-100 bg-yellow-50 text-yellow-800',
    button: 'primary',
  },
  Takipte: {
    icon: ClipboardPenLine,
    title: 'Tedavi Takipte',
    description: 'Tedavi takibi devam ediyor. Kontrol tarihi ve takip notları bu dosya üzerinden izlenebilir.',
    action: 'Tedavi Notu Ekle',
    className: 'border-orange-100 bg-orange-50 text-orange-700',
    button: 'outline',
  },
  Tamamlandı: {
    icon: CheckCircle2,
    title: 'Muayene Tamamlandı',
    description: 'Bu muayene dosyası tamamlanmış olarak görüntüleniyor. Bilgiler salt okunur akışta incelenebilir.',
    action: 'Muayeneyi Görüntüle',
    className: 'border-green-100 bg-green-50 text-green-700',
    button: 'outline',
  },
}

function VisitStatusPanel({ visit }) {
  const panel = visitStatusPanelMap[visit.status]
  if (!panel) return null

  const Icon = panel.icon
  const detail = visit.status === 'Takipte' ? `Kontrol tarihi: ${visit.overview.controlDate || 'Planlanmadı'}` : visit.status === 'Tamamlandı' ? `Tamamlanma/Güncelleme: ${visit.updatedAt}` : 'Muayene tamamlanmadan yeni boş kayıt oluşturulmaz.'

  return (
    <div className={`mb-5 flex flex-wrap items-center justify-between gap-3 rounded-[12px] border p-4 ${panel.className}`}>
      <div className="flex min-w-0 items-start gap-3">
        <Icon className="mt-0.5 shrink-0" size={19} />
        <div className="min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold">{panel.title}</h3>
            <StatusBadge status={visit.status} />
          </div>
          <p className="text-xs leading-5">{panel.description}</p>
          <p className="mt-1 text-[11px] font-semibold">{detail}</p>
        </div>
      </div>
      <button className={`${panel.button === 'primary' ? primaryButtonClass : outlineButtonClass} opacity-60`} disabled title="Bu işlem mevcut görüntüleme ekranından yapılmaz. Taslak veya bekleyen kayıt için Muayeneler sayfasındaki Devam Et kullanın." type="button">{panel.action}</button>
    </div>
  )
}

function OverviewTab({ visit }) {
  const overview = visit.overview
  const vitals = [
    ['Tansiyon', overview.vitals.bloodPressure],
    ['Nabız', overview.vitals.pulse],
    ['Ateş', overview.vitals.fever],
    ['Boy', overview.vitals.height],
    ['Kilo', overview.vitals.weight],
    ['Oksijen', overview.vitals.oxygen],
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3 max-[900px]:grid-cols-2 max-[430px]:grid-cols-1">
        {vitals.map(([label, value]) => <InfoBlock key={label} label={label} value={value} />)}
      </div>
      <div className="grid grid-cols-2 gap-3 max-[760px]:grid-cols-1">
        <InfoBlock label="Başvuru Şikâyeti" value={overview.complaint} />
        <InfoBlock label="Şikâyetin Başlama Tarihi" value={overview.complaintStartDate} />
        <InfoBlock label="Hastalık Öyküsü" value={overview.medicalHistory} />
        <InfoBlock label="Muayene Bulguları" value={overview.findings} />
        <InfoBlock label="Ön Tanı" value={overview.preliminaryDiagnosis} />
        <InfoBlock label="Kesin Tanı" value={overview.diagnosis} />
        <InfoBlock label="Uygulanan İşlem" value={overview.procedure} />
        <InfoBlock label="Tedavi Planı" value={overview.treatmentPlan} />
        <InfoBlock label="Kontrol Tarihi" value={overview.controlDate} />
        <InfoBlock label="Doktor Notu" value={overview.doctorNote} />
      </div>
    </div>
  )
}

function NotesTab({ visit }) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className={sectionHeadingClass}>Tedavi Notları</h3>
        <button className={`${outlineButtonClass} opacity-60`} disabled title="Mevcut muayeneye sonradan not ekleme henüz uygulanmadı. Yeni notlar muayene kaydı sırasında eklenir." type="button"><Plus size={16} />Yeni Not Ekle</button>
      </div>
      <div className="space-y-3">
        {visit.treatmentNotes.map((note) => (
          <article className="rounded-[12px] border border-gray-100 bg-gray-50 p-4" key={note.id}>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <strong className="text-xs text-gray-900">{note.title}</strong>
              <span className="text-[10px] font-semibold text-gray-500">{note.date} - {note.time}</span>
            </div>
            <p className="text-xs leading-relaxed text-gray-600">{note.content}</p>
            <p className="mt-3 text-[10px] text-gray-500">{note.author} tarafından oluşturuldu. Güncelleme: {note.updatedAt}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

function PrescriptionTab({ visit }) {
  if (!visit.prescription) return <div className="rounded-[12px] border border-dashed border-gray-200 p-6 text-center text-xs text-gray-500">Bu muayene kaydına ait reçete bulunmuyor.</div>

  return (
    <div>
      <div className="mb-4 grid grid-cols-4 gap-3 max-[760px]:grid-cols-2 max-[430px]:grid-cols-1">
        <InfoBlock label="Reçete No" value={visit.prescription.no} />
        <InfoBlock label="Reçete Tarihi" value={visit.prescription.date} />
        <InfoBlock label="Durum" value={visit.prescription.status} />
        <InfoBlock label="Doktor" value={visit.prescription.doctor} />
      </div>
      <div className="mb-4 overflow-x-auto">
        <table className="w-full min-w-[620px] border-collapse text-left">
          <thead><tr>{['İlaçlar', 'Doz', 'Kullanım Sıklığı', 'Süre', 'Açıklama'].map((head) => <th className="border-y border-gray-100 bg-gray-50 px-3 py-2 text-[10px] uppercase text-gray-500" key={head}>{head}</th>)}</tr></thead>
          <tbody>{visit.prescription.medicines.map((medicine) => <tr key={medicine.name}><td className="border-b border-gray-100 px-3 py-2 text-xs">{medicine.name}</td><td className="border-b border-gray-100 px-3 py-2 text-xs">{medicine.dose}</td><td className="border-b border-gray-100 px-3 py-2 text-xs">{medicine.frequency}</td><td className="border-b border-gray-100 px-3 py-2 text-xs">{medicine.duration}</td><td className="border-b border-gray-100 px-3 py-2 text-xs">{medicine.note}</td></tr>)}</tbody>
        </table>
      </div>
      <div className="flex flex-wrap gap-2">
        <button className={outlineButtonClass} type="button" onClick={() => window.print()}><Printer size={16} />Yazdır</button>
        <button className={`${outlineButtonClass} opacity-60`} disabled title="PDF indirme henüz uygulanmadı." type="button"><Download size={16} />PDF yok</button>
      </div>
    </div>
  )
}

function PaymentTab({ visit }) {
  const Icon = paymentIconMap[visit.payment.method] || CreditCard
  return (
    <div>
      <div className="mb-4 grid grid-cols-3 gap-3 max-[900px]:grid-cols-2 max-[430px]:grid-cols-1">
        {[
          ['Verilen Hizmet', visit.payment.service],
          ['Toplam Tutar', visit.payment.total],
          ['İndirim', visit.payment.discount],
          ['Ödenen', visit.payment.paid],
          ['Kalan', visit.payment.remaining],
          ['Ödeme Durumu', visit.payment.status],
          ['Ödeme Yöntemi', visit.payment.method],
          ['İşlem Tarihi', visit.payment.transactionDate],
          ['Makbuz No', visit.payment.receiptNo],
        ].map(([label, value]) => <InfoBlock key={label} label={label} value={value} />)}
      </div>
      {visit.payment.maskedCard && <div className="mb-4 flex items-center gap-2 rounded-[12px] border border-gray-100 bg-gray-50 p-3 text-xs text-gray-700"><Icon size={17} />Kart: {visit.payment.maskedCard}</div>}
      <h3 className="mb-3 text-sm font-bold text-gray-900">Ödeme Hareketleri</h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left">
          <thead><tr>{['Tarih', 'Tutar', 'Ödeme Yöntemi', 'Durum', 'Makbuz No'].map((head) => <th className="border-y border-gray-100 bg-gray-50 px-3 py-2 text-[10px] uppercase text-gray-500" key={head}>{head}</th>)}</tr></thead>
          <tbody>
            {visit.payment.movements.length === 0 && <tr><td className="px-3 py-4 text-center text-xs text-gray-500" colSpan={5}>Bu dosyaya ait ödeme hareketi bulunmuyor.</td></tr>}
            {visit.payment.movements.map((movement) => <tr key={movement.receiptNo}><td className="border-b border-gray-100 px-3 py-2 text-xs">{movement.date}</td><td className="border-b border-gray-100 px-3 py-2 text-xs">{movement.amount}</td><td className="border-b border-gray-100 px-3 py-2 text-xs">{movement.method}</td><td className="border-b border-gray-100 px-3 py-2 text-xs">{movement.status}</td><td className="border-b border-gray-100 px-3 py-2 text-xs">{movement.receiptNo}</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function DocumentsTab({ visit }) {
  if (visit.documents.length === 0) return <div className="rounded-[12px] border border-dashed border-gray-200 p-6 text-center text-xs text-gray-500">Bu muayene kaydına eklenmiş belge bulunmuyor.</div>
  return (
    <div className="grid grid-cols-2 gap-3 max-[760px]:grid-cols-1">
      {visit.documents.map((document) => (
        <article className="flex items-center gap-3 rounded-[12px] border border-gray-100 bg-gray-50 p-3" key={document.id}>
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] bg-orange-50 text-orange-600"><FileText size={18} /></div>
          <div className="min-w-0 flex-1">
            <strong className="block truncate text-xs text-gray-900">{document.name}</strong>
            <span className="mt-1 block text-[10px] text-gray-500">{document.type} - {document.size} - {document.uploadedAt}</span>
          </div>
          <a aria-label={`${document.name} görüntüle`} className={textButtonClass} href={document.url || documentViewUrl(document.id)} rel="noreferrer" target="_blank"><Eye size={15} /></a>
          <a aria-label={`${document.name} indir`} className={textButtonClass} href={document.downloadUrl || documentDownloadUrl(document.id)}><Download size={15} /></a>
        </article>
      ))}
    </div>
  )
}

export default function VisitDetails({ visit, activeTab, onTabChange }) {
  if (!visit) return null

  const content = {
    overview: <OverviewTab visit={visit} />,
    notes: <NotesTab visit={visit} />,
    prescription: <PrescriptionTab visit={visit} />,
    payment: <PaymentTab visit={visit} />,
    documents: <DocumentsTab visit={visit} />,
  }[activeTab]

  return (
    <section className={paddedCardClass}>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{visit.type}</h2>
          <p className="mt-1 text-xs text-gray-500">{visit.date}, {visit.time} - Dosya No: {visit.id}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={visit.status} />
          <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-bold text-gray-600">{visit.doctor}</span>
          <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-bold text-gray-600">Güncelleme: {visit.updatedAt}</span>
        </div>
      </div>
      <VisitStatusPanel visit={visit} />
      <VisitTabs activeTab={activeTab} onChange={onTabChange} />
      {content}
    </section>
  )
}
