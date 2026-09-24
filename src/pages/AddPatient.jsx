import { useState } from 'react'
import { ArrowLeft, Save, UserPlus, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import PageTitle from '../components/PageTitle'
import { patientsApi } from '../services/api'
import {
  formGridClass,
  formInputClass,
  formLabelClass,
  fullFieldClass,
  outlineButtonClass,
  paddedCardClass,
  primaryButtonClass,
} from '../styles/uiClasses'

const initialForm = {
  fullName: '',
  identityNumber: '',
  birthDate: '',
  gender: 'Kadın',
  phone: '',
  email: '',
  bloodType: '',
  allergy: '',
  chronicDisease: '',
  regularMedicine: '',
}

const bloodTypes = [
  'A Rh+',
  'A Rh-',
  'B Rh+',
  'B Rh-',
  'AB Rh+',
  'AB Rh-',
  '0 Rh+',
  '0 Rh-',
]

export default function AddPatient() {
  const navigate = useNavigate()

  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const updateForm = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))

    setError('')
  }

  const submitPatient = async (event) => {
    event.preventDefault()

    if (
      !form.fullName.trim() ||
      !form.identityNumber ||
      !form.birthDate ||
      !form.gender ||
      !form.phone.trim()
    ) {
      setError('Yıldızlı alanların doldurulması zorunludur.')
      return
    }

    if (!/^\d{11}$/.test(form.identityNumber)) {
      setError('TC kimlik numarası 11 rakamdan oluşmalıdır.')
      return
    }

    try {
      setIsSaving(true)
      setError('')

      const data = await patientsApi.create(form)

      navigate('/hastalar', {
        state: {
          message: data.message,
        },
      })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <PageTitle
        title="Yeni Hasta Ekle"
        subtitle="Kliniğe yeni hasta kaydı oluşturun."
        action={(
          <Link className={outlineButtonClass} to="/hastalar">
            <ArrowLeft size={18} />
            Listeye Dön
          </Link>
        )}
      />

      <div className="mb-4 inline-flex items-center gap-2 rounded-xl border border-orange-100 bg-orange-50 px-4 py-3 text-xs font-semibold text-orange-700">
        <UserPlus size={17} />
        Yeni kayıt aktif hasta olarak eklenir.
      </div>

      <form
        className={`${paddedCardClass} space-y-5`}
        onSubmit={submitPatient}
      >
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Hasta Bilgileri
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Hastanın kişisel ve temel sağlık bilgilerini girin.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <div className={formGridClass}>
          <label className={formLabelClass}>
            <span>
              Ad Soyad <span className="text-red-500">*</span>
            </span>

            <input
              className={formInputClass}
              placeholder="Örn. Selin Demir"
              required
              value={form.fullName}
              onChange={(event) =>
                updateForm('fullName', event.target.value)
              }
            />
          </label>

          <label className={formLabelClass}>
            <span>
              TC Kimlik <span className="text-red-500">*</span>
            </span>

            <input
              className={formInputClass}
              inputMode="numeric"
              maxLength={11}
              placeholder="11 haneli TC kimlik"
              required
              value={form.identityNumber}
              onChange={(event) =>
                updateForm(
                  'identityNumber',
                  event.target.value.replace(/\D/g, '')
                )
              }
            />
          </label>

          <label className={formLabelClass}>
            <span>
              Doğum Tarihi <span className="text-red-500">*</span>
            </span>

            <input
              className={formInputClass}
              required
              type="date"
              value={form.birthDate}
              onChange={(event) =>
                updateForm('birthDate', event.target.value)
              }
            />
          </label>

          <label className={formLabelClass}>
            <span>
              Cinsiyet <span className="text-red-500">*</span>
            </span>

            <select
              className={formInputClass}
              required
              value={form.gender}
              onChange={(event) =>
                updateForm('gender', event.target.value)
              }
            >
              <option value="Kadın">Kadın</option>
              <option value="Erkek">Erkek</option>
              <option value="Diğer">Diğer</option>
            </select>
          </label>

          <label className={formLabelClass}>
            <span>
              Telefon <span className="text-red-500">*</span>
            </span>

            <input
              className={formInputClass}
              placeholder="05xx xxx xx xx"
              required
              type="tel"
              value={form.phone}
              onChange={(event) =>
                updateForm('phone', event.target.value)
              }
            />
          </label>

          <label className={formLabelClass}>
            E-posta

            <input
              className={formInputClass}
              placeholder="hasta@example.com"
              type="email"
              value={form.email}
              onChange={(event) =>
                updateForm('email', event.target.value)
              }
            />
          </label>

          <label className={formLabelClass}>
            Kan Grubu

            <select
              className={formInputClass}
              value={form.bloodType}
              onChange={(event) =>
                updateForm('bloodType', event.target.value)
              }
            >
              <option value="">Seçiniz</option>

              {bloodTypes.map((bloodType) => (
                <option key={bloodType} value={bloodType}>
                  {bloodType}
                </option>
              ))}
            </select>
          </label>

          <label className={formLabelClass}>
            Alerji

            <input
              className={formInputClass}
              placeholder="Yok"
              value={form.allergy}
              onChange={(event) =>
                updateForm('allergy', event.target.value)
              }
            />
          </label>

          <label className={`${formLabelClass} ${fullFieldClass}`}>
            Kronik Hastalık

            <input
              className={formInputClass}
              placeholder="Yok"
              value={form.chronicDisease}
              onChange={(event) =>
                updateForm('chronicDisease', event.target.value)
              }
            />
          </label>

          <label className={`${formLabelClass} ${fullFieldClass}`}>
            Düzenli Kullanılan İlaç

            <input
              className={formInputClass}
              placeholder="Yok"
              value={form.regularMedicine}
              onChange={(event) =>
                updateForm('regularMedicine', event.target.value)
              }
            />
          </label>
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-gray-100 pt-4">
          <Link className={outlineButtonClass} to="/hastalar">
            <X size={17} />
            İptal
          </Link>

          <button
            className={primaryButtonClass}
            disabled={isSaving}
            type="submit"
          >
            <Save size={17} />
            {isSaving ? 'Kaydediliyor...' : 'Hastayı Kaydet'}
          </button>
        </div>
      </form>
    </>
  )
}