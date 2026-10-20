import { NextResponse } from 'next/server'
import { query } from '../../../lib/db'
import { getUser } from '../../../lib/session'

export const dynamic = 'force-dynamic'

const s = (v, n) => String(v ?? '').trim().slice(0, n) || null

// Mon espace : mes revenus, mes dépenses pub, ma rentabilité, mes calls, ma progression.
export async function GET() {
  const me = await getUser()
  if (!me) return NextResponse.json({ error: 'Non connecté.' }, { status: 401 })
  const id = me.id
  try {
    const [p, rev, ads, calls, months, enr, prog] = await Promise.all([
      query('SELECT niche, product, goal_xof AS goal, status, notes FROM student_profiles WHERE user_id = $1', [id]),
      query(`SELECT id, amount_xof AS amount, source, note, to_char(earned_on, 'YYYY-MM-DD') AS date
               FROM student_revenues WHERE user_id = $1 ORDER BY earned_on DESC, id DESC`, [id]),
      query(`SELECT id, amount_xof AS amount, platform, note, to_char(spent_on, 'YYYY-MM-DD') AS date
               FROM ad_spends WHERE user_id = $1 ORDER BY spent_on DESC, id DESC`, [id]),
      query(`SELECT id, scheduled_at, duration_minutes AS duration, topic, meeting_url, status, notes
               FROM calls WHERE user_id = $1 ORDER BY scheduled_at DESC`, [id]),
      query(`SELECT to_char(d, 'YYYY-MM') AS month, SUM(rev)::bigint AS revenue, SUM(spend)::bigint AS spend FROM (
               SELECT earned_on d, amount_xof rev, 0 spend FROM student_revenues WHERE user_id = $1
               UNION ALL
               SELECT spent_on, 0, amount_xof FROM ad_spends WHERE user_id = $1) t
              GROUP BY 1 ORDER BY 1 DESC`, [id]),
      query(`SELECT f.title, e.status, e.enrolled_at FROM enrollments e
               JOIN formations f ON f.id = e.formation_id WHERE e.user_id = $1 ORDER BY e.enrolled_at DESC`, [id]),
      query(`SELECT (SELECT COUNT(*) FROM lesson_progress WHERE user_id = $1 AND completed)::int AS done,
                    (SELECT COUNT(*) FROM lessons)::int AS total`, [id]),
    ])
    const revenue = rev.rows.reduce((sum, r) => sum + r.amount, 0)
    const spend = ads.rows.reduce((sum, r) => sum + r.amount, 0)
    return NextResponse.json({
      me: { name: me.name, email: me.email },
      profile: p.rows[0] || { niche: '', product: '', goal: 0, status: 'actif', notes: '' },
      revenues: rev.rows,
      spends: ads.rows,
      calls: calls.rows,
      months: months.rows.map((m) => ({ month: m.month, revenue: Number(m.revenue), spend: Number(m.spend), profit: Number(m.revenue) - Number(m.spend) })),
      enrollments: enr.rows,
      progress: prog.rows[0],
      totals: { revenue, spend, profit: revenue - spend },
    })
  } catch (e) {
    console.error('[moi]', e)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}

// Mise à jour de mon profil (niche, produit, objectif) — le statut et les notes de suivi restent gérés par l'équipe.
export async function PUT(req) {
  const me = await getUser()
  if (!me) return NextResponse.json({ error: 'Non connecté.' }, { status: 401 })
  let b
  try { b = await req.json() } catch { b = {} }
  const goal = Math.max(0, Math.min(2e9, parseInt(b.goal, 10) || 0))
  try {
    await query(
      `INSERT INTO student_profiles (user_id, niche, product, goal_xof, updated_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (user_id) DO UPDATE
         SET niche = $2, product = $3, goal_xof = $4, updated_at = NOW()`,
      [me.id, s(b.niche, 120), s(b.product, 200), goal]
    )
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[moi PUT]', e)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
