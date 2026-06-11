import { BookOpen, ChevronDown, Headphones, Mail, MessageSquareText, Phone, Send } from 'lucide-react'
import PageTitle from '../components/PageTitle'
import {
  cardClass,
  formInputClass,
  formLabelClass,
  linkButtonClass,
  mutedSmallTextClass,
  paddedCardClass,
  primaryButtonClass,
  sectionHeadingClass,
  sectionTitleClass,
  singleColumnFormGridClass,
  textareaClass,
} from '../styles/uiClasses'

const faqs = ['Yeni hasta kaydı nasıl oluşturulur?', 'Randevu durumu nasıl güncellenir?', 'Raporları dışa aktarabilir miyim?', 'Kullanıcı yetkileri nasıl değiştirilir?']

export default function Support() {
  return (
    <>
      <PageTitle title="Destek" subtitle="Sorularınız için yardım alın ve destek ekibimize ulaşın." />
      <div className="mb-5 grid grid-cols-3 gap-[18px] max-[900px]:grid-cols-1"><article className={`${cardClass} flex items-center gap-[13px] p-[17px]`}><BookOpen className="shrink-0 text-orange-500" size={24} /><div className="flex-1"><h3 className={sectionHeadingClass}>Kullanım Kılavuzu</h3><p className="mt-[5px] text-[10px] leading-normal text-gray-500">Panel özelliklerini adım adım keşfedin.</p></div><button className={linkButtonClass} type="button">Kılavuzu Aç</button></article><article className={`${cardClass} flex items-center gap-[13px] p-[17px]`}><MessageSquareText className="shrink-0 text-orange-500" size={24} /><div className="flex-1"><h3 className={sectionHeadingClass}>Canlı Destek</h3><p className="mt-[5px] text-[10px] leading-normal text-gray-500">Uzman ekibimizle hızlıca görüşün.</p></div><button className={linkButtonClass} type="button">Görüşme Başlat</button></article><article className={`${cardClass} flex items-center gap-[13px] p-[17px]`}><Headphones className="shrink-0 text-orange-500" size={24} /><div className="flex-1"><h3 className={sectionHeadingClass}>Destek Merkezi</h3><p className="mt-[5px] text-[10px] leading-normal text-gray-500">Sık karşılaşılan sorunların çözümleri.</p></div><button className={linkButtonClass} type="button">Merkezi İncele</button></article></div>
      <div className="grid grid-cols-2 gap-5 max-[900px]:grid-cols-1">
        <section className={`${paddedCardClass} min-w-0`}><div className={sectionTitleClass}><MessageSquareText size={20} /><div><h3 className={sectionHeadingClass}>Sık Sorulan Sorular</h3><p className={mutedSmallTextClass}>Merak edilen konulara hızlı yanıtlar</p></div></div><div className="flex flex-col gap-2">{faqs.map((faq) => <button className="flex items-center justify-between rounded-[10px] border border-[#f1f3f5] bg-gray-50 p-3 text-left text-[11px] text-gray-700 hover:border-orange-200 hover:bg-[#fffaf5]" key={faq} type="button">{faq}<ChevronDown size={18} /></button>)}</div></section>
        <section className={`${paddedCardClass} min-w-0`}><div className={sectionTitleClass}><Send size={20} /><div><h3 className={sectionHeadingClass}>Destek Talebi Oluştur</h3><p className={mutedSmallTextClass}>Ekibimize detaylı bir mesaj iletin</p></div></div><div className={singleColumnFormGridClass}><label className={formLabelClass}>Konu<input className={formInputClass} placeholder="Talebinizin konusu" /></label><label className={formLabelClass}>Kategori<select className={formInputClass} defaultValue=""><option value="">Kategori seçin</option><option>Teknik Sorun</option><option>Hesap ve Yetki</option><option>Öneri</option></select></label><label className={formLabelClass}>Mesaj<textarea className={textareaClass} placeholder="Talebinizi detaylı olarak açıklayın..." /></label></div><button className={`${primaryButtonClass} mt-4`} type="button"><Send size={18} />Talebi Gönder</button></section>
        <section className={`${paddedCardClass} col-span-full max-[900px]:col-auto`}><h3 className={sectionHeadingClass}>İletişim Bilgileri</h3><p className="mt-[5px] text-[10px] leading-normal text-gray-500">Hafta içi 09:00 - 18:00 saatleri arasında bize ulaşabilirsiniz.</p><div className="mt-3.5 flex gap-6 max-[640px]:flex-col max-[640px]:gap-2.5"><span className="flex items-center gap-2 text-[11px] text-orange-600"><Phone size={18} /><strong>0850 555 24 24</strong></span><span className="flex items-center gap-2 text-[11px] text-orange-600"><Mail size={18} /><strong>destek@klinik.com</strong></span></div></section>
      </div>
    </>
  )
}
