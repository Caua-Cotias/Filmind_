"use client";

import { useState, useEffect } from "react";
import ColorThief from "color-thief-browser";

export function useDominantColor(imageUrl: string) {
  const [color, setColor] = useState<string | null>(null);

  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.crossOrigin = "anonymous"; // necessário para leitura de pixels

    // 🔹 Detecta se é imagem externa e usa proxy se for o caso
    const isExternal = imageUrl.startsWith("http");
    const proxiedUrl = isExternal
      ? `/api/proxy?url=${encodeURIComponent(imageUrl)}`
      : imageUrl;

    img.src = proxiedUrl;

    img.onload = () => {
      try {
        const colorThief = new ColorThief();

        // 🔹 Tenta extrair a paleta e pegar uma cor secundária ou fallback
        const palette = colorThief.getPalette(img, 3);
        const [r, g, b] = palette?.[1] || palette?.[0] || [59, 130, 246];

        setColor(`rgb(${r}, ${g}, ${b})`);
      } catch (err) {
        console.warn("Erro ao extrair cor dominante:", err);
      }
    };

    // 🔹 Limpa a imagem anterior para evitar vazamento de memória
    return () => {
      img.onload = null;
    };
  }, [imageUrl]);

  return color;
}
