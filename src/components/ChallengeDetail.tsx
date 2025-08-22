'use client'

import { useState, useRef, useEffect, type ChangeEvent } from 'react'
import { type Challenge } from '@/data/challenges'

interface ChallengeDetailProps {
  challenge: Challenge
  userName?: string
  onBack: () => void
  onPhotoUpload: (challengeId: string, file: File) => void
}

export default function ChallengeDetail({ challenge, userName, onBack, onPhotoUpload }: ChallengeDetailProps) {
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [challengeFiles, setChallengeFiles] = useState<Array<{ id: string; preview: string; fileName: string }>>([])
  const [isLoadingFiles, setIsLoadingFiles] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Lade die bereits hochgeladenen Fotos für diese Challenge, wenn userName vorhanden ist
    if (!userName) return
    loadChallengeFiles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName])

  const loadChallengeFiles = async () => {
    if (!userName) return
    try {
      setIsLoadingFiles(true)
      const res = await fetch(`/api/files?userName=${encodeURIComponent(userName)}`)
      if (!res.ok) {
        setChallengeFiles([])
        return
      }
      const data = await res.json()
      const filesForChallenge = (data.files || []).filter((f: any) => f.challengeId === challenge.id)
      setChallengeFiles(filesForChallenge.map((f: any) => ({ id: f.id || f.objectName || f.fileName, preview: f.preview, fileName: f.fileName })))
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Fehler beim Laden der Challenge-Fotos:', error)
      setChallengeFiles([])
    } finally {
      setIsLoadingFiles(false)
    }
  }

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return
    
    // Lade das erste Foto hoch
    const file = files[0]
    onPhotoUpload(challenge.id, file)
    setShowUploadModal(false)
  }

  const openUploadModal = () => {
    setShowUploadModal(true)
  }

  const closeUploadModal = () => {
    setShowUploadModal(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200">
      {/* Header mit Zurück-Button */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <button 
            onClick={onBack}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Zurück zu den Challenges
          </button>
        </div>
      </div>

      <div className="container mx-auto max-w-2xl px-4 py-8">
        {/* Challenge-Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{challenge.icon}</div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {challenge.title}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            {challenge.description}
          </p>
        </div>

        {/* Foto aufnehmen Button */}
        <div className="text-center mb-8">
          <button
            onClick={openUploadModal}
            className="bg-gradient-to-r from-[#C9AD7F] to-[#A67C5B] hover:from-[#B89A6E] hover:to-[#956B4F] text-white font-semibold px-8 py-4 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 text-lg"
          >
            📸 Foto aufnehmen
          </button>
        </div>

        {/* Challenge-Info */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-200/50">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
            💡 So funktioniert's
          </h3>
          <div className="space-y-3 text-gray-700">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">1️⃣</span>
              <p>Klicke auf "Foto aufnehmen"</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">2️⃣</span>
              <p>Wähle aus: Neue Aufnahme, Mediathek oder Datei</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">3️⃣</span>
              <p>Dein Foto wird automatisch zur Galerie hinzugefügt</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">4️⃣</span>
              <p>Die Challenge wird als "erledigt" markiert</p>
            </div>
          </div>
        </div>

        {/* Bereits hochgeladene Fotos für diese Challenge */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Eingereichte Fotos</h3>
          {isLoadingFiles ? (
            <div className="text-sm text-gray-600">Lade Fotos...</div>
          ) : challengeFiles.length === 0 ? (
            <div className="text-sm text-gray-600">Noch keine Fotos für diese Challenge.</div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {challengeFiles.map((f) => (
                <a key={f.id} href={f.preview} target="_blank" rel="noreferrer" className="block w-full h-28 overflow-hidden rounded-md">
                  <img src={f.preview} alt={f.fileName} className="w-full h-full object-cover" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                Foto für Challenge hinzufügen
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
                  <span className="text-gray-700">Foto oder Video aufnehmen</span>
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
