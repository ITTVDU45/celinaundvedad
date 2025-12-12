import { NextRequest, NextResponse } from 'next/server'
import { ensureBucketExists, generateAdminPresignedUploadUrl, UPLOAD_CONFIG } from '@/lib/minio'
import { cookies } from 'next/headers'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    // Prüfe Admin-Authentifizierung
    const cookieStore = await cookies()
    const authRole = cookieStore.get('auth_role')?.value

    if (authRole !== 'admin') {
      return NextResponse.json(
        { error: 'Nur Admins können Dateien hochladen' },
        { status: 403 }
      )
    }

    const body = await request.json()
    console.log('Upload-Request Body:', body)
    
    const { fileName, contentType } = body

    // Validierung
    if (!fileName || !contentType) {
      console.log('Validierungsfehler:', { fileName, contentType })
      return NextResponse.json(
        { error: 'fileName und contentType sind erforderlich' },
        { status: 400 }
      )
    }

    console.log('Validierung erfolgreich, MIME-Type:', contentType)
    console.log('Erlaubte MIME-Types:', UPLOAD_CONFIG.allowedMimeTypes)

    // Überprüfe MIME-Type
    if (!UPLOAD_CONFIG.allowedMimeTypes.includes(contentType)) {
      console.log('MIME-Type nicht erlaubt:', contentType)
      return NextResponse.json(
        { error: `MIME-Type ${contentType} ist nicht erlaubt. Erlaubt sind: ${UPLOAD_CONFIG.allowedMimeTypes.join(', ')}` },
        { status: 400 }
      )
    }

    console.log('MIME-Type validiert, erstelle Bucket...')

    // Stelle sicher, dass der Bucket existiert
    await ensureBucketExists()

    console.log('Bucket existiert, generiere Admin Presigned URL...')

    // Generiere Admin Presigned Upload URL
    const { url, objectName } = await generateAdminPresignedUploadUrl(fileName, contentType)

    console.log('Presigned URL generiert:', { objectName })

    return NextResponse.json({
      uploadUrl: url,
      objectName,
      message: 'Upload-URL erfolgreich generiert'
    })

  } catch (error) {
    console.error('Fehler beim Generieren der Upload-URL:', error)
    return NextResponse.json(
      { error: 'Interner Server-Fehler beim Generieren der Upload-URL' },
      { status: 500 }
    )
  }
}
