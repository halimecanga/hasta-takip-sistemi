import { createContext, useContext, useMemo, useState } from 'react'
import { staffDetails } from '../data/staffDetailsMock'

const StaffContext = createContext(null)

const cloneStaff = (staff) => ({
  ...staff,
  workHours: { ...staff.workHours },
  emergencyContact: { ...staff.emergencyContact },
  quickStats: staff.quickStats.map((stat) => ({ ...stat })),
  roleDetails: {
    ...staff.roleDetails,
    items: staff.roleDetails.items.map((item) => ({ ...item })),
  },
  leaveSummary: { ...staff.leaveSummary },
  leaves: staff.leaves.map((leave) => ({ ...leave })),
  activities: staff.activities.map((activity) => ({ ...activity })),
  documents: staff.documents.map((document) => ({ ...document })),
  schedule: staff.schedule.map((item) => ({ ...item })),
})

const roleLabels = {
  doctor: 'Doktor / Yönetici',
  nurse: 'Hemşire',
  secretary: 'Tıbbi Sekreter',
  advisor: 'Hasta Danışmanı',
  accounting: 'Muhasebe Sorumlusu',
  support: 'Destek Personeli',
}

const roleDetailTitles = {
  doctor: 'Doktor Bilgileri',
  nurse: 'Hemşire Bilgileri',
  secretary: 'Tıbbi Sekreter Bilgileri',
  advisor: 'Hasta Danışmanı Bilgileri',
  accounting: 'Muhasebe Bilgileri',
  support: 'Destek Hizmetleri Bilgileri',
}

const buildInitials = (name) => name
  .trim()
  .split(/\s+/)
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0]?.toLocaleUpperCase('tr-TR') || '')
  .join('')

const buildSchedule = (workDays, workHours, department) => {
  const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma']
  return days.map((day) => ({
    day,
    shift: `${workHours.start} - ${workHours.end}`,
    location: department || 'Ana Klinik',
    status: workDays.toLocaleLowerCase('tr-TR').includes(day.toLocaleLowerCase('tr-TR')) || workDays.includes('-')
      ? 'Planlandı'
      : 'Planlandı',
  }))
}

const nextStaffId = (staffItems) => {
  const nextNumber = staffItems.reduce((max, staff) => {
    const number = Number.parseInt(staff.id.replace('PRS-', ''), 10)
    return Number.isNaN(number) ? max : Math.max(max, number)
  }, 0) + 1

  return `PRS-${String(nextNumber).padStart(3, '0')}`
}

const createStaffRecord = (form, staffItems) => {
  const id = nextStaffId(staffItems)
  const role = roleLabels[form.roleType] || form.role
  const workHours = { start: form.startTime, end: form.endTime }

  return {
    id,
    name: form.name.trim(),
    initials: buildInitials(form.name),
    role,
    roleType: form.roleType,
    department: form.department.trim(),
    status: 'Aktif',
    phone: form.phone.trim(),
    email: form.email.trim(),
    birthDate: form.birthDate.trim() || 'Belirtilmedi',
    hireDate: form.hireDate.trim() || 'Belirtilmedi',
    workType: form.workType,
    workDays: form.workDays.trim(),
    workHours,
    address: form.address.trim() || 'Adres bilgisi eklenmedi.',
    emergencyContact: {
      name: form.emergencyName.trim() || 'Belirtilmedi',
      phone: form.emergencyPhone.trim() || 'Belirtilmedi',
    },
    note: form.note.trim(),
    quickStats: [
      { label: 'Aylık Vardiya', value: '0', meta: 'Yeni kayıt' },
      { label: 'Sorumlu Hasta', value: '0', meta: 'Atanmadı' },
      { label: 'Kalan İzin', value: '20 gün', meta: 'Yıllık' },
      { label: 'Son Aktivite', value: 'Kayıt açıldı', meta: 'Bugün' },
    ],
    roleDetails: {
      title: roleDetailTitles[form.roleType] || 'Personel Bilgileri',
      items: [
        { label: 'Sorumlu Alan', value: form.department.trim() },
        { label: 'Çalışma Şekli', value: form.workType },
        { label: 'Yetkinlik', value: form.roleNote.trim() || 'Henüz eklenmedi' },
        { label: 'Durum', value: 'Yeni personel kaydı' },
      ],
    },
    leaveSummary: { annual: 20, used: 0, remaining: 20, report: 0 },
    leaves: [],
    activities: [
      {
        id: `ACT-${id.replace('PRS-', '')}-001`,
        date: '05 Haz 2026',
        time: 'Yeni kayıt',
        title: 'Personel kaydı oluşturuldu',
        description: `${form.name.trim()} için frontend state içinde yeni personel kaydı açıldı.`,
      },
    ],
    documents: [],
    schedule: buildSchedule(form.workDays.trim(), workHours, form.department.trim()),
  }
}

export function StaffProvider({ children }) {
  const [staffItems, setStaffItems] = useState(() => staffDetails.map(cloneStaff))

  const hasDoctor = useMemo(() => staffItems.some((staff) => staff.roleType === 'doctor'), [staffItems])

  const addStaff = (form) => {
    if (form.roleType === 'doctor' && hasDoctor) {
      return { ok: false, message: 'Sistemde yalnızca bir doktor kaydı bulunabilir.' }
    }

    let createdStaff
    setStaffItems((current) => {
      createdStaff = createStaffRecord(form, current)
      return [...current, createdStaff]
    })

    return { ok: true, staff: createdStaff }
  }

  const updateStaff = (nextStaff) => {
    setStaffItems((current) => current.map((staff) => (
      staff.id === nextStaff.id ? cloneStaff(nextStaff) : staff
    )))
  }

  const updateStaffStatus = (id, status) => {
    setStaffItems((current) => current.map((staff) => (
      staff.id === id ? { ...staff, status } : staff
    )))
  }

  const getStaffById = (id) => staffItems.find((staff) => staff.id === id)

  const value = useMemo(() => ({
    addStaff,
    getStaffById,
    hasDoctor,
    staffItems,
    updateStaff,
    updateStaffStatus,
  }), [hasDoctor, staffItems])

  return <StaffContext.Provider value={value}>{children}</StaffContext.Provider>
}

export function useStaff() {
  const context = useContext(StaffContext)
  if (!context) throw new Error('useStaff must be used within StaffProvider')
  return context
}
