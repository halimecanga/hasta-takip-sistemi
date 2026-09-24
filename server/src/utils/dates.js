const shortMonths = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']

export const formatDisplayDate = (value) => {
  if (!value) return null
  const iso = String(value).slice(0, 10)
  const [year, month, day] = iso.split('-').map(Number)
  if (!year || !month || !day) return String(value)
  return `${String(day).padStart(2, '0')} ${shortMonths[month - 1]} ${year}`
}

export const formatLongDate = (value) => {
  if (!value) return null
  const iso = String(value).slice(0, 10)
  const [year, month, day] = iso.split('-').map(Number)
  if (!year || !month || !day) return String(value)
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month - 1, day))
}

export const timeToMinutes = (time) => {
  const [hour, minute] = String(time).split(':').map(Number)
  return hour * 60 + minute
}

export const getWeekday = (dateIso) => {
  const [year, month, day] = String(dateIso).slice(0, 10).split('-').map(Number)
  return new Date(year, month - 1, day).getDay()
}

export const overlaps = (start, end, existingStart, existingEnd) =>
  start < existingEnd && end > existingStart
