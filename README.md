# Celina & Vedad - Hochzeits-Galerie

Eine elegante PIN-geschützte Hochzeits-Galerie mit Admin-Bereich für das Hochladen und Verwalten von Hochzeitsfotos.

## 🔐 System-Übersicht

Die App verwendet ein PIN-basiertes Authentifizierungssystem:
- **User-PIN**: Gäste können Hochzeitsfotos ansehen und herunterladen
- **Admin-PIN**: Das Brautpaar kann Fotos hochladen und verwalten

💡 **PINs können alphanumerisch sein** (Buchstaben und Zahlen, 3-20 Zeichen)  
Beispiele: `hochzeit2024`, `CelinaVedad`, `Admin123`

## 🚀 Lokale Entwicklung

### Voraussetzungen

1. **Node.js 18+** 
2. **MinIO Server** - Für Bilderspeicherung (lokal oder remote)

### Setup

1. **Repository klonen und Dependencies installieren**
```bash
git clone <repository-url>
cd celinaundvedad
npm install
```

2. **Environment Variables konfigurieren**

Erstelle eine `.env.local` Datei im Root-Verzeichnis:

```bash
# MinIO Configuration
MINIO_ENDPOINT=http://localhost:9000
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_BUCKET=celinaundvedad
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin
MINIO_PUBLIC_URL=http://localhost:9000

# Upload Limits
UPLOAD_MAX_MB=300
UPLOAD_ALLOWED_MIME=image/jpeg,image/png,image/heic,image/heif,video/mp4,video/quicktime,application/pdf
PRESIGN_URL_EXPIRY=600

# PIN Configuration
USER_PIN=1234
ADMIN_PIN=5678
```

3. **MinIO lokal starten** (optional)
```bash
docker run -p 9000:9000 -p 9001:9001 \
  -e MINIO_ROOT_USER=minioadmin \
  -e MINIO_ROOT_PASSWORD=minioadmin \
  minio/minio server /data --console-address ":9001"
```

4. **Development Server starten**
```bash
npm run dev
```

