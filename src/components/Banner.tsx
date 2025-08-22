'use client'

import { useState } from 'react'
// Verwende normales img als Fallback für zuverlässige Darstellung des lokalen Banners
import { useRouter } from 'next/navigation'

export default function Banner() {
  const [name, setName] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      // Speichere den Namen im localStorage
      localStorage.setItem('userName', name.trim())
      
      // Hier könnte später die Logik für den Beitritt stehen
      console.log('Beigetreten:', name)
      // Weiterleitung zur Galerie-Seite mit dem Namen als Query-Parameter
      router.push(`/gallery?name=${encodeURIComponent(name.trim())}`)
    }
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Hintergrundbild */}
      <div className="absolute inset-0">
        <img
          src="/cua.jpeg"
          alt="Celina und Vedad Banner"
          className="w-full h-full object-cover object-center md:object-center object-top"
        />
        {/* Overlay für bessere Lesbarkeit */}
        <div className="absolute inset-0 bg-black/20" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="text-center text-white">
          <h1 className="mb-4 text-5xl font-bold md:text-7xl font-dancing-script">
            Celina & Vedad
          </h1>
          <p className="mb-8 text-xl md:text-2xl">
            Teile deine schönsten Momente mit uns
          </p>
          
          {/* Namens-Eingabe und Button */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Gib deinen Namen ein"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-64 md:w-80 px-4 py-3 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C9AD7F] focus:ring-offset-2 focus:ring-offset-transparent"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-[#C9AD7F] to-[#A67C5B] hover:from-[#B89A6E] hover:to-[#956B4F] text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#C9AD7F] focus:ring-offset-2 focus:ring-offset-transparent"
            >
              Beitreten
            </button>
          </form>
          
          {/* Datenschutz und AGB Hinweis */}
          <div className="mt-6 text-sm text-white/80 max-w-md mx-auto">
            <p>
              Mit dem Beitreten akzeptierst du unsere{' '}
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
