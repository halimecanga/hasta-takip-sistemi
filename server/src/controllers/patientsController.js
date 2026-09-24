import { actorFromRequest } from '../utils/audit.js'
import { asyncHandler } from '../utils/errors.js'
import {
  archivePatient,
  createPatient,
  getPatientByNo,
  getPatientOptions,
  listPatients,
  restorePatient,
} from '../services/patientsService.js'
import { createExamination } from '../services/examinationsService.js'

export const list = asyncHandler(async (req, res) => {
  res.json(await listPatients())
})

export const options = asyncHandler(async (req, res) => {
  res.json(await getPatientOptions())
})

export const create = asyncHandler(async (req, res) => {
  const patient = await createPatient(req.body, actorFromRequest(req))
  res.status(201).json({
    message: 'Hasta başarıyla kaydedildi.',
    patient,
  })
})

export const detail = asyncHandler(async (req, res) => {
  res.json(await getPatientByNo(req.params.patientNo))
})

export const archive = asyncHandler(async (req, res) => {
  const patient = await archivePatient(req.params.patientNo, actorFromRequest(req))
  res.json({
    message: 'Hasta başarıyla arşivlendi.',
    patient,
  })
})

export const restore = asyncHandler(async (req, res) => {
  const patient = await restorePatient(req.params.patientNo, actorFromRequest(req))
  res.json({
    message: 'Hasta başarıyla geri yüklendi.',
    patient,
  })
})

export const createExam = asyncHandler(async (req, res) => {
  const examination = await createExamination(req.params.patientNo, req.body, actorFromRequest(req))
  res.status(201).json({
    message: 'Muayene başarıyla kaydedildi.',
    examination,
  })
})
