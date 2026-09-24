import { createContext } from 'react'

const AppointmentContext = createContext(null)

export function AppointmentProvider({ children }) {
  return <AppointmentContext.Provider value={null}>{children}</AppointmentContext.Provider>
}

export function useAppointments() {
  throw new Error('Randevular artık PostgreSQL API üzerinden yönetiliyor. AppointmentContext kullanılmamalı.')
}
