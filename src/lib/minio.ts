import { Client } from 'minio'

// MinIO Client Konfiguration
export const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT!.replace('https://', '').replace('http://', ''),
  port: parseInt(process.env.MINIO_PORT || '443'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ROOT_USER!,
  secretKey: process.env.MINIO_ROOT_PASSWORD!,
})

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
    const exists = await minioClient.bucketExists(BUCKET_NAME)
    if (!exists) {
      await minioClient.makeBucket(BUCKET_NAME, 'us-east-1')
      console.log(`Bucket ${BUCKET_NAME} wurde erstellt`)
    }
  } catch (error) {
    console.error('Fehler beim Erstellen des Buckets:', error)
    throw error
  }
}

export async function generatePresignedUploadUrl(fileName: string, contentType: string, userName: string, challengeId?: string) {
  try {
    let objectName: string
    
    if (challengeId) {
      // Challenge-Bilder: userName/Challenges/challengeId/filename
      objectName = `${userName}/Challenges/${challengeId}/${Date.now()}-${fileName}`
    } else {
      // Normale Bilder: userName/filename
      objectName = `${userName}/${Date.now()}-${fileName}`
    }
    
    const url = await minioClient.presignedPutObject(BUCKET_NAME, objectName, UPLOAD_CONFIG.presignExpiry)
    return { url, objectName }
  } catch (error) {
    console.error('Fehler beim Generieren der Presigned URL:', error)
    throw error
  }
}

export async function generatePresignedDownloadUrl(objectName: string) {
  try {
    const url = await minioClient.presignedGetObject(BUCKET_NAME, objectName, UPLOAD_CONFIG.presignExpiry)
    return url
  } catch (error) {
    console.error('Fehler beim Generieren der Download URL:', error)
    throw error
  }
}

export async function listUserFiles(userName: string) {
  try {
    // Lade alle Dateien des Benutzers (normale + Challenge-Bilder)
    const objectsStream = minioClient.listObjects(BUCKET_NAME, `${userName}/`, true)
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
          challengeId
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
    // Lade nur die Dateien einer spezifischen Challenge
    const objectsStream = minioClient.listObjects(BUCKET_NAME, `${userName}/Challenges/${challengeId}/`, true)
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
    await minioClient.removeObject(BUCKET_NAME, objectName)
    return true
  } catch (error) {
    console.error('Fehler beim Löschen der Datei:', error)
    throw error
  }
}
