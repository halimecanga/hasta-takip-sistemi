import { Router } from 'express'
import multer from 'multer'
import * as patients from '../controllers/patientsController.js'
import * as shared from '../controllers/sharedController.js'
import pool from '../db/index.js'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
})

const router = Router()

router.get('/health', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT current_database() AS database, CURRENT_TIMESTAMP AS time'
    )
    res.json({
      status: 'ok',
      message: 'API ve PostgreSQL bağlantısı çalışıyor.',
      database: result.rows[0].database,
      time: result.rows[0].time,
    })
  } catch (error) {
    next(error)
  }
})

router.get('/patients', patients.list)
router.get('/patients/options', patients.options)
router.post('/patients', patients.create)
router.get('/patients/:patientNo', patients.detail)
router.patch('/patients/:patientNo/archive', patients.archive)
router.patch('/patients/:patientNo/restore', patients.restore)
router.post('/patients/:patientNo/examinations', patients.createExam)

router.get('/appointments', shared.appointmentsList)
router.post('/appointments', shared.appointmentsCreate)
router.get('/appointments/:id', shared.appointmentsDetail)
router.put('/appointments/:id', shared.appointmentsUpdate)
router.patch('/appointments/:id/status', shared.appointmentsStatus)

router.get('/examinations', shared.examinationsList)
router.patch('/examinations/:id/status', shared.examinationsStatus)
router.delete('/examinations/:id', shared.examinationsDelete)

router.get('/prescriptions', shared.prescriptionsList)
router.get('/prescriptions/:id', shared.prescriptionsDetail)
router.put('/prescriptions/:id', shared.prescriptionsUpdate)
router.patch('/prescriptions/:id/status', shared.prescriptionsStatus)
router.delete('/prescriptions/:id', shared.prescriptionsDelete)

router.get('/tests', shared.testsList)
router.post('/tests', shared.testsCreate)
router.get('/tests/:id', shared.testsDetail)
router.patch('/tests/:id', shared.testsStatus)

router.get('/staff', shared.staffList)
router.get('/staff/doctors', shared.staffDoctors)
router.post('/staff', shared.staffCreate)
router.get('/staff/:id', shared.staffDetail)
router.put('/staff/:id', shared.staffUpdate)
router.patch('/staff/:id/status', shared.staffStatus)

router.get('/prices', shared.pricesList)
router.post('/prices', shared.pricesCreate)
router.get('/prices/:id', shared.pricesDetail)
router.put('/prices/:id', shared.pricesUpdate)
router.patch('/prices/:id/status', shared.pricesStatus)
router.delete('/prices/:id', shared.pricesDelete)

router.get('/logs', shared.logsList)
router.get('/logs/:id', shared.logsDetail)

router.get('/dashboard', shared.dashboardGet)
router.get('/reports', shared.reportsGet)

router.get('/settings', shared.settingsGet)
router.put('/settings', shared.settingsUpdate)
router.get('/profile', shared.profileGet)
router.put('/profile', shared.profileUpdate)
router.patch('/profile/password', shared.passwordUpdate)

router.get('/support', shared.supportList)
router.post('/support', shared.supportCreate)

router.post('/documents/:ownerType/:ownerNo', upload.array('files', 8), shared.documentsUpload)
router.get('/documents/:id', shared.documentsGet)
router.get('/documents/:id/download', shared.documentsDownload)
router.delete('/documents/:id', shared.documentsDelete)

export default router
