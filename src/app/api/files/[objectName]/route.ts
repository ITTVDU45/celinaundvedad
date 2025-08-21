import { NextRequest, NextResponse } from 'next/server'
import { deleteFile } from '@/lib/minio'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ objectName: string }> }
) {
  try {
    // Warte auf params (Next.js 15 Anforderung)
    const { objectName: encodedObjectName } = await params
    const objectName = decodeURIComponent(encodedObjectName)

    if (!objectName) {
      return NextResponse.json(
        { error: 'objectName ist erforderlich' },
        { status: 400 }
      )
    }

    console.log('Lösche Datei:', objectName)

    // Lösche die Datei aus MinIO
    await deleteFile(objectName)

    console.log('Datei erfolgreich gelöscht:', objectName)

    return NextResponse.json({
      message: 'Datei erfolgreich gelöscht',
      objectName
    })

  } catch (error) {
    console.error('Fehler beim Löschen der Datei:', error)
    return NextResponse.json(
      { error: 'Interner Server-Fehler beim Löschen der Datei' },
      { status: 500 }
    )
  }
}
