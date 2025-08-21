import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const vars = {
      MINIO_ENDPOINT: !!process.env.MINIO_ENDPOINT,
      MINIO_PORT: !!process.env.MINIO_PORT,
      MINIO_USE_SSL: !!process.env.MINIO_USE_SSL,
      MINIO_BUCKET: !!process.env.MINIO_BUCKET,
      MINIO_ROOT_USER: !!process.env.MINIO_ROOT_USER,
      MINIO_ROOT_PASSWORD: !!process.env.MINIO_ROOT_PASSWORD,
      UPLOAD_ALLOWED_MIME: !!process.env.UPLOAD_ALLOWED_MIME,
      UPLOAD_MAX_MB: !!process.env.UPLOAD_MAX_MB,
      PRESIGN_URL_EXPIRY: !!process.env.PRESIGN_URL_EXPIRY,
      NODE_VERSION: process.version || null,
      NEXT_RUNTIME: process.env.NEXT_RUNTIME || null,
    }

    return NextResponse.json({ ok: true, vars })
  } catch (err) {
    console.error('Env-check error', err)
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
