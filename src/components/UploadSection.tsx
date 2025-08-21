'use client'

import { useState, useRef, type ChangeEvent } from 'react'
import Image from 'next/image'

interface UploadedFile {
  id: string
  file: File
  preview: string
  progress: number
  status: 'uploading' | 'success' | 'error'
}

export default function UploadSection() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const newFiles: UploadedFile[] = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: 'uploading' as const,
    }))

    setUploadedFiles((prev: UploadedFile[]) => [...prev, ...newFiles])

    // Simuliere Upload-Progress
    newFiles.forEach((file) => {
      simulateUpload(file.id)
    })
  }

  const simulateUpload = (fileId: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 20
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setUploadedFiles((prev: UploadedFile[]) =>
          prev.map((f: UploadedFile) =>
            f.id === fileId ? { ...f, progress: 100, status: 'success' } : f
          )
        )
      } else {
        setUploadedFiles((prev: UploadedFile[]) =>
          prev.map((f: UploadedFile) =>
            f.id === fileId ? { ...f, progress } : f
          )
        )
      }
    }, 200)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev: UploadedFile[]) => {
      const file = prev.find((f: UploadedFile) => f.id === fileId)
      if (file) {
        URL.revokeObjectURL(file.preview)
      }
      return prev.filter((f: UploadedFile) => f.id !== fileId)
    })
  }

  const handleTouchStart = () => {
    // Mobile Touch-Feedback
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <section id="upload-section" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 md:py-20">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Titel und Beschreibung */}
        <div className="mb-12 md:mb-16 text-center">
          <h2 className="mb-4 md:mb-6 text-3xl font-bold text-gray-900 md:text-5xl">
            Fotos hochladen
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-600 md:text-xl">
            Wähle deine schönsten Fotos aus der Mediathek deines Handys aus und 
            lade sie hoch. Du kannst mehrere Bilder gleichzeitig auswählen.
          </p>
        </div>

        {/* Upload-Bereich */}
        <div className="mb-8 md:mb-12">
          <div
            className={`relative rounded-2xl border-2 border-dashed p-8 md:p-12 text-center transition-all ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="mx-auto mb-4 h-12 w-12 md:h-16 md:w-16 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg md:text-xl font-semibold text-gray-900">
              Fotos hierher ziehen oder klicken
            </h3>
            <p className="mb-4 text-sm md:text-base text-gray-600">
              Unterstützte Formate: JPG, PNG, HEIC
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              onTouchStart={handleTouchStart}
              className="rounded-lg bg-blue-600 px-4 py-2 md:px-6 md:py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:bg-blue-800 touch-manipulation"
            >
              Fotos auswählen
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              capture="environment"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleFileSelect(e.target.files)
              }
              className="hidden"
            />
          </div>
        </div>

        {/* Uploaded Files Grid */}
        {uploadedFiles.length > 0 && (
          <div>
            <h3 className="mb-4 md:mb-6 text-xl md:text-2xl font-semibold text-gray-900">
              Hochgeladene Fotos ({uploadedFiles.length})
            </h3>
            <div className="grid grid-cols-2 gap-3 md:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {uploadedFiles.map((file: UploadedFile) => (
                <div
                  key={file.id}
                  className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <Image
                    src={file.preview}
                    alt={file.file.name}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Progress Overlay */}
                  {file.status === 'uploading' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <div className="text-center text-white">
                        <div className="mb-2 text-xs md:text-sm">{Math.round(file.progress)}%</div>
                        <div className="h-1.5 md:h-2 w-16 md:w-20 overflow-hidden rounded-full bg-gray-700">
                          <div
                            className="h-full bg-green-500 transition-all duration-300"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Success/Error Status */}
                  {file.status === 'success' && (
                    <div className="absolute top-1 md:top-2 right-1 md:right-2 rounded-full bg-green-500 p-1">
                      <svg className="h-3 w-3 md:h-4 md:w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => removeFile(file.id)}
                    className="absolute top-1 md:top-2 left-1 md:left-2 rounded-full bg-red-500 p-1 opacity-0 transition-opacity group-hover:opacity-100 md:group-hover:opacity-100 touch-manipulation"
                  >
                    <svg className="h-3 w-3 md:h-4 md:w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* File Name */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <p className="text-xs text-white truncate">{file.file.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
