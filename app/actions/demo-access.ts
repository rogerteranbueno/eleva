'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const DEMO_COOKIE = 'eleva_demo_access'
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60

// Perfiles demo — cada uno lleva directo a su vista de rol
const DEMO_PROFILES: Record<string, { password: string; to: string; role: string }> = {
  'dueno@level.com': { password: 'Level2026', to: '/vl2026/pulso',        role: 'dueno' },
  'coach@level.com': { password: 'Level2026', to: '/vl2026/coach',         role: 'coach' },
  'ops@level.com':   { password: 'Level2026', to: '/vl2026/ops/dashboard', role: 'ops' },
  'sara@level.com':  { password: 'Level2026', to: '/vl2026/feed',          role: 'participante' },
}

async function setDemoCookie(value: string) {
  const jar = await cookies()
  jar.set(DEMO_COOKIE, value, {
    maxAge: COOKIE_MAX_AGE,
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })
}

export type DemoAccessState = { error?: string } | undefined

export async function grantDemoAccess(
  _prev: DemoAccessState,
  formData: FormData,
): Promise<DemoAccessState> {
  const name     = (formData.get('name')     ?? '').toString().trim()
  const email    = (formData.get('email')    ?? '').toString().trim().toLowerCase()
  const password = (formData.get('password') ?? '').toString().trim()
  const code     = (formData.get('code')     ?? '').toString().trim()

  // ── 1. QA bypass: código interno ──────────────────────────────────────────
  const qaToken = process.env.DEMO_QA_TOKEN
  if (qaToken && code === qaToken) {
    await setDemoCookie('qa_access')
    redirect('/vl2026/pulso')
  }

  // ── 2. Demo profiles: email + password exactos ─────────────────────────────
  const profile = DEMO_PROFILES[email]
  if (profile) {
    if (password !== profile.password) {
      return { error: 'Contraseña incorrecta para este perfil demo.' }
    }
    await setDemoCookie(`demo:${profile.role}`)
    redirect(profile.to)
  }

  // ── 3. Acceso libre con correo corporativo ─────────────────────────────────
  if (!email || !email.includes('@') || !email.includes('.')) {
    return { error: 'Ingresa un correo válido para acceder.' }
  }

  const webhookUrl = process.env.DEMO_LEAD_WEBHOOK
  if (webhookUrl) {
    fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, source: 'demo_gate', ts: new Date().toISOString() }),
    }).catch(() => {})
  }

  await setDemoCookie(Buffer.from(`${email}:${Date.now()}`).toString('base64'))
  redirect('/vl2026/pulso')
}
