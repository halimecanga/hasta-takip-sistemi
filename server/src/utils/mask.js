export const maskIdentity = (identityNumber) => {
  const value = String(identityNumber || '')
  if (value.length < 4) return '***********'
  return `${value.slice(0, 2)}*******${value.slice(-2)}`
}

export const maskCard = (lastFour) => {
  const digits = String(lastFour || '').replace(/\D/g, '').slice(-4)
  return digits ? `**** **** **** ${digits}` : ''
}

export const sanitizeCardLastFour = (value) => {
  const digits = String(value || '').replace(/\D/g, '').slice(-4)
  return digits.length === 4 ? digits : ''
}
