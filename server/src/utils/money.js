export const toMoney = (value) => {
  const number = Number(value)
  if (!Number.isFinite(number)) return 0
  return Math.round(Math.max(0, number) * 100) / 100
}

export const formatCurrency = (value) =>
  `₺${toMoney(value).toLocaleString('tr-TR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`

export const calculatePayment = ({ total, discount, paid }) => {
  const totalAmount = toMoney(total)
  const discountAmount = toMoney(discount)
  const payable = Math.max(totalAmount - discountAmount, 0)
  const paidAmount = Math.min(toMoney(paid), payable)
  const remaining = Math.max(payable - paidAmount, 0)
  const status = remaining === 0 ? 'Ödendi' : paidAmount > 0 ? 'Kısmi Ödeme' : 'Ödeme Bekliyor'

  return {
    totalAmount,
    discountAmount,
    payable,
    paidAmount,
    remaining,
    status,
  }
}
