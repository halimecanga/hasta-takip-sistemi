import pool from '../db/index.js'

const nextLogNo = async (client = pool) => {
  const result = await client.query(`
    SELECT 'LOG-' || to_char(CURRENT_DATE, 'YYYY') || '-' ||
      lpad(nextval('activity_log_no_seq')::text, 4, '0') AS log_no
  `)
  return result.rows[0].log_no
}

export async function writeAudit(client = pool, payload) {
  const logNo = payload.logNo || await nextLogNo(client)

  await client.query(
    `
      INSERT INTO activity_logs (
        log_no, staff_id, actor_name, actor_role, action, page, module,
        target_type, target_id, target_name, target_route, status, severity,
        description, before_summary, after_summary, ip_address, device,
        event_code, request_id
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12, $13,
        $14, $15::jsonb, $16::jsonb, $17, $18,
        $19, $20
      )
    `,
    [
      logNo,
      payload.staffId || null,
      payload.actorName || 'Sistem',
      payload.actorRole || 'Sistem',
      payload.action,
      payload.page,
      payload.module,
      payload.targetType || null,
      payload.targetId || null,
      payload.targetName || null,
      payload.targetRoute || null,
      payload.status || 'Başarılı',
      payload.severity || 'Bilgi',
      payload.description || '',
      payload.beforeSummary ? JSON.stringify(payload.beforeSummary) : null,
      payload.afterSummary ? JSON.stringify(payload.afterSummary) : null,
      payload.ipAddress || null,
      payload.device || null,
      payload.eventCode || null,
      payload.requestId || null,
    ]
  )
}

export const actorFromRequest = (req) => ({
  actorName: req.headers['x-actor-name'] || 'Dr. Cumhur Kesemenli',
  actorRole: req.headers['x-actor-role'] || 'Doktor / Yönetici',
  ipAddress: req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || null,
  device: req.headers['user-agent'] ? String(req.headers['user-agent']).slice(0, 120) : null,
})
