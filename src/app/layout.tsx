import type { Metadata } from 'next'
import { Inter, Dancing_Script } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const dancingScript = Dancing_Script({ 
  subsets: ['latin'],
  variable: '--font-dancing-script'
})

export const metadata: Metadata = {
  title: 'Celina und Vedad - Foto-Upload',
  description: 'Lade deine Fotos für Celina und Vedad hoch',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className={`${inter.className} ${dancingScript.variable}`}>{children}</body>
    </html>
  )
}
