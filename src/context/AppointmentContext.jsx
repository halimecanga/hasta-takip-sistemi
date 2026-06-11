import { createContext, useContext, useMemo, useState } from 'react'
import { appointments } from '../data/mockData'

const AppointmentContext = createContext(null)

const DOCTOR_NAME = 'Dr. Cumhur Kesemenli'
const ID_PREFIX = 'RND-2026-'

const nextAppointmentId = (appointmentItems) => {
  const numericIds = appointmentItems
    .map((item) => Number(item.id?.replace(ID_PREFIX, '')))
    .filter(Number.isFinite)

  const nextNumber = Math.max(0, ...numericIds) + 1
  return `${ID_PREFIX}${String(nextNumber).padStart(3, '0')}`
}

const cloneAppointment = (appointment) => ({ ...appointment })

const normalizeAppointment = (appointment, index) => {
  const type = appointment.type || appointment.department || 'Genel Muayene'

  return {
    id: appointment.id || `${ID_PREFIX}${String(index + 1).padStart(3, '0')}`,
    ...appointment,
    type,
    department: appointment.department || type,
    duration: appointment.duration || 30,
    priority: appointment.priority || 'Normal',
    reason: appointment.reason || type,
    complaint: appointment.complaint || '',
    phone: appointment.phone || '',
    email: appointment.email || '',
    doctor: appointment.doctor || DOCTOR_NAME,
    reminderMethod: appointment.reminderMethod || 'SMS',
    reminderTime: appointment.reminderTime || '1 gün önce',
    note: appointment.note || '',
  }
}

export function AppointmentProvider({ children }) {
  const [appointmentItems, setAppointmentItems] = useState(() => appointments.map(normalizeAppointment).map(cloneAppointment))

  const addAppointment = (appointment) => {
    const requestedIdAvailable = appointment.id && !appointmentItems.some((item) => item.id === appointment.id)
    const createdAppointment = {
      ...appointment,
      id: requestedIdAvailable ? appointment.id : nextAppointmentId(appointmentItems),
      department: appointment.department || appointment.type,
    }

    setAppointmentItems((current) => {
      return [...current, createdAppointment]
    })

    return createdAppointment
  }

  const updateAppointment = (nextAppointment) => {
    setAppointmentItems((current) => current.map((appointment) => (
      appointment.id === nextAppointment.id ? cloneAppointment(nextAppointment) : appointment
    )))
  }

  const updateAppointmentStatus = (id, status) => {
    setAppointmentItems((current) => current.map((appointment) => (
      appointment.id === id ? { ...appointment, status } : appointment
    )))
  }

  const getAppointmentById = (id) => appointmentItems.find((appointment) => appointment.id === id)

  const value = useMemo(() => ({
    addAppointment,
    appointmentItems,
    getAppointmentById,
    updateAppointment,
    updateAppointmentStatus,
  }), [appointmentItems])

  return <AppointmentContext.Provider value={value}>{children}</AppointmentContext.Provider>
}

export function useAppointments() {
  const context = useContext(AppointmentContext)
  if (!context) throw new Error('useAppointments must be used within AppointmentProvider')
  return context
}

export { DOCTOR_NAME, nextAppointmentId }
