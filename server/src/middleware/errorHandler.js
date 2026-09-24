import { HttpError } from '../utils/errors.js'

export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    next(error)
    return
  }

  if (error instanceof HttpError) {
    res.status(error.status).json({
      status: 'error',
      message: error.message,
    })
    return
  }

  if (error.code === '23505') {
    res.status(409).json({
      status: 'error',
      message: 'Bu kayıt zaten mevcut.',
    })
    return
  }

  if (error.code === '23514') {
    res.status(400).json({
      status: 'error',
      message: 'Gönderilen durum veya alan değeri geçersiz.',
    })
    return
  }

  if (error.code === '22007' || error.code === '22P02') {
    res.status(400).json({
      status: 'error',
      message: 'Tarih, saat veya sayı formatı geçersiz.',
    })
    return
  }

  console.error(error)

  res.status(500).json({
    status: 'error',
    message: 'Beklenmeyen bir sunucu hatası oluştu.',
  })
}
