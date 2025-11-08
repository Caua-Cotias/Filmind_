"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

const TMDB_API = process.env.NEXT_PUBLIC_TMDB_KEY;

export default function BrowsePage() {
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    const res = await fetch(
      `https://api.themoviedb.org/3/trending/all/week?api_key=${TMDB_API}&language=pt-BR&page=${page}`
    );

    const data = await res.json();
    setItems((prev) => [...prev, ...data.results]);
    setPage((prev) => prev + 1);
    setLoading(false);
  }, [page, loading]);

  // Carregar na entrada
  useEffect(() => {
    loadMore();
  }, []);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 1 }
    );

    const el = document.getElementById("scroll-trigger");
    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Explorar Conteúdo</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
        {items.map((media) => (
          <div
            key={media.id}
            className="relative group cursor-pointer rounded-xl overflow-hidden border border-gray-700 hover:border-green-400 transition"
          >
            <Image
              src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
              alt={media.title || media.name}
              width={300}
              height={450}
              className="w-full h-auto group-hover:scale-110 transition duration-300"
            />

            {/* Overlay ao passar mouse */}
            <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-2">
              <p className="text-xs line-clamp-2 mb-2">
                {media.title || media.name}
              </p>

              <button
                className="w-full bg-green-500 hover:bg-green-600 py-1 rounded text-xs"
                onClick={() => {
                  // TODO: abrir modal AddMedia com prefetch de metadados
                }}
              >
                Adicionar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div id="scroll-trigger" className="h-10"></div>

      {loading && (
        <p className="text-center text-gray-400 mt-4">Carregando...</p>
      )}
    </div>
  );
}
