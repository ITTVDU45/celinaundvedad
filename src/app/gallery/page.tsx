'use client'

import { useState, useRef, type ChangeEvent, useEffect, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import ChallengesList from '@/components/ChallengesList'
import ChallengeDetail from '@/components/ChallengeDetail'
import { type Challenge } from '@/data/challenges'

interface UploadedFile {
  id: string
  fileName: string
  objectName: string
  preview: string
  progress: number
  status: 'uploading' | 'success' | 'error'
  userName: string
  uploadDate: string
  challengeId?: string
  size: number
  isChallenge?: boolean
  challengeName?: string
}

type TabType = 'gallery' | 'challenges'

function GalleryPageContent() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [userName, setUserName] = useState<string>('')
  const [activeTab, setActiveTab] = useState<TabType>('gallery')
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const searchParams = useSearchParams()

  // Lade gespeicherte Daten beim Start
  useEffect(() => {
    // Hole den Benutzernamen aus der URL
    const name = searchParams.get('name')
    if (name) {
      setUserName(name)
    }
  }, [searchParams])

  // Lade gespeicherte Fotos und Challenges, wenn sich der userName ändert
  useEffect(() => {
    if (!userName) return

    // Lade Fotos aus MinIO
    loadUserFiles()

    // Lade abgeschlossene Challenges aus der API (später implementieren)
    // Für jetzt: Leeres Array
    setCompletedChallenges([])
  }, [userName])

  // Lade Dateien aus MinIO
  const loadUserFiles = async () => {
    if (!userName) return

    try {
      setIsLoading(true)
      const response = await fetch(`/api/files?userName=${encodeURIComponent(userName)}`)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Geladene Dateien:', data.files)
        setUploadedFiles(data.files)
      } else {
        console.error('Fehler beim Laden der Dateien:', response.statusText)
        const errorData = await response.json()
        console.error('Fehler-Details:', errorData)
        // Fallback: Leeres Array bei API-Fehlern
        setUploadedFiles([])
      }
    } catch (error) {
      console.error('Fehler beim Laden der Dateien:', error)
      // Fallback: Leeres Array bei Netzwerk-Fehlern
      setUploadedFiles([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || !userName) return

    const newFiles: UploadedFile[] = []
    
    for (const file of Array.from(files)) {
      try {
        // Erstelle temporäre Datei für die Anzeige
        const tempFile: UploadedFile = {
          id: crypto.randomUUID(),
          fileName: file.name,
          objectName: '',
          preview: URL.createObjectURL(file),
          progress: 0,
          status: 'uploading' as const,
          userName: userName,
          uploadDate: new Date().toISOString(),
          size: file.size,
        }

        newFiles.push(tempFile)
        setUploadedFiles((prev: UploadedFile[]) => [...prev, tempFile])

        // Generiere Upload-URL (ohne Challenge-ID für normale Uploads)
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
            userName: userName
            // Keine challengeId für normale Uploads
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
            // Aktualisiere die Datei mit dem echten objectName
            setUploadedFiles((prev: UploadedFile[]) =>
              prev.map((f: UploadedFile) =>
                f.id === tempFile.id 
                  ? { ...f, objectName, status: 'success' as const, progress: 100 }
                  : f
              )
            )
          } else {
            // Fehler beim Upload
            setUploadedFiles((prev: UploadedFile[]) =>
              prev.map((f: UploadedFile) =>
                f.id === tempFile.id 
                  ? { ...f, status: 'error' as const }
                  : f
              )
            )
          }
        } else {
          // Fehler beim Generieren der Upload-URL
          setUploadedFiles((prev: UploadedFile[]) =>
            prev.map((f: UploadedFile) =>
              f.id === tempFile.id 
                ? { ...f, status: 'error' as const }
                : f
            )
          )
        }
      } catch (error) {
        console.error('Fehler beim Upload der Datei:', error)
      }
    }

    setShowUploadModal(false)
  }

  const handleChallengePhotoUpload = async (challengeId: string, file: File) => {
    if (!userName) return

    try {
      // Erstelle temporäre Datei
      const tempFile: UploadedFile = {
        id: crypto.randomUUID(),
        fileName: file.name,
        objectName: '',
        preview: URL.createObjectURL(file),
        progress: 0,
        status: 'uploading' as const,
        userName: userName,
        uploadDate: new Date().toISOString(),
        challengeId: challengeId,
        size: file.size,
      }

      setUploadedFiles((prev: UploadedFile[]) => [...prev, tempFile])

      // Generiere Upload-URL MIT Challenge-ID
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          userName: userName,
          challengeId: challengeId // Wichtig: Challenge-ID wird übergeben
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
          // Aktualisiere die Datei
          setUploadedFiles((prev: UploadedFile[]) =>
            prev.map((f: UploadedFile) =>
              f.id === tempFile.id 
                ? { ...f, objectName, status: 'success' as const, progress: 100 }
                : f
            )
          )

          // Markiere die Challenge als abgeschlossen
          if (!completedChallenges.includes(challengeId)) {
            setCompletedChallenges((prev: string[]) => [...prev, challengeId])
            // TODO: Später in MinIO oder separate API speichern
          }
        }
      }
    } catch (error) {
      console.error('Fehler beim Challenge-Upload:', error)
    }

    // Gehe zurück zur Challenges-Liste
    setSelectedChallenge(null)
  }

  const removeFile = async (fileId: string) => {
    const file = uploadedFiles.find((f: UploadedFile) => f.id === fileId)
    if (!file) return

    try {
      // Lösche aus MinIO
      if (file.objectName) {
        const response = await fetch(`/api/files/${encodeURIComponent(file.objectName)}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          // Entferne aus dem State
          setUploadedFiles((prev: UploadedFile[]) => {
            const fileToRemove = prev.find((f: UploadedFile) => f.id === fileId)
            if (fileToRemove) {
              URL.revokeObjectURL(fileToRemove.preview)
            }
            return prev.filter((f: UploadedFile) => f.id !== fileId)
          })
        }
      } else {
        // Entferne temporäre Datei
        setUploadedFiles((prev: UploadedFile[]) => {
          const fileToRemove = prev.find((f: UploadedFile) => f.id === fileId)
          if (fileToRemove) {
            URL.revokeObjectURL(fileToRemove.preview)
          }
          return prev.filter((f: UploadedFile) => f.id !== fileId)
        })
      }
    } catch (error) {
      console.error('Fehler beim Löschen der Datei:', error)
    }
  }

  const openUploadModal = () => {
    if (!userName) {
      alert('Bitte gib zuerst deinen Namen ein!')
      return
    }
    setShowUploadModal(true)
  }

  const closeUploadModal = () => {
    setShowUploadModal(false)
  }

  const handleChallengeSelect = (challenge: Challenge) => {
    setSelectedChallenge(challenge)
  }

  const handleBackFromChallenge = () => {
    setSelectedChallenge(null)
  }

  // Filtere nur die Fotos des aktuellen Nutzers
  const userFiles = uploadedFiles.filter((file: UploadedFile) => file.userName === userName)

  // Wenn kein Benutzername vorhanden ist, zeige eine Nachricht
  if (!userName) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Benutzername nicht gefunden
          </h2>
          <p className="text-gray-600 mb-6">
            Bitte gehe zurück zur Startseite und gib deinen Namen ein.
          </p>
          <Link 
            href="/"
            className="bg-gradient-to-r from-[#C9AD7F] to-[#A67C5B] hover:from-[#B89A6E] hover:to-[#956B4F] text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    )
  }

  // Wenn eine Challenge ausgewählt ist, zeige die Challenge-Detailseite
  if (selectedChallenge) {
    return (
      <ChallengeDetail
        challenge={selectedChallenge}
        onBack={handleBackFromChallenge}
        onPhotoUpload={handleChallengePhotoUpload}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200">
      {/* Header mit Zurück-Button */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Zurück
          </Link>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Profil-Bereich mit rundem Bild */}
        <div className="text-center mb-12">
          <div className="relative mx-auto mb-8">
            {/* Rundes Profilbild mit elegantem Rahmen */}
            <div className="relative w-40 h-40 md:w-48 md:h-48 mx-auto">
              {/* Äußerer Schatten-Ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#C9AD7F] to-[#A67C5B] p-1 shadow-2xl"></div>
              
              {/* Innerer weißer Ring */}
              <div className="absolute inset-1 rounded-full bg-white p-2 shadow-inner"></div>
              
              {/* Das eigentliche Bild */}
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <Image
                  src="/CelinaundVedad.jpeg"
                  alt="Celina und Vedad"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-dancing-script">
            Celina & Vedad
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Teile deine schönsten Momente mit uns
          </p>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-3 inline-block shadow-lg border border-amber-200/50">
            <p className="text-sm text-gray-700">
              Willkommen, <span className="font-semibold text-[#A67C5B]">{userName}</span>! 👋
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-1 shadow-lg">
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveTab('gallery')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === 'gallery'
                      ? 'bg-gradient-to-r from-[#C9AD7F] to-[#A67C5B] text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  📸 Galerie
                </button>
                <button
                  onClick={() => setActiveTab('challenges')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === 'challenges'
                      ? 'bg-gradient-to-r from-[#C9AD7F] to-[#A67C5B] text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  🎯 Challenges
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab-Content */}
        {activeTab === 'gallery' ? (
          /* Galerie-Tab */
          <div className="space-y-6">
            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#C9AD7F]"></div>
                <p className="mt-2 text-gray-600">Lade Dateien...</p>
              </div>
            )}

            {/* Galerie-Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Upload-Button */}
              <button
                onClick={openUploadModal}
                className="aspect-square bg-gradient-to-br from-[#C9AD7F] to-[#A67C5B] rounded-lg flex flex-col items-center justify-center text-white hover:from-[#B89A6E] hover:to-[#956B4F] transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm font-medium">Bilder hinzufügen</span>
              </button>

              {/* Nur die Fotos des aktuellen Nutzers */}
              {userFiles.map((file: UploadedFile) => (
                <div
                  key={file.id}
                  className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Fallback: Verwende normales img-Tag für MinIO-URLs */}
                  <img
                    src={file.preview}
                    alt={file.fileName}
                    className="w-full h-full object-cover"
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      console.error('Fehler beim Laden des Bildes:', file.preview)
                      // Fallback zu einem Platzhalter-Bild
                      const target = e.target as HTMLImageElement
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YWFhYSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBsb2FkZWQ8L3RleHQ+PC9zdmc+'
                    }}
                  />
                  
                  {/* Progress Overlay */}
                  {file.status === 'uploading' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <div className="text-center text-white">
                        <div className="mb-2 text-xs">Upload läuft...</div>
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-700">
                          <div
                            className="h-full bg-green-500 transition-all duration-300"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Error Status */}
                  {file.status === 'error' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-500/80">
                      <div className="text-center text-white">
                        <div className="text-xs">Upload fehlgeschlagen</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Success Status */}
                  {file.status === 'success' && (
                    <div className="absolute top-2 right-2 rounded-full bg-green-500 p-1">
                      <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Challenge Badge */}
                  {file.challengeId && (
                    <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      🎯
                    </div>
                  )}
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => removeFile(file.id)}
                    className="absolute top-2 left-2 md:left-2 md:top-2 rounded-full bg-red-500 p-1 opacity-0 transition-opacity group-hover:opacity-100 touch-manipulation"
                  >
                    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* File Name */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <p className="text-xs text-white truncate">{file.fileName}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Refresh Button */}
            <div className="text-center">
              <button
                onClick={loadUserFiles}
                className="px-4 py-2 bg-white/80 hover:bg-white text-gray-700 rounded-lg transition-colors"
              >
                🔄 Galerie aktualisieren
              </button>
            </div>
          </div>
        ) : (
          /* Challenges-Tab */
          <ChallengesList
            onChallengeSelect={handleChallengeSelect}
            completedChallenges={completedChallenges}
          />
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                Fotos hinzufügen
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#C9AD7F] transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-700">Fotomediathek</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#C9AD7F] transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-700">Foto aufnehmen</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#C9AD7F] transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                  </svg>
                  <span className="text-gray-700">Dateien auswählen</span>
                </button>
              </div>

              <button
                onClick={closeUploadModal}
                className="w-full mt-6 p-3 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Abbrechen
              </button>
            </div>
          </div>
        )}

        {/* Versteckter File Input */}
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
  )
}

export default function GalleryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GalleryPageContent />
    </Suspense>
  )
}
