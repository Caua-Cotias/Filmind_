// src/lib/posts.ts
const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export interface Post {
  id: number;
  titulo: string;
  genero: string;
  sinopse: string;
  qualityVideo: string;
  codecAudio: string;
  wallpaper: string;
  poster: string;
  type: "movie" | "tv";
}

/**
 * Lista de lançamentos recentes de filmes (TMDB)
 */
export async function getPosts(limit = 10): Promise<Post[]> {
  const res = await fetch(
    `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=pt-BR&page=1`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    throw new Error("Erro ao buscar filmes do TMDB");
  }

  const data = await res.json();

    return data.results.slice(0, limit).map((movie: any) => ({
    id: movie.id,
    titulo: movie.title,
    genero: movie.genre_ids.join(", "),
    sinopse: movie.overview,
    qualityVideo: "1080p",
    codecAudio: "Dolby Digital",
    wallpaper: movie.backdrop_path
      ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
      : "",
    poster: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "",
    type: "movie",
    source: "tmdb", // 👈 aqui também
  }));
}

/**
 * Busca detalhes de um FILME pelo ID do TMDB
 */
export async function getPostById(id: number): Promise<Post | null> {
  const res = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=pt-BR`,
    { cache: "no-store" }
  );
  if (!res.ok) return null;

  const data = await res.json();

  return {
    id: data.id,
    titulo: data.title,
    genero: data.genres?.map((g: any) => g.name).join(", ") || "",
    sinopse: data.overview,
    qualityVideo: "1080p",
    codecAudio: "Dolby Digital",
    wallpaper: data.backdrop_path
      ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
      : "",
    poster: data.poster_path
      ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
      : "",
    type: "movie",
  };
}

/**
 * Busca detalhes de uma SÉRIE pelo ID do TMDB
 */
export async function getPostByIdTV(id: number): Promise<Post | null> {
  const res = await fetch(
    `${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=pt-BR`,
    { cache: "no-store" }
  );
  if (!res.ok) return null;

  const data = await res.json();

  return {
    id: data.id,
    titulo: data.name,
    genero: data.genres?.map((g: any) => g.name).join(", ") || "",
    sinopse: data.overview,
    qualityVideo: "1080p",
    codecAudio: "Dolby Digital",
    wallpaper: data.backdrop_path
      ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
      : "",
    poster: data.poster_path
      ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
      : "",
    type: "tv",
  };
}
