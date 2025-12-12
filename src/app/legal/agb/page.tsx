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
              Allgemeine Bedingungen für die große Hochzeits-Galerie des guten Geschmacks
            </h2>
            
            <p className="text-lg leading-relaxed">
              Willkommen in der öffentlich einsehbaren Ruhmeshalle der Liebe, des Glücks
            </p>
            
            <p className="text-lg leading-relaxed">
              und der professionell perfekt getroffenen Momente.
            </p>
            
            <p className="text-lg leading-relaxed">
              Mit dem Hochladen der Fotos unserer fantastischen Fotografin und dem Betrachten durch alle Hochzeitsmenschen erkennt ihr feierlich (und schmunzelnd) Folgendes an:
            </p>
            
            <div className="space-y-4 mt-6">
              <div className="bg-amber-50/50 rounded-lg p-4 border-l-4 border-amber-300">
                <h3 className="text-xl font-semibold mb-2">📸 Kuratiertes Glück</h3>
                <p className="text-lg leading-relaxed">
                  Hier werden nur die Fotos der Fotografin hochgeladen. Keine Handyblitze, keine halben Daumen im Bild – wir bleiben edel. Wer trotzdem sein eigenes Bild hochladen will, darf es… für sich behalten 😉
                </p>
              </div>
              
              <div className="bg-amber-50/50 rounded-lg p-4 border-l-4 border-amber-300">
                <h3 className="text-xl font-semibold mb-2">👀 Alle dürfen gucken</h3>
                <p className="text-lg leading-relaxed">
                  Diese Galerie ist für alle Gäste sichtbar. Schauen, schwärmen, nochmal schauen, „oh wow" sagen – ausdrücklich erlaubt und erwünscht.
                </p>
              </div>
              
              <div className="bg-amber-50/50 rounded-lg p-4 border-l-4 border-amber-300">
                <h3 className="text-xl font-semibold mb-2">🖼️ Kunststatus</h3>
                <p className="text-lg leading-relaxed">
                  Jedes Bild ist offiziell Kunst. Selbst wenn jemand beim Tanzen aussieht, als hätte er kurz sein Gleichgewicht an die Bar verliehen – Kunst bleibt Kunst.
                </p>
              </div>
              
              <div className="bg-amber-50/50 rounded-lg p-4 border-l-4 border-amber-300">
                <h3 className="text-xl font-semibold mb-2">🧙‍♂️ Der Schöpfer-Paragraph</h3>
                <p className="text-lg leading-relaxed">
                  Solltet ihr Tolga begegnen – dem Erbauer dieser Plattform, Hüter der Server, Meister der Uploads,
                </p>
                <p className="text-lg leading-relaxed">
                  kurz: dem geilsten Typen im Backend –
                </p>
                <p className="text-lg leading-relaxed">
                  dürft ihr ihn bewundernd anschauen, anerkennend nicken oder innerlich applaudieren. Alles korrekt.
                </p>
              </div>
              
              <div className="bg-amber-50/50 rounded-lg p-4 border-l-4 border-amber-300">
                <h3 className="text-xl font-semibold mb-2">🔐 Privat war gestern</h3>
                <p className="text-lg leading-relaxed">
                  Die Bilder sind innerhalb dieser Hochzeitswelt frei sichtbar. Keine Weitergabe an Klatschpresse, Boulevard oder Ex-Partner mit schlechtem Timing. Anstand, Leute.
                </p>
              </div>
              
              <div className="bg-amber-50/50 rounded-lg p-4 border-l-4 border-amber-300">
                <h3 className="text-xl font-semibold mb-2">🥂 Pflicht zum Genießen</h3>
                <p className="text-lg leading-relaxed">
                  Wer diese Galerie verlässt, ohne mindestens einmal zu lächeln, schuldet dem Brautpaar ein Getränk seiner Wahl. Regeln sind Regeln.
                </p>
              </div>
            </div>
            
            <p className="text-lg leading-relaxed font-semibold text-center text-gray-800 mt-8">
              Kurzfassung:
            </p>
            <p className="text-lg leading-relaxed text-center">
              Fotos anschauen. Erinnerungen feiern. Liebe genießen.
            </p>
            <p className="text-lg leading-relaxed text-center">
              Und bitte nie vergessen: Tolga ist der Coolste.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
