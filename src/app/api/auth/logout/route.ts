import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const runtime = 'nodejs'

export async function POST() {
  try {
    const cookieStore = await cookies()
    
    // Lösche das auth_role Cookie
    cookieStore.delete('auth_role')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Fehler beim Logout:', error)
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}

