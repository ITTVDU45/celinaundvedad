'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PinEntry() {
  const [pin, setPin] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!pin || pin.length < 3) {
      setError('Bitte gib mindestens 3 Zeichen ein')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/validate-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      })

      const data = await response.json()

      if (response.ok && data.role) {
        // Erfolgreiche Authentifizierung
        if (data.role === 'admin') {
          router.push('/admin')
        } else {
          router.push('/user')
        }
      } else {
        setError(data.error || 'Ungültige PIN')
        setPin('')
      }
    } catch (err) {
      console.error('Fehler bei PIN-Validierung:', err)
      setError('Verbindungsfehler. Bitte versuche es erneut.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, 20)
    setPin(value)
    setError('')
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Hintergrundbild */}
      <div className="absolute inset-0">
        <img
          src="/cuahochzeit.jpeg"
          alt="Celina und Vedad Banner"
          className="w-full h-full object-cover object-center md:object-center object-top"
        />
        {/* Overlay für bessere Lesbarkeit */}
        <div className="absolute inset-0 bg-black/20" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="mb-4 text-5xl font-bold md:text-7xl font-dancing-script">
            Celina & Vedad
          </h1>
          <p className="mb-8 text-xl md:text-2xl">
            Sehe unsere Hochzeitsfotos an
          </p>
          
          {/* PIN-Eingabe und Button */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="PIN eingeben"
                value={pin}
                onChange={handlePinChange}
                maxLength={20}
                disabled={isLoading}
                className="w-64 md:w-80 px-4 py-3 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C9AD7F] focus:ring-offset-2 focus:ring-offset-transparent text-center text-xl disabled:opacity-50"
                required
                autoFocus
              />
              {error && (
                <p className="mt-2 text-red-200 text-sm bg-red-500/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                  {error}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading || pin.length < 3}
              className="bg-gradient-to-r from-[#C9AD7F] to-[#A67C5B] hover:from-[#B89A6E] hover:to-[#956B4F] text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#C9AD7F] focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Wird überprüft...
                </span>
              ) : (
                'Zugang'
              )}
            </button>
          </form>
          
          {/* Datenschutz und AGB Hinweis */}
          <div className="mt-6 text-sm text-white/80 max-w-md mx-auto">
            <p>
              Mit dem Zugang akzeptierst du unsere{' '}
              <a 
                href="/legal/datenschutz" 
                className="underline hover:text-white transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                Datenschutzerklärung
              </a>
              {' '}und{' '}
              <a 
                href="/legal/agb" 
                className="underline hover:text-white transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                AGB
              </a>
              .
            </p>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="h-6 w-1 rounded-full bg-white/60"></div>
      </div>
    </div>
  )
}

