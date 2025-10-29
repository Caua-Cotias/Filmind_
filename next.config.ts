import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "image.tmdb.org",
      "lh3.googleusercontent.com",
      "cdn-icons-png.flaticon.com"
    ], // aqui você coloca o domínio da imagem
  },
}

export default nextConfig
