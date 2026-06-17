'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const DEMO_COOKIE = 'eleva_demo_access'
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 // 7 días

export type DemoAccessState = { error?: string } | undefined

export async function grantDemoAccess(
  _prev: DemoAccessState,
  formData: FormData,
): Promise<DemoAccessState> {
  const name  = (formData.get('name')  ?? '').toString().trim()
  const email = (formData.get('email') ?? '').toString().trim().toLowerCase()
  const code  = (formData.get('code')  ?? '').toString().trim()

  // ── QA / interno: código de acceso ──────────────────────────────────────
  const qaToken = process.env.DEMO_QA_TOKEN
  if (qaToken && code === qaToken) {
    const jar = await cookies()
    jar.set(DEMO_COOKIE, 'qa_access', {
      maxAge: COOKIE_MAX_AGE,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })
    redirect('/demo/pulso')
  }

  // ── Validación mínima ────────────────────────────────────────────────────
  if (!email || !email.includes('@') || !email.includes('.')) {
    return { error: 'Ingresa un correo válido para acceder.' }
  }

  // ── Lead capture (no bloqueante) ─────────────────────────────────────────
  const webhookUrl = process.env.DEMO_LEAD_WEBHOOK
  if (webhookUrl) {
    fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        source: 'demo_gate',
        ts: new Date().toISOString(),
      }),
    }).catch(() => {/* webhook falla silenciosamente */})
  }

  // ── Setear cookie de acceso ──────────────────────────────────────────────
  const jar = await cookies()
  jar.set(
    DEMO_COOKIE,
    Buffer.from(`${email}:${Date.now()}`).toString('base64'),
    {
      maxAge: COOKIE_MAX_AGE,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    },
  )

  redirect('/demo/pulso')
}
