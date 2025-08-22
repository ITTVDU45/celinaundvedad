import { NextRequest, NextResponse } from 'next/server'
import { saveUserMetadata, loadUserMetadata } from '@/lib/minio'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userName = searchParams.get('userName')
  if (!userName) return NextResponse.json({ error: 'userName required' }, { status: 400 })

  try {
    const metadata = await loadUserMetadata(userName)
    return NextResponse.json({ metadata })
  } catch (error) {
    console.error('Error loading user metadata', error)
    return NextResponse.json({ metadata: null })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userName, metadata } = body
    if (!userName || !metadata) return NextResponse.json({ error: 'userName and metadata required' }, { status: 400 })
    await saveUserMetadata(userName, metadata)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error saving user metadata', error)
    return NextResponse.json({ error: 'could not save' }, { status: 500 })
  }
}


