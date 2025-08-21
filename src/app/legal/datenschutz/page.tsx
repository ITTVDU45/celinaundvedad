'use client'

import Link from 'next/link'

export default function DatenschutzPage() {
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
            Zurück zur Startseite
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-gray-800">
            📜 DSGVO 
          </h1>
          
          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
              Datenschutz bei Celina & Vedad
            </h2>
            
            <p className="text-lg leading-relaxed">
              Hier wird nichts verkauft, nichts analysiert, nichts an mysteriöse Datengötter im Silicon Valley geopfert.
            </p>
            
            <p className="text-lg leading-relaxed">
              Eure Bilder landen nur auf unserem privaten MinIO-Server, wo sie liebevoll behütet werden wie der letzte Schluck Champagner um Mitternacht.
            </p>
            
            <p className="text-lg leading-relaxed">
              <strong>Verantwortlich im Sinne der DSGVO</strong> ist – Trommelwirbel – <strong>Tolgahan Vardar</strong>, der unbestritten coolste Mensch dieses Planeten. Ein Mann, der selbst die Wolken dazu bringt, Selfies zu machen, wenn er vorbeigeht.
            </p>
            
            <p className="text-lg leading-relaxed">
              <strong>Speicherdauer:</strong> So lange, wie es dauert, das Hochzeitsalbum zu drucken, und vielleicht ein bisschen länger, falls wir nostalgisch werden.
            </p>
            
            <p className="text-lg leading-relaxed">
              Mit dem Hochladen eurer Fotos erklärt ihr euch einverstanden, dass Celina & Vedad euch vielleicht mal in einer Fotocollage, einer Slideshow oder als Meme verewigen. Alles rein privat.
            </p>
            
            <p className="text-lg leading-relaxed font-semibold text-center text-gray-800">
              Also keine Panik: Keine Cookies, kein Tracking, nur Liebe.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
