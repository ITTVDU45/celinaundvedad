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


// Admin-spezifische Funktionen
export async function listAdminFiles() {
  try {
    const client = getMinioClient()
    const objectsStream = client.listObjects(BUCKET_NAME, 'admin-uploads/', true)
    const files: Array<{ name: string; size: number; lastModified: Date }> = []

    return new Promise<Array<{ name: string; size: number; lastModified: Date }>>((resolve, reject) => {
      objectsStream.on('data', (obj) => {
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
    console.error('Fehler beim Auflisten der Admin-Dateien:', error)
    throw error
  }
}

export async function generateAdminPresignedUploadUrl(fileName: string, contentType: string) {
  try {
    const client = getMinioClient()
    const objectName = `admin-uploads/${Date.now()}-${fileName}`

    const url = await client.presignedPutObject(BUCKET_NAME, objectName, UPLOAD_CONFIG.presignExpiry)
    return { url, objectName }
  } catch (error) {
    console.error('Fehler beim Generieren der Admin Presigned URL:', error)
    throw error
  }
}

export function getMinioClientExport() {
  return getMinioClient()
}
