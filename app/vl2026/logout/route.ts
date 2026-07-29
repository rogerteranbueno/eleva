import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const jar = await cookies()
  jar.delete('eleva_demo_access')
  return NextResponse.redirect(new URL('/vl2026', process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'))
}
