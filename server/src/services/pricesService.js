import pool from '../db/index.js'
import { HttpError } from '../utils/errors.js'
import { toMoney } from '../utils/money.js'
import { formatLongDate } from '../utils/dates.js'
import { writeAudit } from '../utils/audit.js'

const mapPrice = (row) => ({
  id: row.price_no,
  databaseId: row.id,
  name: row.name,
  category: row.category,
  price: Number(row.price),
  description: row.description,
  status: row.status,
  vatRate: Number(row.vat_rate),
  vatIncluded: row.vat_included,
  discountAllowed: row.discount_allowed,
  minimumPrice: Number(row.minimum_price),
  duration: row.duration,
  usageArea: row.usage_area || '',
  patientVisible: row.patient_visible,
  includedInInvoice: row.included_in_invoice,
  usageCount: row.usage_count,
  internalNote: row.internal_note || '',
  createdAt: formatLongDate(row.created_at),
  updatedAt: formatLongDate(row.updated_at),
})

export async function listPrices({ search = '', status = '' } = {}) {
  const result = await pool.query(
    `
      SELECT *
      FROM price_list
      WHERE
        ($1 = '' OR name ILIKE '%' || $1 || '%' OR category ILIKE '%' || $1 || '%' OR description ILIKE '%' || $1 || '%')
        AND ($2 = '' OR status = $2)
      ORDER BY id
    `,
    [search.trim(), status]
  )

  return result.rows.map(mapPrice)
}

export async function getPriceByNo(priceNo) {
  const result = await pool.query('SELECT * FROM price_list WHERE price_no = $1', [priceNo])
  if (result.rowCount === 0) {
    throw new HttpError(404, 'Fiyat kaydı bulunamadı.')
  }
  return mapPrice(result.rows[0])
}

export async function createPrice(payload, actor) {
  if (!payload.name?.trim() || !payload.category || payload.price === undefined || !payload.description?.trim()) {
    throw new HttpError(400, 'İşlem adı, kategori, ücret ve açıklama zorunludur.')
  }

  const result = await pool.query(
    `
      INSERT INTO price_list (
        price_no, name, category, price, description, status, vat_rate, vat_included,
        discount_allowed, minimum_price, duration, usage_area, patient_visible,
        included_in_invoice, internal_note
      )
      VALUES (
        'PRICE-' || lpad(nextval('price_no_seq')::text, 3, '0'),
        $1, $2, $3, $4, COALESCE($5, 'Aktif'), $6, $7, $8, $9, $10,
        NULLIF($11, ''), $12, $13, NULLIF($14, '')
      )
      RETURNING *
    `,
    [
      payload.name.trim(),
      payload.category,
      toMoney(payload.price),
      payload.description.trim(),
      payload.status,
      toMoney(payload.vatRate ?? 20),
      payload.vatIncluded !== false,
      payload.discountAllowed !== false,
      toMoney(payload.minimumPrice ?? payload.price),
      Number(payload.duration || 30),
      payload.usageArea || '',
      payload.patientVisible !== false,
      payload.includedInInvoice !== false,
      payload.internalNote || '',
    ]
  )

  await writeAudit(pool, {
    ...actor,
    action: 'Fiyat kaydı oluşturuldu',
    page: 'Fiyat Listesi',
    module: 'Fiyat Yönetimi',
    targetType: 'Fiyat',
    targetId: result.rows[0].price_no,
    eventCode: 'PRICE_CREATED',
    description: `${payload.name.trim()} fiyat kaydı oluşturuldu.`,
  })

  return mapPrice(result.rows[0])
}

export async function updatePrice(priceNo, payload, actor) {
  const result = await pool.query(
    `
      UPDATE price_list
      SET
        name = $2,
        category = $3,
        price = $4,
        description = $5,
        status = $6,
        vat_rate = $7,
        vat_included = $8,
        discount_allowed = $9,
        minimum_price = $10,
        duration = $11,
        usage_area = NULLIF($12, ''),
        patient_visible = $13,
        included_in_invoice = $14,
        internal_note = NULLIF($15, ''),
        updated_at = CURRENT_TIMESTAMP
      WHERE price_no = $1
      RETURNING *
    `,
    [
      priceNo,
      payload.name.trim(),
      payload.category,
      toMoney(payload.price),
      payload.description.trim(),
      payload.status,
      toMoney(payload.vatRate ?? 20),
      payload.vatIncluded !== false,
      payload.discountAllowed !== false,
      toMoney(payload.minimumPrice ?? payload.price),
      Number(payload.duration || 30),
      payload.usageArea || '',
      payload.patientVisible !== false,
      payload.includedInInvoice !== false,
      payload.internalNote || '',
    ]
  )

  if (result.rowCount === 0) {
    throw new HttpError(404, 'Fiyat kaydı bulunamadı.')
  }

  await writeAudit(pool, {
    ...actor,
    action: 'Fiyat kaydı güncellendi',
    page: 'Fiyat Listesi',
    module: 'Fiyat Yönetimi',
    targetType: 'Fiyat',
    targetId: priceNo,
    eventCode: 'PRICE_UPDATED',
    description: `${priceNo} fiyat kaydı güncellendi.`,
  })

  return mapPrice(result.rows[0])
}

export async function updatePriceStatus(priceNo, status, actor) {
  if (!['Aktif', 'Pasif', 'Arşivlendi'].includes(status)) {
    throw new HttpError(400, 'Fiyat durumu geçersiz.')
  }

  const result = await pool.query(
    `
      UPDATE price_list
      SET status = $2, updated_at = CURRENT_TIMESTAMP
      WHERE price_no = $1
      RETURNING *
    `,
    [priceNo, status]
  )

  if (result.rowCount === 0) {
    throw new HttpError(404, 'Fiyat kaydı bulunamadı.')
  }

  await writeAudit(pool, {
    ...actor,
    action: 'Fiyat durumu güncellendi',
    page: 'Fiyat Listesi',
    module: 'Fiyat Yönetimi',
    targetType: 'Fiyat',
    targetId: priceNo,
    eventCode: 'PRICE_STATUS_UPDATED',
    afterSummary: { status },
    description: `${priceNo} durumu ${status} olarak güncellendi.`,
  })

  return mapPrice(result.rows[0])
}

export async function deleteUnusedPrice(priceNo, actor) {
  const result = await pool.query(
    `
      DELETE FROM price_list
      WHERE price_no = $1 AND usage_count = 0 AND status <> 'Aktif'
      RETURNING price_no
    `,
    [priceNo]
  )

  if (result.rowCount === 0) {
    throw new HttpError(400, 'Yalnızca kullanılmamış ve aktif olmayan fiyat kaydı silinebilir.')
  }

  await writeAudit(pool, {
    ...actor,
    action: 'Fiyat kaydı silindi',
    page: 'Fiyat Listesi',
    module: 'Fiyat Yönetimi',
    targetType: 'Fiyat',
    targetId: priceNo,
    eventCode: 'PRICE_DELETED',
    description: `${priceNo} fiyat kaydı silindi.`,
  })

  return { id: priceNo }
}
