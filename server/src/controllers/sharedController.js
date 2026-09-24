import { actorFromRequest } from '../utils/audit.js'
import { asyncHandler } from '../utils/errors.js'
import * as appointments from '../services/appointmentsService.js'
import * as examinations from '../services/examinationsService.js'
import * as prescriptions from '../services/prescriptionsService.js'
import * as tests from '../services/testsService.js'
import * as staff from '../services/staffService.js'
import * as prices from '../services/pricesService.js'
import * as logs from '../services/logsService.js'
import * as dashboard from '../services/dashboardService.js'
import * as reports from '../services/reportsService.js'
import * as settings from '../services/settingsService.js'
import * as uploads from '../services/uploadsService.js'
import pool from '../db/index.js'
import { HttpError } from '../utils/errors.js'

const ownerLookup = {
  examination: ['examinations', 'examination_no'],
  test: ['medical_tests', 'test_no'],
  staff: ['staff', 'staff_no'],
  prescription: ['prescriptions', 'prescription_no'],
}

export const appointmentsList = asyncHandler(async (req, res) => {
  res.json(await appointments.listAppointments(req.query))
})

export const appointmentsCreate = asyncHandler(async (req, res) => {
  const appointment = await appointments.createAppointment(req.body, actorFromRequest(req))
  res.status(201).json({ message: 'Randevu başarıyla oluşturuldu.', appointment })
})

export const appointmentsDetail = asyncHandler(async (req, res) => {
  res.json(await appointments.getAppointmentByNo(req.params.id))
})

export const appointmentsUpdate = asyncHandler(async (req, res) => {
  const appointment = await appointments.updateAppointment(req.params.id, req.body, actorFromRequest(req))
  res.json({ message: 'Randevu güncellendi.', appointment })
})

export const appointmentsStatus = asyncHandler(async (req, res) => {
  const appointment = await appointments.updateAppointmentStatus(req.params.id, req.body.status, actorFromRequest(req))
  res.json({ message: 'Randevu durumu güncellendi.', appointment })
})

export const examinationsList = asyncHandler(async (req, res) => {
  res.json(await examinations.listExaminations(req.query))
})

export const examinationsStatus = asyncHandler(async (req, res) => {
  const examination = await examinations.updateExaminationStatus(req.params.id, req.body, actorFromRequest(req))
  res.json({ message: 'Muayene durumu güncellendi.', examination })
})

export const examinationsDelete = asyncHandler(async (req, res) => {
  const examination = await examinations.deleteDraftExamination(req.params.id, actorFromRequest(req))
  res.json({ message: 'Taslak muayene arşivlendi.', examination })
})

export const prescriptionsList = asyncHandler(async (req, res) => {
  res.json(await prescriptions.listPrescriptions(req.query))
})

export const prescriptionsDetail = asyncHandler(async (req, res) => {
  res.json(await prescriptions.getPrescriptionByNo(req.params.id))
})

export const prescriptionsUpdate = asyncHandler(async (req, res) => {
  const prescription = await prescriptions.updatePrescription(req.params.id, req.body, actorFromRequest(req))
  res.json({ message: 'Reçete güncellendi.', prescription })
})

export const prescriptionsStatus = asyncHandler(async (req, res) => {
  const prescription = await prescriptions.updatePrescriptionStatus(req.params.id, req.body, actorFromRequest(req))
  res.json({ message: 'Reçete durumu güncellendi.', prescription })
})

export const prescriptionsDelete = asyncHandler(async (req, res) => {
  const prescription = await prescriptions.deleteDraftPrescription(req.params.id, actorFromRequest(req))
  res.json({ message: 'Taslak reçete arşivlendi.', prescription })
})

export const testsList = asyncHandler(async (req, res) => {
  res.json(await tests.listTests(req.query))
})

export const testsCreate = asyncHandler(async (req, res) => {
  const test = await tests.createTest(req.body, actorFromRequest(req))
  res.status(201).json({ message: 'Tetkik kaydı oluşturuldu.', test })
})

export const testsDetail = asyncHandler(async (req, res) => {
  res.json(await tests.getTestByNo(req.params.id))
})

export const testsStatus = asyncHandler(async (req, res) => {
  const test = await tests.updateTestStatus(req.params.id, req.body, actorFromRequest(req))
  res.json({ message: 'Tetkik güncellendi.', test })
})

export const staffList = asyncHandler(async (req, res) => {
  res.json(await staff.listStaff())
})

export const staffDoctors = asyncHandler(async (req, res) => {
  res.json(await staff.listDoctors())
})

export const staffCreate = asyncHandler(async (req, res) => {
  const person = await staff.createStaff(req.body, actorFromRequest(req))
  res.status(201).json({ message: 'Personel kaydı oluşturuldu.', staff: person })
})

export const staffDetail = asyncHandler(async (req, res) => {
  res.json(await staff.getStaffByNo(req.params.id))
})

