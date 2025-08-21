/** @type {import('next').NextConfig} */
const nextConfig = {
  // React Compiler deaktiviert für bessere Kompatibilität
  // Bilder von MinIO erlauben
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'minio-server-m1e0.onrender.com',
        port: '443',
        pathname: '/celinaundvedad/**',
      },
    ],
  },
  // Hybrid-Lösung: Standalone für API-Routes, aber statisches Rendering für Seiten
  output: 'standalone',
}

module.exports = nextConfig
