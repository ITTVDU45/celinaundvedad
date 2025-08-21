/** @type {import('next').NextConfig} */
const nextConfig = {
  // React Compiler deaktiviert für bessere Kompatibilität
  // Bilder von MinIO erlauben
  images: {
    unoptimized: true,
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
  output: 'export',
  // Deaktiviere automatisches Prerendering für dynamische Routen
  trailingSlash: true,
}

module.exports = nextConfig
