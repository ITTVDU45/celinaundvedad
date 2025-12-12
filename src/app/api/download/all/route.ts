import { NextRequest, NextResponse } from 'next/server'
import { getMinioClientExport, BUCKET_NAME, listAdminFiles } from '@/lib/minio'
import { cookies } from 'next/headers'
import archiver from 'archiver'
import { Readable } from 'stream'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

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

    // Liste alle Admin-Dateien
    const files = await listAdminFiles()

    if (files.length === 0) {
      return NextResponse.json(
        { error: 'Keine Bilder verfügbar' },
        { status: 404 }
      )
    }

    // Erstelle ZIP-Archive
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximale Kompression
    })

    // Erstelle einen ReadableStream für die Response
    const stream = new ReadableStream({
      start(controller) {
        archive.on('data', (chunk: Buffer) => {
          controller.enqueue(chunk)
        })

        archive.on('end', () => {
          controller.close()
        })

        archive.on('error', (err: Error) => {
          console.error('Archive error:', err)
          controller.error(err)
        })

        // Füge alle Dateien zum ZIP hinzu
        const client = getMinioClientExport()
        
        Promise.all(
          files.map(async (file) => {
            try {
              const stream = await client.getObject(BUCKET_NAME, file.name)
              // Extrahiere nur den Dateinamen (ohne Pfad)
              const fileName = file.name.split('/').pop() || file.name
              archive.append(stream as Readable, { name: fileName })
            } catch (error) {
              console.error(`Fehler beim Hinzufügen von ${file.name}:`, error)
            }
          })
        ).then(() => {
          archive.finalize()
        }).catch((error) => {
          console.error('Fehler beim Erstellen des ZIP:', error)
          controller.error(error)
        })
      }
    })

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="celina-vedad-fotos-${Date.now()}.zip"`
      }
    })
  } catch (error) {
    console.error('Fehler beim Erstellen des ZIP-Downloads:', error)
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}

