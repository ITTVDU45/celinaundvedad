export interface Challenge {
  id: string
  title: string
  description: string
  icon: string
  category: 'gruppen' | 'fun' | 'aktion' | 'persoenlich' | 'selfie' | 'stimmung' | 'kreativ' | 'action' | 'highlights' | 'einzel'
}

export const challenges: Challenge[] = [
  // 🎯 Gruppen-Challenges
  {
    id: 'gruppen-fliege',
    title: 'Mach ein Gruppenfoto mit allen Gästen, die eine Fliege tragen.',
    description: 'Finde alle Gäste mit Fliegen und versammle sie für ein elegantes Gruppenfoto!',
    icon: '🎯',
    category: 'gruppen'
  },
  {
    id: 'gruppen-brillentraeger',
    title: 'Gruppenfoto mit allen Brillenträgern.',
    description: 'Sammle alle Gäste mit Brillen für ein schlaues Gruppenfoto!',
    icon: '🎯',
    category: 'gruppen'
  },
  {
    id: 'gruppen-schuhfarben',
    title: 'Sammle alle Gäste mit gleichen Schuhfarben für ein Foto.',
    description: 'Entdecke, wer die gleichen Schuhfarben trägt und mache ein Foto!',
    icon: '🎯',
    category: 'gruppen'
  },
  {
    id: 'gruppen-glitzer',
    title: 'Mach ein Bild mit allen Gästen, die etwas Glitzerndes tragen.',
    description: 'Finde alle glitzernden Outfits und Accessoires für ein funkelndes Foto!',
    icon: '🎯',
    category: 'gruppen'
  },
  {
    id: 'gruppen-weiss',
    title: 'Gruppenfoto mit allen, die ein weißes Kleidungsstück anhaben.',
    description: 'Versammle alle Gäste in Weiß für ein elegantes Gruppenfoto!',
    icon: '🎯',
    category: 'gruppen'
  },

  // 🎉 Fun-Challenges
  {
    id: 'fun-weiteste-reise',
    title: 'Mach ein Foto mit den Gästen, die am weitesten angereist sind.',
    description: 'Finde die Gäste mit der längsten Anreise und mache ein Foto!',
    icon: '🎉',
    category: 'fun'
  },
  {
    id: 'fun-gleicher-nachname',
    title: 'Gruppenfoto mit allen, die den gleichen Nachnamen haben wie das Brautpaar.',
    description: 'Sammle alle Familienmitglieder für ein Familienfoto!',
    icon: '🎉',
    category: 'fun'
  },
  {
    id: 'fun-verheiratet',
    title: 'Knipse alle Gäste, die bereits verheiratet sind.',
    description: 'Finde alle verheirateten Paare und mache ein Foto!',
    icon: '🎉',
    category: 'fun'
  },
  {
    id: 'fun-single',
    title: 'Foto mit allen Gästen, die Single sind.',
    description: 'Versammle alle Single-Gäste für ein lustiges Foto!',
    icon: '🎉',
    category: 'fun'
  },
  {
    id: 'fun-rote-kleidung',
    title: 'Mach ein Foto mit allen Gästen, die rote Kleidung tragen.',
    description: 'Finde alle roten Outfits für ein leidenschaftliches Foto!',
    icon: '🎉',
    category: 'fun'
  },

  // 💃 Aktions-Challenges
  {
    id: 'aktion-tanzende',
    title: 'Fotografiere alle Gäste, die gerade am Tanzen sind.',
    description: 'Halte den Tanzmoment aller aktiven Gäste fest!',
    icon: '💃',
    category: 'aktion'
  },
  {
    id: 'aktion-bar-gaeste',
    title: 'Mach ein Bild mit den Gästen, die gerade an der Bar stehen.',
    description: 'Sammle alle Bar-Besucher für ein geselliges Foto!',
    icon: '💃',
    category: 'aktion'
  },
  {
    id: 'aktion-torte-gegessen',
    title: 'Gruppenfoto mit allen, die schon ein Stück Torte gegessen haben.',
    description: 'Finde alle, die bereits von der Hochzeitstorte probiert haben!',
    icon: '💃',
    category: 'aktion'
  },
  {
    id: 'aktion-trinkende',
    title: 'Sammle alle Gäste, die gerade etwas trinken, für ein gemeinsames Foto.',
    description: 'Halte den Moment fest, wenn alle Gäste anstoßen!',
    icon: '💃',
    category: 'aktion'
  },
  {
    id: 'aktion-selfie-macher',
    title: 'Mach ein Gruppenfoto mit allen, die gerade Selfies machen.',
    description: 'Fotografiere alle Selfie-begeisterten Gäste!',
    icon: '💃',
    category: 'aktion'
  },

  // 💖 Persönliche & Emotionale Momente
  {
    id: 'persoenlich-braeutigam-kindheit',
    title: 'Foto mit allen Gästen, die den Bräutigam seit der Kindheit kennen.',
    description: 'Sammle alle langjährigen Freunde des Bräutigams!',
    icon: '💖',
    category: 'persoenlich'
  },
  {
    id: 'persoenlich-braut-10-jahre',
    title: 'Gruppenfoto mit allen Gästen, die die Braut schon länger als 10 Jahre kennen.',
    description: 'Finde alle langjährigen Freunde der Braut!',
    icon: '💖',
    category: 'persoenlich'
  },
  {
    id: 'persoenlich-verlobungsfeier',
    title: 'Mach ein Foto mit allen, die bei der Verlobungsfeier dabei waren.',
    description: 'Versammle alle Gäste, die auch bei der Verlobung dabei waren!',
    icon: '💖',
    category: 'persoenlich'
  },
  {
    id: 'persoenlich-gleicher-ort',
    title: 'Gruppenfoto mit allen Gästen, die im gleichen Ort wie das Paar wohnen.',
    description: 'Finde alle Nachbarn und Ortsansässigen!',
    icon: '💖',
    category: 'persoenlich'
  },
  {
    id: 'persoenlich-urlaub-mit-paar',
    title: 'Mach ein Bild mit allen, die schon mal mit dem Brautpaar im Urlaub waren.',
    description: 'Sammle alle Reisegefährten des Brautpaars!',
    icon: '💖',
    category: 'persoenlich'
  },

  // 🤳 Selfie- und Gruppen-Challenges
  {
    id: 'selfie-neue-bekanntschaft',
    title: 'Mach ein Selfie mit jemandem, den du erst heute kennengelernt hast.',
    description: 'Lerne jemanden Neues kennen und mache ein Selfie!',
    icon: '🤳',
    category: 'selfie'
  },
  {
    id: 'selfie-auffaelligstes-outfit',
    title: 'Fotografiere dich mit der Person mit dem auffälligsten Outfit.',
    description: 'Finde das schrillste Outfit und mache ein Selfie!',
    icon: '🤳',
    category: 'selfie'
  },
  {
    id: 'selfie-mit-brautpaar',
    title: 'Mach ein Selfie mit dem Brautpaar.',
    description: 'Das Brautpaar freut sich über ein Selfie mit dir!',
    icon: '🤳',
    category: 'selfie'
  },
  {
    id: 'selfie-aeltester-juengster',
    title: 'Knipse ein Foto mit dem ältesten und dem jüngsten Gast zusammen.',
    description: 'Verbinde die Generationen in einem Foto!',
    icon: '🤳',
    category: 'selfie'
  },
  {
    id: 'selfie-lachende-gaeste',
    title: 'Mach ein Gruppenfoto mit mindestens fünf lachenden Gästen.',
    description: 'Sammle alle fröhlichen Gesichter für ein lustiges Foto!',
    icon: '🤳',
    category: 'selfie'
  },

  // 🎶 Stimmungs- und Tanzmomente
  {
    id: 'stimmung-tanzendes-paar',
    title: 'Fotografiere ein Paar, das gerade tanzt.',
    description: 'Halte den romantischen Tanzmoment fest!',
    icon: '🎶',
    category: 'stimmung'
  },
  {
    id: 'stimmung-boomerang-erster-tanz',
    title: 'Mach ein Boomerang-Video vom ersten Tanz.',
    description: 'Erstelle ein lustiges Boomerang vom ersten Tanz!',
    icon: '🎶',
    category: 'stimmung'
  },
  {
    id: 'stimmung-witzigster-tanzmove',
    title: 'Knipse den witzigsten Tanzmove des Abends.',
    description: 'Fange den lustigsten Tanzmoment ein!',
    icon: '🎶',
    category: 'stimmung'
  },
  {
    id: 'stimmung-vollste-tanzflaeche',
    title: 'Fotografiere die vollste Tanzfläche des Abends.',
    description: 'Halte den Moment fest, wenn alle tanzen!',
    icon: '🎶',
    category: 'stimmung'
  },
  {
    id: 'stimmung-selfie-mit-dj',
    title: 'Mach ein Selfie mit dem DJ oder der Band.',
    description: 'Zeige deine Wertschätzung für die Musik!',
    icon: '🎶',
    category: 'stimmung'
  },

  // 🌸 Kreative Szenen
  {
    id: 'kreativ-drink-des-abends',
    title: 'Mach ein Foto von deinem Drink des Abends.',
    description: 'Zeige deinen Lieblingsdrink in einem schönen Foto!',
    icon: '🌸',
    category: 'kreativ'
  },
  {
    id: 'kreativ-schoenster-gedeckter-tisch',
    title: 'Knipse ein Foto vom schönsten gedeckten Tisch.',
    description: 'Finde den am schönsten gedeckten Tisch!',
    icon: '🌸',
    category: 'kreativ'
  },
  {
    id: 'kreativ-schoenste-blume',
    title: 'Finde die schönste Blume der Deko und fotografiere sie.',
    description: 'Entdecke die schönste Blume der Dekoration!',
    icon: '🌸',
    category: 'kreativ'
  },
  {
    id: 'kreativ-lieblingsdetail',
    title: 'Mach ein Bild von deinem Lieblingsdetail der Hochzeit.',
    description: 'Was ist dein persönliches Highlight der Feier?',
    icon: '🌸',
    category: 'kreativ'
  },
  {
    id: 'kreativ-spektakulaerster-schuh',
    title: 'Fotografiere den spektakulärsten Schuh des Abends.',
    description: 'Finde den auffälligsten Schuh der Feier!',
    icon: '🌸',
    category: 'kreativ'
  },

  // 😂 Action- und Spaßaufgaben
  {
    id: 'action-lachender-gast',
    title: 'Mache ein Foto, während jemand herzlich lacht.',
    description: 'Fange einen echten Lachmoment ein!',
    icon: '😂',
    category: 'action'
  },
  {
    id: 'action-emotionaler-moment',
    title: 'Fange einen emotionalen Moment zwischen Braut und Bräutigam ein.',
    description: 'Halte die Liebe zwischen den beiden fest!',
    icon: '😂',
    category: 'action'
  },
  {
    id: 'action-erstes-kuchenstueck',
    title: 'Fotografiere das erste Stück Kuchen, das angeschnitten wird.',
    description: 'Halte den traditionellen Moment des Kuchenschneidens fest!',
    icon: '😂',
    category: 'action'
  },
  {
    id: 'action-lustiger-selfie-spiegel',
    title: 'Mach ein Foto von einem lustigen Selfie-Spiegel-Moment.',
    description: 'Finde den Selfie-Spiegel und mache ein lustiges Foto!',
    icon: '😂',
    category: 'action'
  },
  {
    id: 'action-dessert-stibitzen',
    title: 'Knipse jemanden, der heimlich ein Dessert stibitzt.',
    description: 'Fange den süßen Diebstahl auf Foto fest!',
    icon: '😂',
    category: 'action'
  },

  // 🤳 Selfie-Highlights
  {
    id: 'highlights-verrueckteste-frisur',
    title: 'Mach ein Selfie mit der Person, die die verrückteste Frisur hat.',
    description: 'Finde die kreativste Frisur der Feier!',
    icon: '🤳',
    category: 'highlights'
  },
  {
    id: 'highlights-geburtstag',
    title: 'Selfie mit jemandem, der heute Geburtstag hat.',
    description: 'Gratuliere dem Geburtstagskind mit einem Selfie!',
    icon: '🤳',
    category: 'highlights'
  },
  {
    id: 'highlights-auffaelliges-accessoire',
    title: 'Mach ein Selfie mit einem Gast, der ein auffälliges Accessoire trägt (z. B. Hut, Kette, Armband).',
    description: 'Finde das schönste Accessoire der Feier!',
    icon: '🤳',
    category: 'highlights'
  },
  {
    id: 'highlights-lautester-lacher',
    title: 'Selfie mit der Person, die am lautesten lacht.',
    description: 'Finde den fröhlichsten Gast der Feier!',
    icon: '🤳',
    category: 'highlights'
  },
  {
    id: 'highlights-gleiche-lieblingsfarbe',
    title: 'Mach ein Selfie mit jemandem, der die gleiche Lieblingsfarbe hat wie du.',
    description: 'Entdecke deinen Farbzwilling!',
    icon: '🤳',
    category: 'highlights'
  },
  {
    id: 'highlights-neue-bekanntschaft-heute',
    title: 'Mach ein Selfie mit einem Gast, den du erst heute kennengelernt hast.',
    description: 'Lerne jemanden Neues kennen!',
    icon: '🤳',
    category: 'highlights'
  },
  {
    id: 'highlights-tanzen-koennen',
    title: 'Selfie mit jemandem, der tatsächlich tanzen kann.',
    description: 'Finde den besten Tänzer der Feier!',
    icon: '🤳',
    category: 'highlights'
  },
  {
    id: 'highlights-meiste-tanzrunden',
    title: 'Selfie mit dem Gast, der die meisten Runden auf der Tanzfläche gedreht hat.',
    description: 'Finde den tanzbegeistertesten Gast!',
    icon: '🤳',
    category: 'highlights'
  },
  {
    id: 'highlights-bester-toast',
    title: 'Selfie mit dem Gast, der den besten Toast oder Spruch gesagt hat.',
    description: 'Zeige deine Wertschätzung für den besten Redner!',
    icon: '🤳',
    category: 'highlights'
  },
  {
    id: 'highlights-besonders-gute-laune',
    title: 'Mach ein Selfie mit jemandem, der heute besonders gute Laune hat.',
    description: 'Finde den fröhlichsten Gast der Feier!',
    icon: '🤳',
    category: 'highlights'
  },

  // 📷 Einzel- oder Moment-Aufnahmen
  {
    id: 'einzel-aeltester-gast',
    title: 'Fotografiere den ältesten Gast der Feier.',
    description: 'Halte den ältesten Gast in einem schönen Foto fest!',
    icon: '📷',
    category: 'einzel'
  },
  {
    id: 'einzel-juengster-gast',
    title: 'Mach ein Foto vom jüngsten Gast (gern mit Eltern).',
    description: 'Fotografiere den jüngsten Gast der Feier!',
    icon: '📷',
    category: 'einzel'
  },
  {
    id: 'einzel-witziger-tanzmove',
    title: 'Knipse ein Foto von jemandem, der gerade einen witzigen Tanzmove macht.',
    description: 'Fange den lustigsten Tanzmoment ein!',
    icon: '📷',
    category: 'einzel'
  },
  {
    id: 'einzel-drinks-mixen',
    title: 'Mach ein Foto von jemandem, der an der Bar Drinks mixt.',
    description: 'Halte den professionellen Bartender fest!',
    icon: '📷',
    category: 'einzel'
  },
  {
    id: 'einzel-besonderer-snack',
    title: 'Fotografiere einen Gast, der gerade einen besonderen Snack probiert.',
    description: 'Fange den Genussmoment ein!',
    icon: '📷',
    category: 'einzel'
  },
  {
    id: 'einzel-konfetti-werfen',
    title: 'Halte den Moment fest, wenn jemand mit Konfetti wirft.',
    description: 'Fange den Konfetti-Moment ein!',
    icon: '📷',
    category: 'einzel'
  },
  {
    id: 'einzel-mit-kindern-spielen',
    title: 'Knipse jemanden, der mit Kindern spielt.',
    description: 'Halte den süßen Moment mit Kindern fest!',
    icon: '📷',
    category: 'einzel'
  },
  {
    id: 'einzel-brautpaar-umarmung',
    title: 'Mach ein Foto von einem Gast, der das Brautpaar umarmt.',
    description: 'Halte die herzliche Umarmung fest!',
    icon: '📷',
    category: 'einzel'
  },
  {
    id: 'einzel-geschenk-uebergeben',
    title: 'Fotografiere jemanden, der gerade ein Geschenk übergibt.',
    description: 'Halte den Geschenk-Moment fest!',
    icon: '📷',
    category: 'einzel'
  },
  {
    id: 'einzel-emotionaler-gast-rede',
    title: 'Knipse einen Gast, der besonders emotional bei einer Rede wird.',
    description: 'Fange den emotionalen Moment ein!',
    icon: '📷',
    category: 'einzel'
  }
]
