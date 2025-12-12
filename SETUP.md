# Setup-Anleitung: Celina & Vedad Hochzeits-Galerie

## 🚀 Schnellstart

### 1. Dependencies installieren

```bash
npm install
```

### 2. Environment-Datei erstellen

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

⚠️ **Wichtig für Produktion**: Ändere die PINs zu sicheren Werten!  
💡 **Tipp**: PINs können Buchstaben und Zahlen enthalten (3-20 Zeichen).

### 3. MinIO Server starten

#### Option A: Docker (empfohlen)

```bash
docker run -d -p 9000:9000 -p 9001:9001 \
  --name minio \
  -e MINIO_ROOT_USER=minioadmin \
  -e MINIO_ROOT_PASSWORD=minioadmin \
  minio/minio server /data --console-address ":9001"
```

MinIO Console: http://localhost:9001

#### Option B: MinIO Binary

Download von https://min.io/download und ausführen:

```bash
./minio server /data --console-address ":9001"
```

### 4. MinIO Bucket erstellen

1. Öffne MinIO Console: http://localhost:9001
2. Login mit `minioadmin` / `minioadmin`
3. Gehe zu "Buckets" → "Create Bucket"
4. Bucket-Name: `celinaundvedad`
5. Erstelle den Bucket

### 5. Development Server starten

```bash
npm run dev
```

Die App läuft auf: http://localhost:3000

## 🔐 Login-Credentials

### User-Zugang (Gäste)
- **PIN**: `1234` (Standard, änderbar in `.env.local`)
- **Funktion**: Fotos ansehen und herunterladen

### Admin-Zugang (Brautpaar)
- **PIN**: `5678` (Standard, änderbar in `.env.local`)
- **Funktion**: Fotos hochladen und verwalten

💡 **Hinweis**: PINs können aus Buchstaben und Zahlen bestehen (3-20 Zeichen).  
Beispiele: `hochzeit2024`, `CelinaVedad`, `Admin123`, etc.

## 🧪 Testen

### 1. Startseite öffnen
Öffne http://localhost:3000 - Du solltest die PIN-Eingabe sehen.

### 2. Als User einloggen
- PIN eingeben: `1234`
- Du solltest zur User-Galerie weitergeleitet werden
- Wenn noch keine Bilder hochgeladen: "Noch keine Bilder" Meldung

### 3. Als Admin einloggen
- PIN eingeben: `5678`
- Du solltest zum Admin-Bereich weitergeleitet werden
- Teste Upload mit Drag & Drop oder File-Picker
- Prüfe ob Upload erfolgreich ist
- Prüfe ob Bild in der Liste erscheint

### 4. Downloads testen
- Logge als User ein
- Klicke auf ein Bild → sollte heruntergeladen werden
- Klicke "Alle herunterladen" → ZIP-Download sollte starten

## ⚙️ MinIO CORS konfigurieren (für externe Zugriffe)

Wenn MinIO auf einem anderen Server läuft:

```bash
mc alias set myminio http://localhost:9000 minioadmin minioadmin
mc admin config set myminio api cors_allow_origin="http://localhost:3000,https://deine-vercel-app.vercel.app"
mc admin service restart myminio
```

Oder über die MinIO Console:
1. Settings → API
2. Füge CORS Origins hinzu

## 🐛 Häufige Probleme

### MinIO Connection Failed
**Problem**: `Error: connect ECONNREFUSED 127.0.0.1:9000`

**Lösung**: 
- Stelle sicher, dass MinIO läuft: `docker ps` oder MinIO Console öffnen
- Prüfe MINIO_ENDPOINT in `.env.local`

### Ungültige PIN
**Problem**: "Ungültige PIN" obwohl PIN korrekt ist

**Lösung**:
- Prüfe `.env.local` auf Tippfehler
- Restart Development Server: `Ctrl+C` dann `npm run dev`
- Browser-Cache/Cookies löschen

### Bilder werden nicht angezeigt
**Problem**: Bilder erscheinen nicht in der Galerie

**Lösung**:
- Prüfe ob Bucket `celinaundvedad` existiert
- Prüfe ob Bilder im Ordner `admin-uploads/` liegen (MinIO Console)
- Prüfe Browser-Console auf CORS-Fehler

### Upload schlägt fehl
**Problem**: Upload-Fehler beim Hochladen

**Lösung**:
- Prüfe Datei-Größe (max 300 MB per default)
- Prüfe Datei-Typ (nur erlaubte MIME-Types)
- Prüfe MinIO-Verbindung und Credentials

## 📦 Produktions-Deployment

Siehe [README.md](./README.md) für Vercel Deployment Anweisungen.

**Wichtige Schritte**:
1. MinIO mit HTTPS aufsetzen
2. Sichere PINs in Vercel ENV setzen
3. CORS für Vercel-Domain konfigurieren
4. Environment Variables in Vercel setzen
5. Deploy und testen

## 🎨 Anpassungen

### PINs ändern
Bearbeite `.env.local`:
```bash
USER_PIN=deine-neue-user-pin
ADMIN_PIN=deine-neue-admin-pin
```

PINs können alphanumerisch sein (Buchstaben + Zahlen, 3-20 Zeichen):
- `hochzeit2025`
- `CelinaUndVedad!`
- `Admin@123`

### Upload-Limits ändern
Bearbeite `.env.local`:
```bash
UPLOAD_MAX_MB=500  # Max 500 MB pro Datei
```

### Erlaubte Dateitypen ändern
Bearbeite `.env.local`:
```bash
UPLOAD_ALLOWED_MIME=image/jpeg,image/png,video/mp4
```

## 📞 Hilfe

Bei Fragen oder Problemen:
1. Prüfe diese Setup-Anleitung
2. Lese [README.md](./README.md) für weitere Details
3. Prüfe Browser-Console und Server-Logs
4. Teste MinIO-Verbindung separat

---

**Viel Erfolg! 🎊✨**

