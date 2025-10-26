import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "ingresso-a.akamaihd.net",
      "youtube.com",
      "imdb.com"
    ], // aqui você coloca o domínio da imagem
  },
}

export default nextConfig