export const staffUpdate = asyncHandler(async (req, res) => {
  const person = await staff.updateStaff(req.params.id, req.body, actorFromRequest(req))
  res.json({ message: 'Personel güncellendi.', staff: person })
})

export const staffStatus = asyncHandler(async (req, res) => {
  const person = await staff.updateStaffStatus(req.params.id, req.body.status, actorFromRequest(req))
  res.json({ message: 'Personel durumu güncellendi.', staff: person })
})

export const pricesList = asyncHandler(async (req, res) => {
  res.json(await prices.listPrices(req.query))
})

export const pricesCreate = asyncHandler(async (req, res) => {
  const price = await prices.createPrice(req.body, actorFromRequest(req))
  res.status(201).json({ message: 'Fiyat kaydı oluşturuldu.', price })
})

export const pricesDetail = asyncHandler(async (req, res) => {
  res.json(await prices.getPriceByNo(req.params.id))
})

export const pricesUpdate = asyncHandler(async (req, res) => {
  const price = await prices.updatePrice(req.params.id, req.body, actorFromRequest(req))
  res.json({ message: 'Fiyat kaydı güncellendi.', price })
})

export const pricesStatus = asyncHandler(async (req, res) => {
  const price = await prices.updatePriceStatus(req.params.id, req.body.status, actorFromRequest(req))
  res.json({ message: 'Fiyat durumu güncellendi.', price })
})

export const pricesDelete = asyncHandler(async (req, res) => {
  const price = await prices.deleteUnusedPrice(req.params.id, actorFromRequest(req))
  res.json({ message: 'Fiyat kaydı silindi.', price })
})

export const logsList = asyncHandler(async (req, res) => {
  res.json(await logs.listLogs(req.query))
})

export const logsDetail = asyncHandler(async (req, res) => {
  res.json(await logs.getLogByNo(req.params.id))
})

export const dashboardGet = asyncHandler(async (req, res) => {
  res.json(await dashboard.getDashboard())
})

export const reportsGet = asyncHandler(async (req, res) => {
  res.json(await reports.getReports(req.query))
})

export const settingsGet = asyncHandler(async (req, res) => {
  res.json(await settings.getSettings())
})

export const settingsUpdate = asyncHandler(async (req, res) => {
  const data = await settings.updateSettings(req.body, actorFromRequest(req))
  res.json({ message: 'Ayarlar kaydedildi.', settings: data })
})

export const profileGet = asyncHandler(async (req, res) => {
  res.json(await settings.getProfile())
})

export const profileUpdate = asyncHandler(async (req, res) => {
  const data = await settings.updateProfile(req.body, actorFromRequest(req))
  res.json({ message: 'Profil bilgileri kaydedildi.', profile: data })
})

export const passwordUpdate = asyncHandler(async () => {
  throw new HttpError(403, 'Kimlik doğrulama sistemi bağlanmadan şifre değiştirilemez.')
})

export const supportCreate = asyncHandler(async (req, res) => {
  const ticket = await settings.createSupportTicket(req.body, actorFromRequest(req))
  res.status(201).json({ message: 'Destek talebi gönderildi.', ticket })
})

export const supportList = asyncHandler(async (req, res) => {
  res.json(await settings.listSupportTickets())
})

export const documentsUpload = asyncHandler(async (req, res) => {
  const { ownerType, ownerNo } = req.params
  const lookup = ownerLookup[ownerType]
  if (!lookup) {
    throw new HttpError(400, 'Geçersiz belge sahibi türü.')
  }

  const owner = await pool.query(
    `SELECT id FROM ${lookup[0]} WHERE ${lookup[1]} = $1`,
    [ownerNo]
  )
  if (owner.rowCount === 0) {
    throw new HttpError(404, 'Belge eklenecek kayıt bulunamadı.')
  }

  const files = req.files?.length ? req.files : req.file ? [req.file] : []
  if (files.length === 0) {
    throw new HttpError(400, 'Yüklenecek dosya bulunamadı.')
  }

  const saved = []
  for (const file of files) {
    saved.push(await uploads.saveDocument({
      ownerType,
      ownerId: owner.rows[0].id,
      file,
      documentType: req.body.documentType,
    }))
  }

  res.status(201).json({ message: 'Belge yüklendi.', documents: saved })
})

export const documentsGet = asyncHandler(async (req, res) => {
  const file = await uploads.getDocumentFile(req.params.id)
  res.setHeader('Content-Type', file.mimeType)
  res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(file.originalName)}"`)
  res.sendFile(file.absolutePath)
})

export const documentsDownload = asyncHandler(async (req, res) => {
  const file = await uploads.getDocumentFile(req.params.id)
  res.download(file.absolutePath, file.originalName)
})

export const documentsDelete = asyncHandler(async (req, res) => {
  const document = await uploads.deleteDocument(req.params.id)
  res.json({ message: 'Belge silindi.', document })
})
