import { Suspense } from 'react'
import UserGallery from '@/components/UserGallery'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">Galerie wird geladen...</p>
      </div>
    </div>
  )
}

export default function UserPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <UserGallery />
    </Suspense>
  )
}

