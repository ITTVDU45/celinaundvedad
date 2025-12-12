'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface FileItem {
  id: string
  fileName: string
  objectName: string
  preview: string
  size: number
  uploadDate: string
}

export default function UserGallery() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDownloadingAll, setIsDownloadingAll] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadFiles()
  }, [])

  const loadFiles = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/files')
      
      if (response.ok) {
        const data = await response.json()
        setFiles(data.files || [])
      } else {
        console.error('Fehler beim Laden der Dateien:', response.statusText)
      }
    } catch (error) {
      console.error('Fehler beim Laden der Dateien:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async (file: FileItem) => {
    try {
      const response = await fetch(`/api/download/${encodeURIComponent(file.objectName)}`)
      
      if (response.ok) {
        const data = await response.json()
        // Öffne Download-URL in neuem Tab
        window.open(data.downloadUrl, '_blank')
      } else {
        alert('Fehler beim Herunterladen des Bildes')
      }
    } catch (error) {
      console.error('Fehler beim Download:', error)
      alert('Fehler beim Herunterladen des Bildes')
    }
  }

  const handleDownloadAll = async () => {
    try {
      setIsDownloadingAll(true)
      
      // Direkter Download via Link
      const link = document.createElement('a')
      link.href = '/api/download/all'
      link.download = `celina-vedad-fotos-${Date.now()}.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Fehler beim ZIP-Download:', error)
      alert('Fehler beim Herunterladen aller Bilder')
    } finally {
      setIsDownloadingAll(false)
    }
  }

  const handleLogout = () => {
    // Lösche Cookie durch Aufruf einer Logout-API
    fetch('/api/auth/logout', { method: 'POST' })
      .then(() => router.push('/'))
      .catch(() => router.push('/'))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleLogout}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Zurück
            </button>
            
            {files.length > 0 && (
              <button
                onClick={handleDownloadAll}
                disabled={isDownloadingAll}
                className="bg-gradient-to-r from-[#C9AD7F] to-[#A67C5B] hover:from-[#B89A6E] hover:to-[#956B4F] text-white font-semibold px-4 py-2 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
              >
                {isDownloadingAll ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Lädt...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Alle herunterladen
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Titel */}
        <div className="text-center mb-12">
          <div className="relative mx-auto mb-8">
            <div className="relative w-40 h-40 md:w-48 md:h-48 mx-auto">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#C9AD7F] to-[#A67C5B] p-1 shadow-2xl"></div>
              <div className="absolute inset-1 rounded-full bg-white p-2 shadow-inner"></div>
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <img
                  src="/Cuablackand white.jpeg"
                  alt="Celina und Vedad"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-dancing-script">
            Celina & Vedad
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Unsere Hochzeitsfotos
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9AD7F]"></div>
            <p className="mt-4 text-gray-600">Lade Bilder...</p>
          </div>
        )}

        {/* Keine Bilder */}
        {!isLoading && files.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg max-w-md mx-auto">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Noch keine Bilder</h3>
              <p className="text-gray-600">Es wurden noch keine Hochzeitsfotos hochgeladen.</p>
            </div>
          </div>
        )}

        {/* Bilder-Grid */}
        {!isLoading && files.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100 shadow-sm hover:shadow-md transition-all"
              >
                <img
                  src={file.preview}
                  alt={file.fileName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Download-Button Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <button
                    onClick={() => handleDownload(file)}
                    className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 p-3 rounded-full shadow-lg transition-all duration-300 transform scale-75 group-hover:scale-100 hover:bg-gray-100"
                    title="Bild herunterladen"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                </div>

                {/* Datei-Info */}
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="truncate font-medium">{file.fileName}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

