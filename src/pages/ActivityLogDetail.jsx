import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Clock3, FileText, MonitorSmartphone, UserRound } from 'lucide-react'
import PageTitle from '../components/PageTitle'
import { logsApi } from '../services/api'
import { outlineButtonClass, paddedCardClass, primaryButtonClass } from '../styles/uiClasses'

const statusClasses = {
  Başarılı: 'bg-green-50 text-green-700 border-green-100',
  Hata: 'bg-red-50 text-red-700 border-red-100',
  Uyarı: 'bg-orange-50 text-orange-700 border-orange-100',
}

const severityClasses = {
  Bilgi: 'bg-slate-50 text-slate-700 border-slate-100',
  Uyarı: 'bg-orange-50 text-orange-700 border-orange-100',
  Kritik: 'bg-red-50 text-red-700 border-red-100',
}

function Badge({ children, className }) {
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold ${className}`}>{children}</span>
}

function DetailRow({ label, value }) {
  return (
    <div className="rounded-[12px] bg-gray-50 px-3 py-2.5">
      <p className="text-[10px] font-bold uppercase text-gray-400">{label}</p>
      <p className="mt-1 break-words text-xs font-semibold text-gray-800">{value || '-'}</p>
    </div>
  )
}

function EmptyState() {
  return (
    <>
      <PageTitle title="İşlem Kaydı" subtitle="Sistem hareketi detayını inceleyin." />
      <section className={`${paddedCardClass} text-center`}>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-orange-500">
          <FileText size={22} />
        </div>
        <h2 className="mt-4 text-base font-bold text-gray-900">İşlem kaydı bulunamadı</h2>
        <p className="mt-2 text-sm text-gray-500">Aradığınız sistem hareketi mevcut değil.</p>
        <Link className={`${primaryButtonClass} mt-5`} to="/islem-kayitlari">
          <ArrowLeft size={16} />
          İşlem Kayıtlarına Dön
        </Link>
      </section>
    </>
  )
}

export default function ActivityLogDetail() {
  const { id } = useParams()
  const [log, setLog] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    logsApi.detail(id)
      .then(setLog)
      .catch(() => setLog(null))
      .finally(() => setIsLoading(false))
  }, [id])

  if (isLoading) return <section className={`${paddedCardClass} py-16 text-center text-sm text-gray-500`}>İşlem kaydı yükleniyor...</section>
  if (!log) return <EmptyState />

  const hasStaffProfile = Boolean(log.staffId)
  const targetState = { from: '/islem-kayitlari', fromLabel: 'İşlem Kayıtları' }

  return (
    <>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <Link className={outlineButtonClass} to="/islem-kayitlari">
            <ArrowLeft size={16} />
            İşlem Kayıtlarına Dön
          </Link>
          <div className="mt-4">
            <p className="text-xs font-bold uppercase tracking-[.35px] text-orange-500">İşlem Detayı</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <h1 className="m-0 text-2xl font-bold text-gray-900 max-[640px]:text-xl">{log.id}</h1>
              <Badge className={statusClasses[log.status] || statusClasses.Başarılı}>{log.status}</Badge>
              <Badge className={severityClasses[log.severity] || severityClasses.Bilgi}>{log.severity}</Badge>
            </div>
          </div>
        </div>
        {log.targetRoute && (
          <Link className={primaryButtonClass} state={targetState} to={log.targetRoute}>
            <FileText size={16} />
            İlgili Kayda Git
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 gap-5 max-[980px]:grid-cols-1">
        <section className={paddedCardClass}>
          <div className="mb-4 flex items-center gap-2">
            <UserRound className="text-orange-500" size={18} />
            <h2 className="text-sm font-bold text-gray-900">Kullanıcı Bilgileri</h2>
          </div>
          <div className="grid gap-3">
            <DetailRow label="Kullanıcı" value={log.user} />
            <DetailRow label="Rol" value={log.role} />
            <DetailRow label="Personel No" value={log.staffId || 'Sistem kaydı'} />
          </div>
          {hasStaffProfile && (
            <Link className={`${outlineButtonClass} mt-4`} to={`/personeller/${log.staffId}`}>
              <UserRound size={16} />
              Personel Profiline Git
            </Link>
          )}
        </section>

        <section className={paddedCardClass}>
          <div className="mb-4 flex items-center gap-2">
            <FileText className="text-orange-500" size={18} />
            <h2 className="text-sm font-bold text-gray-900">İşlem Bilgileri</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 max-[520px]:grid-cols-1">
            <DetailRow label="İşlem" value={log.action} />
            <DetailRow label="Sayfa" value={log.page} />
            <DetailRow label="Modül" value={log.module} />
            <DetailRow label="Hedef Türü" value={log.targetType} />
            <DetailRow label="Hedef No" value={log.targetId} />
            <DetailRow label="Hedef Kayıt" value={log.targetName} />
          </div>
          <p className="mt-3 rounded-[12px] bg-orange-50 px-3 py-3 text-xs leading-5 text-orange-800">{log.description}</p>
        </section>

        <section className={paddedCardClass}>
          <div className="mb-4 flex items-center gap-2">
            <Clock3 className="text-orange-500" size={18} />
            <h2 className="text-sm font-bold text-gray-900">Zaman ve Cihaz</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 max-[520px]:grid-cols-1">
            <DetailRow label="Tarih" value={log.date} />
            <DetailRow label="Saat" value={log.time} />
            <DetailRow label="ISO Tarih" value={log.dateIso} />
            <DetailRow label="Süre" value={log.duration} />
            <DetailRow label="IP Adresi" value={log.ipAddress} />
            <DetailRow label="Cihaz" value={log.device} />
          </div>
        </section>

        <section className={paddedCardClass}>
          <div className="mb-4 flex items-center gap-2">
            <MonitorSmartphone className="text-orange-500" size={18} />
            <h2 className="text-sm font-bold text-gray-900">Teknik Detaylar</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 max-[520px]:grid-cols-1">
            <DetailRow label="Event Code" value={log.eventCode} />
            <DetailRow label="Request ID" value={log.requestId} />
            <DetailRow label="Session ID" value={log.sessionId} />
            <DetailRow label="Durum" value={log.status} />
          </div>
          <div className={`mt-3 rounded-[12px] border px-3 py-3 text-xs leading-5 ${log.errorMessage ? 'border-red-100 bg-red-50 text-red-700' : 'border-gray-100 bg-gray-50 text-gray-500'}`}>
            {log.errorMessage || 'Hata mesajı yok.'}
          </div>
        </section>

        <section className={`${paddedCardClass} col-span-2 max-[980px]:col-span-1`}>
          <div className="mb-4 flex items-center gap-2">
            <FileText className="text-orange-500" size={18} />
            <h2 className="text-sm font-bold text-gray-900">İlgili Kayıt</h2>
          </div>
          <div className="grid grid-cols-3 gap-3 max-[760px]:grid-cols-1">
            <DetailRow label="Kayıt Türü" value={log.targetType} />
            <DetailRow label="Kayıt No" value={log.targetId} />
            <DetailRow label="Kayıt Adı" value={log.targetName} />
          </div>
          {log.targetRoute && (
            <Link className={`${outlineButtonClass} mt-4`} state={targetState} to={log.targetRoute}>
              <FileText size={16} />
              İlgili Kayda Git
            </Link>
          )}
        </section>
      </div>
    </>
  )
}
