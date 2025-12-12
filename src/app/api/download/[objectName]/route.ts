import { NextRequest, NextResponse } from 'next/server'
import { generatePresignedDownloadUrl } from '@/lib/minio'
import { cookies } from 'next/headers'

export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ objectName: string }> }
) {
  try {
    // Prüfe Authentifizierung
    const cookieStore = await cookies()
    const authRole = cookieStore.get('auth_role')?.value

    if (!authRole) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      )
    }

    const { objectName } = await params
    
    if (!objectName) {
      return NextResponse.json(
        { error: 'Objektname fehlt' },
        { status: 400 }
      )
    }

    // Dekodiere den objectName (falls URL-encoded)
    const decodedObjectName = decodeURIComponent(objectName)

    // Generiere Download-URL
    const downloadUrl = await generatePresignedDownloadUrl(decodedObjectName)

    return NextResponse.json({ downloadUrl })
  } catch (error) {
    console.error('Fehler beim Generieren der Download-URL:', error)
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}

