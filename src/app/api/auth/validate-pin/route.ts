import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pin } = body

    if (!pin || typeof pin !== 'string') {
      return NextResponse.json(
        { error: 'PIN ist erforderlich' },
        { status: 400 }
      )
    }

    const USER_PIN = process.env.USER_PIN
    const ADMIN_PIN = process.env.ADMIN_PIN

    if (!USER_PIN || !ADMIN_PIN) {
      console.error('PIN-Umgebungsvariablen nicht konfiguriert')
      return NextResponse.json(
        { error: 'Server-Konfigurationsfehler' },
        { status: 500 }
      )
    }

    let role: 'user' | 'admin' | null = null

    if (pin === USER_PIN) {
      role = 'user'
    } else if (pin === ADMIN_PIN) {
      role = 'admin'
    }

    if (!role) {
      return NextResponse.json(
        { error: 'Ungültige PIN' },
        { status: 401 }
      )
    }

    // Setze HttpOnly Cookie mit Rolle
    const cookieStore = await cookies()
    cookieStore.set('auth_role', role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 Tage
      path: '/'
    })

    return NextResponse.json({ role })
  } catch (error) {
    console.error('Fehler bei PIN-Validierung:', error)
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}

