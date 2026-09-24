import { createContext } from 'react'

const StaffContext = createContext(null)

export function StaffProvider({ children }) {
  return <StaffContext.Provider value={null}>{children}</StaffContext.Provider>
}

export function useStaff() {
  throw new Error('Personeller artık PostgreSQL API üzerinden yönetiliyor. StaffContext kullanılmamalı.')
}