Die App läuft auf [http://localhost:3000](http://localhost:3000)

## 📱 Features

- **PIN-Authentifizierung** - Sicherer Zugang für User und Admin
- **User-Ansicht** - Hochzeitsfotos ansehen und herunterladen (einzeln oder alle als ZIP)
- **Admin-Ansicht** - Fotos hochladen, verwalten und löschen (Drag & Drop Support)
- **MinIO Integration** - Sichere S3-kompatible Bilderspeicherung
- **Responsive Design** - Funktioniert auf allen Geräten
- **Modern UI** - Glass-Effekte und elegante Pastell-Farben

## 🔧 Architektur

### Ordnerstruktur

```
src/
├── app/
│   ├── page.tsx                    # Startseite mit PIN-Eingabe
│   ├── user/page.tsx              # User-Galerie (PIN-geschützt)
│   ├── admin/page.tsx             # Admin-Upload (PIN-geschützt)
│   ├── api/
│   │   ├── auth/
│   │   │   ├── validate-pin/     # PIN-Validierung
│   │   │   └── logout/           # Session beenden
│   │   ├── upload/               # Presigned Upload URLs (Admin)
│   │   ├── files/                # Dateiliste (Auth erforderlich)
│   │   └── download/
│   │       ├── [objectName]/     # Einzelbild-Download
│   │       └── all/              # ZIP-Download
│   └── legal/                    # Datenschutz & AGB
├── components/
│   ├── PinEntry.tsx             # PIN-Eingabe Komponente
│   ├── UserGallery.tsx          # User-Galerie mit Downloads
│   └── AdminUpload.tsx          # Admin-Upload-Interface
├── lib/
│   └── minio.ts                 # MinIO Client & Utilities
└── middleware.ts                 # Route-Schutz

```

### MinIO Bucket-Struktur

```
celinaundvedad/
└── admin-uploads/
    ├── 1234567890-foto1.jpg
    ├── 1234567891-foto2.png
    └── ...
```

## 🚀 Deployment auf Vercel

### Voraussetzungen

1. **Vercel Account** - [vercel.com](https://vercel.com)
2. **GitHub Repository** - Code muss auf GitHub sein
3. **MinIO Server** - Produktions-Server mit HTTPS

### Deployment-Schritte

#### 1. Code auf GitHub pushen
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

#### 2. Vercel Projekt erstellen
- Gehe zu [vercel.com/dashboard](https://vercel.com/dashboard)
- Klicke "New Project"
- Importiere dein GitHub Repository

#### 3. Environment Variables setzen

Im Vercel Dashboard unter "Settings" → "Environment Variables":

```bash
# MinIO Configuration (Produktion)
MINIO_ENDPOINT=https://dein-minio-server.com
MINIO_PORT=443
MINIO_USE_SSL=true
MINIO_BUCKET=celinaundvedad
MINIO_ROOT_USER=dein-access-key
MINIO_ROOT_PASSWORD=dein-secret-key
MINIO_PUBLIC_URL=https://dein-minio-server.com

# Upload Limits
UPLOAD_MAX_MB=300
UPLOAD_ALLOWED_MIME=image/jpeg,image/png,image/heic,image/heif,video/mp4,video/quicktime,application/pdf
PRESIGN_URL_EXPIRY=600

# PIN Configuration (WICHTIG: Sichere PINs verwenden!)
USER_PIN=deine-user-pin
ADMIN_PIN=deine-admin-pin
```

⚠️ **Wichtig**: Verwende für die Produktion sichere, lange PINs!  
💡 **Tipp**: PINs können Buchstaben und Zahlen enthalten (3-20 Zeichen).  
Beispiele: `Hochzeit2025!`, `CelinaVedad@123`, `GuestAccess2024`

#### 4. Deploy starten
- Klicke "Deploy"
- Warte auf den Build-Prozess
- Deine App ist live! 🎉

### 🔧 Build-Konfiguration

- **Framework**: Next.js 15
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Node Version**: 18.x oder höher

## 🔒 Sicherheit

### PINs ändern

Um die PINs zu ändern, aktualisiere die Environment Variables:
- Lokal: `.env.local` bearbeiten
- Vercel: Settings → Environment Variables → Neu setzen & Re-Deploy

### Cookie-basierte Authentifizierung

- HttpOnly Cookies verhindern XSS-Angriffe
- SameSite Schutz gegen CSRF
- Middleware schützt `/user` und `/admin` Routes

### MinIO CORS-Konfiguration

Für Produktion muss MinIO CORS erlauben:

```json
[
  {
    "AllowedOrigin": ["https://deine-domain.vercel.app"],
    "AllowedMethod": ["PUT", "GET", "DELETE"],
    "AllowedHeader": ["*"],
    "ExposeHeader": ["ETag", "Location"],
    "MaxAgeSeconds": 3000
  }
]
```

## 🚨 Wichtige Hinweise

1. **Environment Variables** müssen in Vercel gesetzt werden
2. **MinIO Server** muss öffentlich erreichbar sein (HTTPS erforderlich)
3. **CORS** muss für deine Vercel-Domain konfiguriert sein
4. **Sichere PINs** verwenden (nicht 1234/5678 in Produktion!)
5. **Bucket** `celinaundvedad` muss in MinIO existieren

## 🔍 Troubleshooting

### Build-Fehler
- Überprüfe alle Environment Variables
- Stelle sicher, dass alle Dependencies installiert sind (`npm install`)
- Node Version >= 18.x erforderlich

### MinIO-Verbindungsfehler
- Überprüfe MinIO-Endpoint und Credentials in ENV
- Stelle sicher, dass der MinIO-Server läuft und erreichbar ist
- Überprüfe CORS-Einstellungen (Console: `mc admin config get myminio`)
- Teste MinIO-Verbindung mit `mc` CLI

### PIN funktioniert nicht
- Prüfe ob ENV-Variablen richtig gesetzt sind
- Bei Vercel: Nach ENV-Änderung neu deployen
- Browser-Cache/Cookies löschen
- Prüfe Middleware-Logs in Vercel

### Download-Probleme
- Presigned URLs sind nur 10 Minuten gültig
- Prüfe ob Dateien in `admin-uploads/` Ordner liegen
- Browser-Popup-Blocker könnte Downloads blockieren

### Runtime-Fehler
- Überprüfe die Vercel-Logs (Dashboard → Deployments → Functions)
- Teste API-Routes lokal mit `npm run dev`
- Prüfe MinIO-Verbindung und Credentials

## 🧪 Lokales Testen

### API-Endpoints testen

```bash
# PIN validieren
curl -X POST http://localhost:3000/api/auth/validate-pin \
  -H "Content-Type: application/json" \
  -d '{"pin":"1234"}'

# Dateien auflisten (erfordert Cookie)
curl http://localhost:3000/api/files \
  -H "Cookie: auth_role=user"

# ZIP-Download
curl http://localhost:3000/api/download/all \
  -H "Cookie: auth_role=user" \
  --output fotos.zip
```

## 📦 Dependencies

Haupt-Dependencies:
- `next@15.0.0` - React Framework
- `react@18.2.0` - UI Library
- `@aws-sdk/client-s3` - MinIO S3 Client
- `@aws-sdk/s3-request-presigner` - Presigned URLs
- `archiver` - ZIP-Erstellung
- `minio` - MinIO Client
- `tailwindcss` - Styling

## 📝 Changelog

### v2.0.0 (PIN-System)
- ✨ PIN-basierte Authentifizierung (User & Admin)
- 🗑️ Challenge-System entfernt
- 👥 User-Ansicht: Galerie mit Download-Funktionen
- 👨‍💼 Admin-Ansicht: Upload & Verwaltung
- 📦 ZIP-Download aller Bilder
- 🔒 Middleware-basierter Route-Schutz
- 🎨 Modernisiertes UI

### v1.0.0 (Original)
- Namen-basiertes System
- Challenge-Features
- User-spezifische Galerien

## 📞 Support

Bei Problemen:
1. Überprüfe die Vercel-Logs
2. Teste die API-Routes lokal (`npm run dev`)
3. Überprüfe MinIO-Verbindung und CORS
4. Prüfe Browser-Console auf Fehler
5. Stelle sicher, dass alle ENV-Variablen gesetzt sind

## 📄 Lizenz

Private Hochzeits-App für Celina & Vedad

---

**Viel Erfolg beim Deployment! 🎊✨**
