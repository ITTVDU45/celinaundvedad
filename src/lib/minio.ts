import { Client } from 'minio'

// Lazy-create MinIO client to avoid module-time errors during build when ENV may be missing
function getMinioClient() {
  const endpointRaw = process.env.MINIO_ENDPOINT
  const portRaw = process.env.MINIO_PORT || '443'
  const useSSLRaw = process.env.MINIO_USE_SSL || 'true'
  const accessKey = process.env.MINIO_ROOT_USER
  const secretKey = process.env.MINIO_ROOT_PASSWORD

  if (!endpointRaw) {
    throw new Error('MINIO_ENDPOINT is not configured')
  }
  if (!accessKey || !secretKey) {
    throw new Error('MINIO_ROOT_USER or MINIO_ROOT_PASSWORD is not configured')
  }

  const endPoint = endpointRaw.replace('https://', '').replace('http://', '')
  const port = parseInt(portRaw, 10) || 443
  const useSSL = useSSLRaw === 'true'

  return new Client({
    endPoint,
    port,
    useSSL,
    accessKey,
    secretKey,
  })
}

// Bucket-Name
export const BUCKET_NAME = process.env.MINIO_BUCKET || 'celinaundvedad'

// Upload-Konfiguration
export const UPLOAD_CONFIG = {
  maxSizeMB: parseInt(process.env.UPLOAD_MAX_MB || '300'),
  allowedMimeTypes: (process.env.UPLOAD_ALLOWED_MIME || 'image/jpeg,image/png,image/heic,image/heif,video/mp4,video/quicktime,application/pdf').split(','),
  presignExpiry: parseInt(process.env.PRESIGN_URL_EXPIRY || '600'),
}

// Hilfsfunktionen
export async function ensureBucketExists() {
  try {
    const client = getMinioClient()
    const exists = await client.bucketExists(BUCKET_NAME)
    if (!exists) {
      await client.makeBucket(BUCKET_NAME, 'us-east-1')
      console.log(`Bucket ${BUCKET_NAME} wurde erstellt`)
    }
  } catch (error) {
    console.error('Fehler beim Erstellen des Buckets:', error)
    throw error
  }
}

export async function generatePresignedUploadUrl(fileName: string, contentType: string, userName: string, challengeId?: string) {
  try {
    const client = getMinioClient()
    let objectName: string

    if (challengeId) {
      // Challenge-Bilder: userName/Challenges/challengeId/filename
      objectName = `${userName}/Challenges/${challengeId}/${Date.now()}-${fileName}`
    } else {
      // Normale Bilder: userName/filename
      objectName = `${userName}/${Date.now()}-${fileName}`
    }

    const url = await client.presignedPutObject(BUCKET_NAME, objectName, UPLOAD_CONFIG.presignExpiry)
    return { url, objectName }
  } catch (error) {
    console.error('Fehler beim Generieren der Presigned URL:', error)
    throw error
  }
}

export async function generatePresignedDownloadUrl(objectName: string) {
  try {
    const client = getMinioClient()
    const url = await client.presignedGetObject(BUCKET_NAME, objectName, UPLOAD_CONFIG.presignExpiry)
    return url
  } catch (error) {
    console.error('Fehler beim Generieren der Download URL:', error)
    throw error
  }
}

export async function listUserFiles(userName: string) {
  try {
    const client = getMinioClient()
    // Lade alle Dateien des Benutzers (normale + Challenge-Bilder)
    const objectsStream = client.listObjects(BUCKET_NAME, `${userName}/`, true)
    const files: Array<{ name: string; size: number; lastModified: Date; isChallenge: boolean; challengeId?: string }> = []

    return new Promise<Array<{ name: string; size: number; lastModified: Date; isChallenge: boolean; challengeId?: string }>>((resolve, reject) => {
      objectsStream.on('data', (obj) => {
        // Sicherheitscheck für undefined-Werte
        if (!obj.name || obj.size === undefined || !obj.lastModified) {
          return
        }

        // Prüfe ob es sich um eine Challenge-Datei handelt
        const isChallenge = obj.name.includes('/Challenges/')
        let challengeId: string | undefined

        if (isChallenge) {
          // Extrahiere die Challenge-ID aus dem Pfad
          const pathParts = obj.name.split('/')
          const challengesIndex = pathParts.indexOf('Challenges')
          if (challengesIndex !== -1 && pathParts[challengesIndex + 1]) {
            challengeId = pathParts[challengesIndex + 1]
          }
        }

        files.push({
          name: obj.name,
          size: obj.size,
          lastModified: obj.lastModified,
          isChallenge,
          challengeId,
        })
      })

      objectsStream.on('end', () => resolve(files))
      objectsStream.on('error', reject)
    })
  } catch (error) {
    console.error('Fehler beim Auflisten der Dateien:', error)
    throw error
  }
}

export async function listUserChallengeFiles(userName: string, challengeId: string) {
  try {
    const client = getMinioClient()
    // Lade nur die Dateien einer spezifischen Challenge
    const objectsStream = client.listObjects(BUCKET_NAME, `${userName}/Challenges/${challengeId}/`, true)
    const files: Array<{ name: string; size: number; lastModified: Date }> = []

    return new Promise<Array<{ name: string; size: number; lastModified: Date }>>((resolve, reject) => {
      objectsStream.on('data', (obj) => {
        // Sicherheitscheck für undefined-Werte
        if (!obj.name || obj.size === undefined || !obj.lastModified) {
          return
        }

        files.push({
          name: obj.name,
          size: obj.size,
          lastModified: obj.lastModified,
        })
      })

      objectsStream.on('end', () => resolve(files))
      objectsStream.on('error', reject)
    })
  } catch (error) {
    console.error('Fehler beim Auflisten der Challenge-Dateien:', error)
    throw error
  }
}

export async function deleteFile(objectName: string) {
  try {
    const client = getMinioClient()
    await client.removeObject(BUCKET_NAME, objectName)
    return true
  } catch (error) {
    console.error('Fehler beim Löschen der Datei:', error)
    throw error
  }
}

// Persist simple user metadata JSON in MinIO at path: {userName}/metadata.json
export async function saveUserMetadata(userName: string, metadata: Record<string, unknown>) {
  try {
    const client = getMinioClient()
    const objectName = `${userName}/metadata.json`
    const buffer = Buffer.from(JSON.stringify(metadata))
    await client.putObject(BUCKET_NAME, objectName, buffer)
    return true
  } catch (error) {
    console.error('Fehler beim Speichern der User-Metadaten:', error)
    throw error
  }
}

export async function loadUserMetadata(userName: string) {
  try {
    const client = getMinioClient()
    const objectName = `${userName}/metadata.json`
    const stream = await client.getObject(BUCKET_NAME, objectName)
    // stream to string
    const chunks: Buffer[] = []
    for await (const chunk of stream) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
    }
    const content = Buffer.concat(chunks).toString('utf-8')
    return JSON.parse(content)
  } catch (error) {
    // Wenn Datei nicht existiert, gib null zurück
    // eslint-disable-next-line no-console
    console.warn('Kein Metadata-Objekt gefunden für', userName, error)
    return null
  }
}
