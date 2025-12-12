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
              Datenschutz bei Celina & Vedad – Hochzeitsedition
            </h2>
            
            <p className="text-lg leading-relaxed">
              Keine Sorge: Hier wird nichts verkauft, nichts getrackt, nichts heimlich an algorithmische Orakel verfüttert.
            </p>
            
            <p className="text-lg leading-relaxed">
              Diese Seite existiert aus genau zwei Gründen: Liebe und schöne Fotos.
            </p>
            
            <div className="space-y-4 mt-6">
              <div className="bg-amber-50/50 rounded-lg p-4 border-l-4 border-amber-300">
                <h3 className="text-xl font-semibold mb-2">📸 Welche Daten gibt's hier überhaupt?</h3>
                <p className="text-lg leading-relaxed">
                  In dieser Galerie werden ausschließlich die Fotos unserer Fotografin hochgeladen.
                </p>
                <p className="text-lg leading-relaxed">
                  Keine Selfies, keine Standortdaten, keine „Kamera war aus Versehen an"-Momente.
                </p>
              </div>
              
              <div className="bg-amber-50/50 rounded-lg p-4 border-l-4 border-amber-300">
                <h3 className="text-xl font-semibold mb-2">👀 Wer darf die Fotos sehen?</h3>
                <p className="text-lg leading-relaxed">
                  Alle Hochzeitsmenschen.
                </p>
                <p className="text-lg leading-relaxed">
                  Ja, wirklich alle. Diese Galerie ist bewusst für Gäste sichtbar, damit gemeinsam gestaunt, gelacht und nostalgisch geseufzt werden kann.
                </p>
              </div>
              
              <div className="bg-amber-50/50 rounded-lg p-4 border-l-4 border-amber-300">
                <h3 className="text-xl font-semibold mb-2">🗄️ Wo landen die Bilder?</h3>
                <p className="text-lg leading-relaxed">
                  Auf einem privaten MinIO-Server, der sicherer ist als die Tanzfläche um 3 Uhr nachts.
                </p>
                <p className="text-lg leading-relaxed">
                  Kein Cloud-Zauber aus Übersee, kein Silicon-Valley-Voodoo – nur ehrliche Serverliebe.
                </p>
              </div>
              
              <div className="bg-amber-50/50 rounded-lg p-4 border-l-4 border-amber-300">
                <h3 className="text-xl font-semibold mb-2">🧑‍⚖️ Verantwortlich im Sinne der DSGVO</h3>
                <p className="text-lg leading-relaxed">
                  Trommelwirbel bitte: <strong>Tolgahan Vardar</strong>
                </p>
                <p className="text-lg leading-relaxed">
                  unbestritten der coolste Mensch dieses Planeten,
                </p>
                <p className="text-lg leading-relaxed">
                  Datenschützer mit Herz, Serverflüsterer und jemand, dem selbst Bits und Bytes vertrauen.
                </p>
              </div>
              
              <div className="bg-amber-50/50 rounded-lg p-4 border-l-4 border-amber-300">
                <h3 className="text-xl font-semibold mb-2">⏳ Speicherdauer</h3>
                <p className="text-lg leading-relaxed">
                  So lange, wie man Hochzeitsfotos anschauen möchte.
                </p>
                <p className="text-lg leading-relaxed">
                  Mindestens bis das Album gedruckt ist – eventuell länger, falls spontane „Weißt du noch?"-Abende entstehen.
                </p>
              </div>
              
              <div className="bg-amber-50/50 rounded-lg p-4 border-l-4 border-amber-300">
                <h3 className="text-xl font-semibold mb-2">🖼️ Verwendung der Bilder</h3>
                <p className="text-lg leading-relaxed">
                  Mit dem Ansehen (und innerlichen Abfeiern) der Fotos erklärt ihr euch einverstanden,
                </p>
                <p className="text-lg leading-relaxed">
                  dass Celina & Vedad die Bilder rein privat nutzen dürfen –
                </p>
                <p className="text-lg leading-relaxed">
                  z. B. für Fotobücher, Slideshows oder legendäre Wohnzimmer-Präsentationen.
                </p>
                <p className="text-lg leading-relaxed">
                  Keine Werbung. Kein Influencer-Dasein. Kein Meme ohne Herz.
                </p>
              </div>
              
              <div className="bg-amber-50/50 rounded-lg p-4 border-l-4 border-amber-300">
                <h3 className="text-xl font-semibold mb-2">🍪 Cookies & Tracking</h3>
                <p className="text-lg leading-relaxed">
                  Gibt's nicht.
                </p>
                <p className="text-lg leading-relaxed">
                  Keine Cookies, keine Tracker, keine nervigen Banner.
                </p>
                <p className="text-lg leading-relaxed">
                  Nur Liebe. Und Hochzeitsfotos.
                </p>
              </div>
            </div>
            
            <p className="text-lg leading-relaxed font-semibold text-center text-gray-800 mt-8">
              Kurz gesagt:
            </p>
            <p className="text-lg leading-relaxed text-center">
              Datenschutz ernst genommen.
            </p>
            <p className="text-lg leading-relaxed text-center">
              Humor erlaubt.
            </p>
            <p className="text-lg leading-relaxed text-center">
              Und alles bleibt so, wie eine Hochzeit sein sollte: persönlich, sicher und schön. 💚
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
