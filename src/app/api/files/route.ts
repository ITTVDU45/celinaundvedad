import { NextRequest, NextResponse } from 'next/server'
import { listUserFiles, generatePresignedDownloadUrl } from '@/lib/minio'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userName = searchParams.get('userName')

    if (!userName) {
      return NextResponse.json(
        { error: 'userName Parameter ist erforderlich' },
        { status: 400 }
      )
    }

    // Lade alle Dateien des Benutzers
    let files: Array<{ name: string; size: number; lastModified: Date; isChallenge: boolean; challengeId?: string }> = []
    try {
      files = await listUserFiles(userName)
    } catch (err) {
      console.error('MinIO Zugriff fehlgeschlagen beim Auflisten der Dateien:', err)
      // Gib eine leere Liste zurück statt Fehler, damit Build/Prerender nicht scheitert
      return NextResponse.json({ files: [], message: 'MinIO nicht konfiguriert oder Fehler beim Zugriff' })
    }

    // Formatiere die Dateien für die Frontend-Anzeige
    const formattedFiles = await Promise.all(
      files.map(async (file) => {
        // Generiere Presigned Download-URL für die Anzeige
        let downloadUrl = ''
        try {
          downloadUrl = await generatePresignedDownloadUrl(file.name)
        } catch (err) {
          console.error('Fehler beim Generieren der Presigned URL für', file.name, err)
          downloadUrl = ''
        }
        
        return {
          id: file.name,
          fileName: file.name.split('/').pop() || file.name,
          objectName: file.name,
          size: file.size,
          uploadDate: file.lastModified.toISOString(),
          userName: userName,
          preview: downloadUrl, // Verwende die echte Presigned Download-URL oder leer
          status: 'success' as const,
          progress: 100,
          isChallenge: file.isChallenge,
          challengeId: file.challengeId,
          // Extrahiere den Challenge-Namen für die Anzeige
          challengeName: file.challengeId ? getChallengeName(file.challengeId) : null
        }
      })
    )

    return NextResponse.json({
      files: formattedFiles,
      message: 'Dateien erfolgreich geladen',
      totalFiles: formattedFiles.length,
      challengeFiles: formattedFiles.filter(f => f.isChallenge).length,
      normalFiles: formattedFiles.filter(f => !f.isChallenge).length
    })

  } catch (error) {
    console.error('Fehler beim Laden der Dateien:', error)
    return NextResponse.json(
      { error: 'Interner Server-Fehler beim Laden der Dateien' },
      { status: 500 }
    )
  }
}

// Hilfsfunktion: Challenge-ID zu Challenge-Namen konvertieren
function getChallengeName(challengeId: string): string {
  const challengeMap: Record<string, string> = {
    'gruppen-fliege': 'Gruppenfoto mit Fliege-Trägern',
    'gruppen-brillentraeger': 'Gruppenfoto mit Brillenträgern',
    'gruppen-schuhfarben': 'Gleiche Schuhfarben',
    'gruppen-glitzer': 'Glitzernde Outfits',
    'gruppen-weiss': 'Weiße Kleidungsstücke',
    'fun-weiteste-reise': 'Weiteste Anreise',
    'fun-gleicher-nachname': 'Gleicher Nachname',
    'fun-verheiratet': 'Verheiratete Gäste',
    'fun-single': 'Single-Gäste',
    'fun-rote-kleidung': 'Rote Kleidung',
    'aktion-tanzende': 'Tanzende Gäste',
    'aktion-bar-gaeste': 'Bar-Besucher',
    'aktion-torte-gegessen': 'Torte gegessen',
    'aktion-trinkende': 'Trinkende Gäste',
    'aktion-selfie-macher': 'Selfie-Macher',
    'persoenlich-braeutigam-kindheit': 'Bräutigam seit Kindheit',
    'persoenlich-braut-10-jahre': 'Braut länger als 10 Jahre',
    'persoenlich-verlobungsfeier': 'Bei Verlobungsfeier',
    'persoenlich-gleicher-ort': 'Gleicher Wohnort',
    'persoenlich-urlaub-mit-paar': 'Urlaub mit Brautpaar',
    'selfie-neue-bekanntschaft': 'Neue Bekanntschaft',
    'selfie-auffaelligstes-outfit': 'Auffälligstes Outfit',
    'selfie-mit-brautpaar': 'Mit Brautpaar',
    'selfie-aeltester-juengster': 'Ältester und Jüngster',
    'selfie-lachende-gaeste': 'Lachende Gäste',
    'stimmung-tanzendes-paar': 'Tanzendes Paar',
    'stimmung-boomerang-erster-tanz': 'Boomerang erster Tanz',
    'stimmung-witzigster-tanzmove': 'Witzigster Tanzmove',
    'stimmung-vollste-tanzflaeche': 'Vollste Tanzfläche',
    'stimmung-selfie-mit-dj': 'Mit DJ/Band',
    'kreativ-drink-des-abends': 'Drink des Abends',
    'kreativ-schoenster-gedeckter-tisch': 'Schönster gedeckter Tisch',
    'kreativ-schoenste-blume': 'Schönste Blume',
    'kreativ-lieblingsdetail': 'Lieblingsdetail',
    'kreativ-spektakulaerster-schuh': 'Spektakulärster Schuh',
    'action-lachender-gast': 'Lachender Gast',
    'action-emotionaler-moment': 'Emotionaler Moment',
    'action-erstes-kuchenstueck': 'Erstes Kuchenstück',
    'action-lustiger-selfie-spiegel': 'Lustiger Selfie-Spiegel',
    'action-dessert-stibitzen': 'Dessert stibitzen',
    'highlights-verrueckteste-frisur': 'Verrückteste Frisur',
    'highlights-geburtstag': 'Geburtstagskind',
    'highlights-auffaelliges-accessoire': 'Auffälliges Accessoire',
    'highlights-lautester-lacher': 'Lautester Lacher',
    'highlights-gleiche-lieblingsfarbe': 'Gleiche Lieblingsfarbe',
    'highlights-neue-bekanntschaft-heute': 'Neue Bekanntschaft heute',
    'highlights-tanzen-koennen': 'Tanzen können',
    'highlights-meiste-tanzrunden': 'Meiste Tanzrunden',
    'highlights-bester-toast': 'Bester Toast',
    'highlights-besonders-gute-laune': 'Besonders gute Laune',
    'einzel-aeltester-gast': 'Ältester Gast',
    'einzel-juengster-gast': 'Jüngster Gast',
    'einzel-witziger-tanzmove': 'Witziger Tanzmove',
    'einzel-drinks-mixen': 'Drinks mixen',
    'einzel-besonderer-snack': 'Besonderer Snack',
    'einzel-konfetti-werfen': 'Konfetti werfen',
    'einzel-mit-kindern-spielen': 'Mit Kindern spielen',
    'einzel-brautpaar-umarmung': 'Brautpaar umarmt',
    'einzel-geschenk-uebergeben': 'Geschenk übergeben',
    'einzel-emotionaler-gast-rede': 'Emotionaler Gast bei Rede'
  }
  
  return challengeMap[challengeId] || challengeId
}
