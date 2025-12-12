'use client'

import { useState, useRef, useEffect, type ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'

interface UploadedFile {
  id: string
  fileName: string
  objectName: string
  preview: string
  progress: number
  status: 'uploading' | 'success' | 'error'
  size: number
}

interface FileItem {
  id: string
  fileName: string
  objectName: string
  preview: string
  size: number
  uploadDate: string
}

export default function AdminUpload() {
  const [uploadingFiles, setUploadingFiles] = useState<UploadedFile[]>([])
  const [existingFiles, setExistingFiles] = useState<FileItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    loadExistingFiles()
  }, [])

  const loadExistingFiles = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/files')
      
      if (response.ok) {
        const data = await response.json()
        setExistingFiles(data.files || [])
      } else {
        console.error('Fehler beim Laden der Dateien:', response.statusText)
      }
    } catch (error) {
      console.error('Fehler beim Laden der Dateien:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return

    const newFiles: UploadedFile[] = []
    
    for (const file of Array.from(files)) {
      try {
        const tempFile: UploadedFile = {
          id: crypto.randomUUID(),
          fileName: file.name,
          objectName: '',
          preview: URL.createObjectURL(file),
          progress: 0,
          status: 'uploading',
          size: file.size,
        }

        newFiles.push(tempFile)
        setUploadingFiles((prev) => [...prev, tempFile])

        // Upload zu API
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
          })
        })

        if (uploadResponse.ok) {
          const { uploadUrl, objectName } = await uploadResponse.json()
          
          // Upload zu MinIO
          const uploadResult = await fetch(uploadUrl, {
            method: 'PUT',
            body: file,
            headers: { 'Content-Type': file.type }
          })

          if (uploadResult.ok) {
            setUploadingFiles((prev) =>
              prev.map((f) =>
                f.id === tempFile.id 
                  ? { ...f, objectName, status: 'success', progress: 100 }
                  : f
              )
            )
            
            // Lade Liste neu
            await loadExistingFiles()
          } else {
            setUploadingFiles((prev) =>
              prev.map((f) =>
                f.id === tempFile.id 
                  ? { ...f, status: 'error' }
                  : f
              )
            )
          }
        } else {
          setUploadingFiles((prev) =>
            prev.map((f) =>
              f.id === tempFile.id 
                ? { ...f, status: 'error' }
                : f
            )
          )
        }
      } catch (error) {
        console.error('Fehler beim Upload der Datei:', error)
      }
    }

    // Lösche erfolgreiche Uploads nach 3 Sekunden aus der Upload-Liste
    setTimeout(() => {
      setUploadingFiles((prev) => prev.filter((f) => f.status !== 'success'))
    }, 3000)
  }

  const handleDelete = async (file: FileItem) => {
    if (!confirm(`Möchtest du "${file.fileName}" wirklich löschen?`)) {
      return
    }

    try {
      const response = await fetch(`/api/files/${encodeURIComponent(file.objectName)}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setExistingFiles((prev) => prev.filter((f) => f.id !== file.id))
      } else {
        alert('Fehler beim Löschen der Datei')
      }
    } catch (error) {
      console.error('Fehler beim Löschen:', error)
      alert('Fehler beim Löschen der Datei')
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    handleFileSelect(files)
  }

  const handleLogout = () => {
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
            
            <div className="bg-gradient-to-r from-[#C9AD7F] to-[#A67C5B] text-white px-3 py-1 rounded-full text-sm font-semibold">
              Admin
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Titel */}
        <div className="text-center mb-8">
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
            Admin-Bereich
          </h1>
          <p className="text-lg text-gray-600">
            Hochzeitsfotos hochladen und verwalten
          </p>
        </div>

        {/* Upload-Bereich */}
        <div className="mb-8">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border-2 border-dashed transition-all ${
              isDragging 
                ? 'border-[#C9AD7F] bg-amber-50/50' 
                : 'border-gray-300 hover:border-[#C9AD7F]'
            }`}
          >
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Bilder hochladen
              </h3>
              <p className="text-gray-600 mb-4">
                Ziehe Dateien hierher oder klicke zum Auswählen
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleFileSelect(e.target.files)}
                accept="image/*,video/*"
                multiple
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-r from-[#C9AD7F] to-[#A67C5B] hover:from-[#B89A6E] hover:to-[#956B4F] text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Dateien auswählen
              </button>
            </div>
          </div>

          {/* Upload-Progress */}
          {uploadingFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              {uploadingFiles.map((file) => (
                <div key={file.id} className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 truncate flex-1">
                      {file.fileName}
                    </span>
                    {file.status === 'success' && (
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {file.status === 'error' && (
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    {file.status === 'uploading' && (
                      <svg className="animate-spin h-5 w-5 text-[#C9AD7F]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Existierende Dateien */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Hochgeladene Bilder ({existingFiles.length})
          </h2>

          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9AD7F]"></div>
              <p className="mt-4 text-gray-600">Lade Bilder...</p>
            </div>
          )}

          {!isLoading && existingFiles.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Noch keine Bilder</h3>
                <p className="text-gray-600">Lade die ersten Hochzeitsfotos hoch.</p>
              </div>
            </div>
          )}

          {!isLoading && existingFiles.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {existingFiles.map((file) => (
                <div
                  key={file.id}
                  className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100 shadow-sm hover:shadow-md transition-all"
                >
                  <img
                    src={file.preview}
                    alt={file.fileName}
                    className="w-full h-full object-cover"
                  />

                  {/* Löschen-Button */}
                  <button
                    onClick={() => handleDelete(file)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    title="Datei löschen"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>

                  {/* Datei-Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="truncate font-medium">{file.fileName}</p>
                    <p className="text-xs opacity-75">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

