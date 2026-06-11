import { Save, X } from 'lucide-react'
import { useState } from 'react'
import { formGridClass, formInputClass, formLabelClass, outlineButtonClass, paddedCardClass, primaryButtonClass, textareaClass } from '../../styles/uiClasses'

const categories = ['Muayene', 'Laboratuvar', 'Görüntüleme', 'Uygulama', 'Kontrol', 'Diğer']
const vatRates = [0, 1, 10, 20]
const statuses = ['Aktif', 'Pasif']

const FieldError = ({ id, message }) => message ? <span className="mt-1 text-[10px] font-semibold text-red-600" id={id}>{message}</span> : null

const clonePrice = (price) => ({
  ...price,
  price: String(price.price),
  vatRate: String(price.vatRate),
  minimumPrice: String(price.minimumPrice),
  duration: String(price.duration),
})

const toNumber = (value) => value === '' ? NaN : Number(value)

export default function PriceEditForm({ price, onCancel, onSave }) {
  const [form, setForm] = useState(() => clonePrice(price))
  const [errors, setErrors] = useState({})

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: '' }))
  }

  const validate = () => {
    const nextErrors = {}
    const priceNumber = toNumber(form.price)
    const minimumPriceNumber = toNumber(form.minimumPrice)
    const durationNumber = toNumber(form.duration)

    if (!form.name.trim()) nextErrors.name = 'İşlem adı zorunludur.'
    if (!form.category) nextErrors.category = 'Kategori seçmelisiniz.'
    if (Number.isNaN(priceNumber)) nextErrors.price = 'Geçerli bir ücret giriniz.'
    else if (priceNumber < 0) nextErrors.price = 'Ücret negatif olamaz.'
    if (!form.description.trim()) nextErrors.description = 'Açıklama zorunludur.'
    if (!form.status) nextErrors.status = 'Durum seçmelisiniz.'
    if (Number.isNaN(minimumPriceNumber)) nextErrors.minimumPrice = 'Geçerli bir minimum ücret giriniz.'
    else if (minimumPriceNumber < 0) nextErrors.minimumPrice = 'Minimum ücret negatif olamaz.'
    else if (!Number.isNaN(priceNumber) && minimumPriceNumber > priceNumber) nextErrors.minimumPrice = 'Minimum ücret, güncel ücretten büyük olamaz.'
    if (Number.isNaN(durationNumber)) nextErrors.duration = 'Geçerli bir ortalama işlem süresi giriniz.'
    else if (durationNumber < 0) nextErrors.duration = 'Ortalama işlem süresi negatif olamaz.'

    setErrors(nextErrors)
    const firstError = Object.keys(nextErrors)[0]
    if (firstError) document.getElementById(`price-${firstError}`)?.focus()
    return Object.keys(nextErrors).length === 0
  }

  const submit = (event) => {
    event.preventDefault()
    if (!validate()) return

    onSave({
      ...form,
      name: form.name.trim(),
      price: Number(form.price),
      vatRate: Number(form.vatRate),
      minimumPrice: Number(form.minimumPrice),
      duration: Number(form.duration),
      description: form.description.trim(),
      usageArea: form.usageArea.trim(),
      internalNote: form.internalNote.trim(),
      updatedAt: '05 Haziran 2026',
    })
  }

  const inputProps = (key) => ({
    'aria-describedby': errors[key] ? `price-${key}-error` : undefined,
    'aria-invalid': Boolean(errors[key]),
    id: `price-${key}`,
    value: form[key],
    onChange: (event) => update(key, event.target.value),
  })

  const checkboxProps = (key) => ({
    checked: form[key],
    id: `price-${key}`,
    onChange: (event) => update(key, event.target.checked),
  })

  return (
    <form className={`${paddedCardClass} space-y-5`} onSubmit={submit}>
      <div>
        <h2 className="text-lg font-bold text-gray-900">Fiyat Kaydını Düzenle</h2>
        <p className="mt-1 text-xs text-gray-500">Değişiklikler yalnızca bu sayfanın frontend state’i içinde saklanır.</p>
      </div>
      <div className={formGridClass}>
        <label className={formLabelClass} htmlFor="price-id">
          İşlem kodu
          <input className={`${formInputClass} bg-gray-50`} id="price-id" readOnly value={form.id} />
        </label>
        <label className={formLabelClass} htmlFor="price-name">
          <span>İşlem adı <span className="text-red-500">*</span></span>
          <input className={formInputClass} {...inputProps('name')} />
          <FieldError id="price-name-error" message={errors.name} />
        </label>
        <label className={formLabelClass} htmlFor="price-category">
          <span>Kategori <span className="text-red-500">*</span></span>
          <select className={formInputClass} {...inputProps('category')}>
            <option value="">Kategori seçin</option>
            {categories.map((category) => <option key={category}>{category}</option>)}
          </select>
          <FieldError id="price-category-error" message={errors.category} />
        </label>
        <label className={formLabelClass} htmlFor="price-status">
          <span>Durum <span className="text-red-500">*</span></span>
          <select className={formInputClass} {...inputProps('status')}>
            <option value="">Durum seçin</option>
            {statuses.map((status) => <option key={status}>{status}</option>)}
          </select>
          <FieldError id="price-status-error" message={errors.status} />
        </label>
        <label className={formLabelClass} htmlFor="price-price">
          <span>Ücret <span className="text-red-500">*</span></span>
          <input className={formInputClass} min="0" type="number" {...inputProps('price')} />
          <FieldError id="price-price-error" message={errors.price} />
        </label>
        <label className={formLabelClass} htmlFor="price-minimumPrice">
          Minimum ücret
          <input className={formInputClass} min="0" type="number" {...inputProps('minimumPrice')} />
          <FieldError id="price-minimumPrice-error" message={errors.minimumPrice} />
        </label>
        <label className={formLabelClass} htmlFor="price-vatRate">
          KDV oranı
          <select className={formInputClass} {...inputProps('vatRate')}>
            {vatRates.map((rate) => <option key={rate} value={rate}>%{rate}</option>)}
          </select>
        </label>
        <label className={formLabelClass} htmlFor="price-duration">
          Ortalama işlem süresi
          <input className={formInputClass} min="0" type="number" {...inputProps('duration')} />
          <FieldError id="price-duration-error" message={errors.duration} />
        </label>
        <label className={formLabelClass} htmlFor="price-usageArea">
          Kullanım alanı
          <input className={formInputClass} {...inputProps('usageArea')} />
        </label>
        <label className="col-span-full flex flex-col gap-[7px] text-[11px] font-semibold text-gray-600 max-[640px]:col-auto" htmlFor="price-description">
          <span>Açıklama <span className="text-red-500">*</span></span>
          <textarea className={textareaClass} {...inputProps('description')} />
          <FieldError id="price-description-error" message={errors.description} />
        </label>
        <label className="col-span-full flex flex-col gap-[7px] text-[11px] font-semibold text-gray-600 max-[640px]:col-auto" htmlFor="price-internalNote">
          İç not
          <textarea className={textareaClass} {...inputProps('internalNote')} />
        </label>
      </div>

      <div className="grid grid-cols-4 gap-3 max-[980px]:grid-cols-2 max-[640px]:grid-cols-1">
        {[
          ['vatIncluded', 'KDV dahil mi?'],
          ['discountAllowed', 'İndirim uygulanabilir mi?'],
          ['patientVisible', 'Hasta için görünür mü?'],
          ['includedInInvoice', 'Faturaya dahil edilir mi?'],
        ].map(([key, label]) => (
          <label className="flex items-center gap-3 rounded-[12px] border border-gray-100 bg-gray-50 p-3 text-xs font-semibold text-gray-700 focus-within:ring-2 focus-within:ring-orange-300 focus-within:ring-offset-2" htmlFor={`price-${key}`} key={key}>
            <input className="h-4 w-4 accent-orange-500" type="checkbox" {...checkboxProps(key)} />
            {label}
          </label>
        ))}
      </div>

      <div className="flex flex-wrap justify-end gap-2 border-t border-gray-100 pt-4 max-[640px]:justify-start">
        <button className={outlineButtonClass} type="button" onClick={onCancel}><X size={17} />İptal</button>
        <button className={primaryButtonClass} type="submit"><Save size={17} />Değişiklikleri Kaydet</button>
      </div>
    </form>
  )
}
