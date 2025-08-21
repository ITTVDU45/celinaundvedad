import { NextRequest, NextResponse } from 'next/server'
import { ensureBucketExists, generatePresignedUploadUrl, UPLOAD_CONFIG } from '@/lib/minio'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Upload-Request Body:', body)
    
    const { fileName, contentType, userName, challengeId } = body

    // Validierung
    if (!fileName || !contentType || !userName) {
      console.log('Validierungsfehler:', { fileName, contentType, userName })
      return NextResponse.json(
        { error: 'fileName, contentType und userName sind erforderlich' },
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

    console.log('Bucket existiert, generiere Presigned URL...')

    // Generiere Presigned Upload URL (mit oder ohne Challenge-ID)
    const { url, objectName } = await generatePresignedUploadUrl(fileName, contentType, userName, challengeId)

    console.log('Presigned URL generiert:', { objectName, isChallenge: !!challengeId })

    return NextResponse.json({
      uploadUrl: url,
      objectName,
      message: 'Upload-URL erfolgreich generiert',
      isChallenge: !!challengeId,
      challengeId: challengeId || null
    })

  } catch (error) {
    console.error('Fehler beim Generieren der Upload-URL:', error)
    return NextResponse.json(
      { error: 'Interner Server-Fehler beim Generieren der Upload-URL' },
      { status: 500 }
    )
  }
}
