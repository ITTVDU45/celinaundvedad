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
  // Statisches Rendering für Vercel
  output: 'standalone',
  // Deaktiviere automatisches Prerendering für dynamische Routen
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
