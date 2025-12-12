import { NextRequest, NextResponse } from 'next/server'
import { listAdminFiles, generatePresignedDownloadUrl } from '@/lib/minio'
import { cookies } from 'next/headers'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
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

    // Lade alle Admin-Dateien
    let files: Array<{ name: string; size: number; lastModified: Date }> = []
    try {
      files = await listAdminFiles()
    } catch (err) {
      console.error('MinIO Zugriff fehlgeschlagen beim Auflisten der Dateien:', err)
      // Gib eine leere Liste zurück statt Fehler, damit Build/Prerender nicht scheitert
      return NextResponse.json({ files: [], message: 'MinIO nicht konfiguriert oder Fehler beim Zugriff' })
    }

    // Formatiere die Dateien für die Frontend-Anzeige
    const formattedFiles = await Promise.all(
      files.map(async (file) => {
        // Generiere Presigned Download-URL für die Anzeige
        let downloadUrl = ''
        try {
          downloadUrl = await generatePresignedDownloadUrl(file.name)
        } catch (err) {
          console.error('Fehler beim Generieren der Presigned URL für', file.name, err)
          downloadUrl = ''
        }
        
        return {
          id: file.name,
          fileName: file.name.split('/').pop() || file.name,
          objectName: file.name,
          size: file.size,
          uploadDate: file.lastModified.toISOString(),
          preview: downloadUrl,
          status: 'success' as const,
          progress: 100
        }
      })
    )

    return NextResponse.json({
      files: formattedFiles,
      message: 'Dateien erfolgreich geladen',
      totalFiles: formattedFiles.length
    })

  } catch (error) {
    console.error('Fehler beim Laden der Dateien:', error)
    return NextResponse.json(
      { error: 'Interner Server-Fehler beim Laden der Dateien' },
      { status: 500 }
    )
  }
}
