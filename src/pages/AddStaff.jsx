import { ArrowLeft, UserPlus } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import AddStaffForm from '../components/staff-add/AddStaffForm'
import PageTitle from '../components/PageTitle'
import { useStaff } from '../context/StaffContext'
import { outlineButtonClass } from '../styles/uiClasses'

export default function AddStaff() {
  const navigate = useNavigate()
  const { addStaff, hasDoctor } = useStaff()

  const saveStaff = (form) => {
    const result = addStaff(form)
    if (result.ok) {
      navigate('/personeller', {
        state: { message: `${result.staff.name} personel listesine eklendi.` },
      })
    }

    return result
  }

  return (
    <>
      <PageTitle
        title="Personel Ekle"
        subtitle="Klinik ekibine yeni personel kaydı oluşturun."
        action={(
          <Link className={outlineButtonClass} to="/personeller">
            <ArrowLeft size={18} />
            Listeye Dön
          </Link>
        )}
      />
      <div className="mb-4 inline-flex items-center gap-2 rounded-xl border border-orange-100 bg-orange-50 px-4 py-3 text-xs font-semibold text-orange-700">
        <UserPlus size={17} />
        Yeni kayıt aktif personel olarak eklenir.
      </div>
      <AddStaffForm hasDoctor={hasDoctor} onSubmit={saveStaff} />
    </>
  )
}
