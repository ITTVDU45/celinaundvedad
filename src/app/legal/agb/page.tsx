'use client'

import Link from 'next/link'

export default function AGBPage() {
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
            ⚖️ AGB 
          </h1>
          
          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
              Allgemeine Bedingungen für die Leinwand- und Upload-Galaxie
            </h2>
            
            <p className="text-lg leading-relaxed">
              Willkommen in der heiligen Sphäre der Liebe, Kunst und Pastellfarben.
            </p>
            
            <p className="text-lg leading-relaxed">
              Mit dem Betreten dieser digitalen Hallen und dem Hochladen eurer Schnappschüsse erkennt ihr Folgendes an:
            </p>
            
            <div className="space-y-4 mt-6">
              <div className="bg-amber-50/50 rounded-lg p-4 border-l-4 border-amber-300">
                <p className="text-lg leading-relaxed">
                  <strong>Kunstpflicht:</strong> Jedes hochgeladene Bild ist ein Pinselstrich in der gemeinsamen Liebesgalerie. Verwackelte Fotos? Auch Kunst.
                </p>
              </div>
              
              <div className="bg-amber-50/50 rounded-lg p-4 border-l-4 border-amber-300">
                <p className="text-lg leading-relaxed">
                  <strong>Held der Ordnung:</strong> Solltet ihr zufällig <strong>Tolgahan Vardar</strong> treffen – den Architekten dieser Plattform, den Gandalf der Bits, den Monet der Server – dann verbeugt euch bitte mindestens leicht.
                </p>
              </div>
              
              <div className="bg-amber-50/50 rounded-lg p-4 border-l-4 border-amber-300">
                <p className="text-lg leading-relaxed">
                  <strong>Privat bedeutet privat:</strong> Eure Bilder werden nur im inneren Kreis geteilt, es sei denn, der Bräutigam wird irgendwann Bundeskanzler – dann reden wir nochmal.
                </p>
              </div>
              
              <div className="bg-amber-50/50 rounded-lg p-4 border-l-4 border-amber-300">
                <p className="text-lg leading-relaxed">
                  <strong>Humor-Paragraph:</strong> Wer nicht mindestens einmal laut gelacht hat, wenn er diese AGB liest, schuldet dem Brautpaar ein Glas Sekt.
                </p>
              </div>
            </div>
            
            <p className="text-lg leading-relaxed font-semibold text-center text-gray-800 mt-8">
              Kurz: Ladet hoch, habt Spaß, lasst Erinnerungen entstehen.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
