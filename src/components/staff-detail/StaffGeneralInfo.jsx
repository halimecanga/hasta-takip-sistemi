import { Mail, Phone, ShieldCheck, UserRound } from 'lucide-react'
import { paddedCardClass } from '../../styles/uiClasses'

const Field = ({ label, value }) => (
  <div className="rounded-[12px] bg-gray-50 p-3">
    <dt className="text-[10px] font-semibold uppercase text-gray-400">{label}</dt>
    <dd className="mt-1 text-xs font-semibold text-gray-700">{value || '-'}</dd>
  </div>
)

export default function StaffGeneralInfo({ staff }) {
  return (
    <section className={paddedCardClass}>
      <div className="mb-4 flex items-center gap-2">
        <UserRound className="text-orange-500" size={18} />
        <h2 className="text-sm font-bold text-gray-900">Genel Bilgiler</h2>
      </div>
      <dl className="grid grid-cols-3 gap-3 max-[980px]:grid-cols-2 max-[640px]:grid-cols-1">
        <Field label="Ad Soyad" value={staff.name} />
        <Field label="Personel No" value={staff.id} />
        <Field label="Rol" value={staff.role} />
        <Field label="Departman" value={staff.department} />
        <Field label="Durum" value={staff.status} />
        <Field label="Doğum Tarihi" value={staff.birthDate} />
        <Field label="Telefon" value={staff.phone} />
        <Field label="E-posta" value={staff.email} />
        <Field label="İşe Başlama" value={staff.hireDate} />
        <Field label="Çalışma Şekli" value={staff.workType} />
        <Field label="Çalışma Günleri" value={staff.workDays} />
        <Field label="Çalışma Saatleri" value={`${staff.workHours.start} - ${staff.workHours.end}`} />
      </dl>
      <div className="mt-3 grid grid-cols-2 gap-3 max-[760px]:grid-cols-1">
        <div className="rounded-[12px] bg-gray-50 p-3">
          <div className="mb-2 flex items-center gap-2 text-[11px] font-bold text-gray-700">
            <ShieldCheck className="text-orange-500" size={16} />
            Acil Durum Kişisi
          </div>
          <p className="text-xs text-gray-600">{staff.emergencyContact.name}</p>
          <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-gray-500"><Phone size={14} />{staff.emergencyContact.phone}</p>
        </div>
        <div className="rounded-[12px] bg-gray-50 p-3">
          <div className="mb-2 flex items-center gap-2 text-[11px] font-bold text-gray-700">
            <Mail className="text-orange-500" size={16} />
            İletişim ve Not
          </div>
          <p className="text-xs text-gray-600">{staff.address}</p>
          <p className="mt-2 text-xs text-gray-500">{staff.note || 'Personel notu bulunmuyor.'}</p>
        </div>
      </div>
    </section>
  )
}
