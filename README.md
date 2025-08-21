# Celina & Vedad - Hochzeits-Galerie

Eine elegante Hochzeits-Galerie-Plattform, auf der Gäste ihre Fotos hochladen und Challenges absolvieren können.

## 🚀 Deployment auf Vercel

### Voraussetzungen

1. **Vercel Account** - [vercel.com](https://vercel.com)
2. **GitHub Repository** - Code muss auf GitHub sein
3. **MinIO Server** - Für Bilderspeicherung

### Schritt-für-Schritt Deployment

#### 1. Code auf GitHub pushen
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

#### 2. Vercel Dashboard öffnen
- Gehe zu [vercel.com/dashboard](https://vercel.com/dashboard)
- Klicke "New Project"
- Importiere dein GitHub Repository

#### 3. Environment Variables setzen
Im Vercel Dashboard unter "Settings" → "Environment Variables":

```bash
# MinIO Configuration
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
```

#### 4. Deploy starten
- Klicke "Deploy"
- Warte auf den Build-Prozess
- Deine App ist live! 🎉

### 🔧 Build-Konfiguration

- **Framework**: Next.js 15
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 📱 Features

- **Responsive Design** - Funktioniert auf allen Geräten
- **Challenge-System** - 70 verschiedene Foto-Challenges
- **MinIO Integration** - Sichere Bilderspeicherung
- **User-Specific Galleries** - Jeder sieht nur seine eigenen Bilder
- **Modern UI** - Glass-Effekte und Pastell-Farben

### 🚨 Wichtige Hinweise

1. **Environment Variables** müssen in Vercel gesetzt werden
2. **MinIO Server** muss öffentlich erreichbar sein
3. **CORS** muss für deine Vercel-Domain konfiguriert sein
4. **HTTPS** ist für MinIO erforderlich

### 🔍 Troubleshooting

#### Build-Fehler
- Überprüfe alle Environment Variables
- Stelle sicher, dass alle Dependencies installiert sind

#### MinIO-Verbindungsfehler
- Überprüfe MinIO-Endpoint und Credentials
- Stelle sicher, dass der MinIO-Server läuft
- Überprüfe CORS-Einstellungen

#### Runtime-Fehler
- Überprüfe die Vercel-Logs
- Stelle sicher, dass alle API-Routes funktionieren

### 📞 Support

Bei Problemen:
1. Überprüfe die Vercel-Logs
2. Teste die API-Routes lokal
3. Überprüfe MinIO-Verbindung

---

**Viel Erfolg beim Deployment! 🎊✨**
