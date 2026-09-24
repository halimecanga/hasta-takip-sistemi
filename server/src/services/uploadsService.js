import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pool from '../db/index.js'
import { HttpError } from '../utils/errors.js'

const uploadsRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../uploads')
const allowedMime = {
  'application/pdf': 'pdf',
  'image/jpeg': 'jpg',
  'image/png': 'png',
}
const allowedExt = new Set(['pdf', 'jpg', 'jpeg', 'png'])

const formatSize = (bytes) => {
  if (bytes >= 1024 * 1024) return `${Math.round(bytes / (1024 * 1024))} MB`
  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

const kindFromMime = (mime) => {
  if (mime === 'application/pdf') return 'PDF'
  if (mime === 'image/png') return 'PNG'
  return 'JPG'
}

const mapDocument = (row) => ({
  id: row.document_no,
  databaseId: row.id,
  ownerType: row.owner_type,
  ownerId: row.owner_id,
  name: row.original_name,
  type: row.document_type || kindFromMime(row.mime_type),
  size: formatSize(row.size_bytes),
  uploadedAt: row.uploaded_at,
  url: `/api/documents/${row.document_no}`,
  downloadUrl: `/api/documents/${row.document_no}/download`,
  status: row.status,
})

export function validateUploadFile(file) {
  if (!file) {
    throw new HttpError(400, 'Dosya seçilmedi.')
  }

  const ext = path.extname(file.originalname || '').replace('.', '').toLowerCase()
  if (!allowedMime[file.mimetype] || !allowedExt.has(ext)) {
    throw new HttpError(400, 'Yalnızca PDF, JPG ve PNG dosyaları yüklenebilir.')
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new HttpError(400, 'Dosya boyutu 10 MB sınırını aşıyor.')
  }
}

export async function saveDocument({ ownerType, ownerId, file, documentType }) {
  validateUploadFile(file)
  await fs.mkdir(uploadsRoot, { recursive: true })

  const ext = allowedMime[file.mimetype]
  const storedName = `${crypto.randomUUID()}.${ext}`
  const filePath = path.join(uploadsRoot, storedName)
  await fs.writeFile(filePath, file.buffer)

  const result = await pool.query(
    `
      INSERT INTO documents (
        document_no, owner_type, owner_id, original_name, stored_name,
        mime_type, file_ext, size_bytes, file_path, document_type
      )
      VALUES (
        'DOC-' || to_char(CURRENT_DATE, 'YYYY') || '-' || lpad(nextval('document_no_seq')::text, 4, '0'),
        $1, $2, $3, $4, $5, $6, $7, $8, $9
      )
      RETURNING
        id, document_no, owner_type, owner_id, original_name, mime_type,
        size_bytes, document_type, status,
        TO_CHAR(uploaded_at, 'DD.MM.YYYY') AS uploaded_at
    `,
    [
      ownerType,
      ownerId,
      file.originalname,
      storedName,
      file.mimetype,
      ext,
      file.size,
      storedName,
      documentType || kindFromMime(file.mimetype),
    ]
  )

  return mapDocument(result.rows[0])
}

export async function listDocumentsForOwners(ownerType, ownerIds) {
  if (!ownerIds.length) return []

  const result = await pool.query(
    `
      SELECT
        id, document_no, owner_type, owner_id, original_name, mime_type,
        size_bytes, document_type, status,
        TO_CHAR(uploaded_at, 'DD.MM.YYYY') AS uploaded_at
      FROM documents
      WHERE owner_type = $1 AND owner_id = ANY($2::bigint[])
      ORDER BY id DESC
    `,
    [ownerType, ownerIds]
  )

  return result.rows.map(mapDocument)
}

export async function getDocumentFile(documentNo) {
  const result = await pool.query(
    `
      SELECT *
      FROM documents
      WHERE document_no = $1
    `,
    [documentNo]
  )

  if (result.rowCount === 0) {
    throw new HttpError(404, 'Belge bulunamadı.')
  }

  const row = result.rows[0]
  const absolutePath = path.resolve(uploadsRoot, path.basename(row.file_path))
  if (!absolutePath.startsWith(uploadsRoot)) {
    throw new HttpError(400, 'Geçersiz dosya yolu.')
  }

  try {
    await fs.access(absolutePath)
  } catch {
    throw new HttpError(404, 'Dosya diskte bulunamadı.')
  }

  return {
    ...mapDocument({
      ...row,
      uploaded_at: row.uploaded_at,
    }),
    absolutePath,
    mimeType: row.mime_type,
    originalName: row.original_name,
  }
}

export async function deleteDocument(documentNo) {
  const file = await getDocumentFile(documentNo)
  await pool.query('DELETE FROM documents WHERE document_no = $1', [documentNo])
  await fs.unlink(file.absolutePath).catch(() => {})
  return { id: documentNo }
}

export { uploadsRoot }
