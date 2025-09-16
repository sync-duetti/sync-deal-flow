import { query } from '../../../../lib/db'

export default async function handler(req, res) {
  const { id } = req.query
  if (req.method === 'GET') {
    const [a, s] = await Promise.all([
      query(`select * from "Agreement" where id=$1`, [id]),
      query(`select * from "Signing" where "agreementId"=$1 order by "signedAt" desc`, [id]),
    ])
    return res.json({ agreement: a.rows[0] || null, signings: s.rows })
  }
  if (req.method === 'PATCH') {
    const { isActive, title, tracks, bodyTemplate } = req.body || {}
    await query(
      `update "Agreement"
         set "isActive"=coalesce($2,"isActive"),
             title=coalesce($3,title),
             tracks=coalesce($4,tracks),
             "bodyTemplate"=coalesce($5,"bodyTemplate"),
             "updatedAt"=now()
       where id=$1`,
      [id, isActive, title, tracks ? JSON.stringify(tracks) : null, bodyTemplate]
    )
    return res.json({ ok: true })
  }
  res.status(405).end()
}
