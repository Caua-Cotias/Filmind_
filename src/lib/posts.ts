// src/lib/posts.ts
const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

interface Post {
  id: number;
  titulo: string;
  genero: string;
  sinopse: string;
  qualityVideo: string;
  codecAudio: string;
  wallpaper: string;
  poster: string;
}

/**
 * Retorna uma lista de lançamentos (filmes recentes) da API TMDB
 */
export async function getPosts(limit = 10): Promise<Post[]> {
  const res = await fetch(
    `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=pt-BR&page=1`,
    { next: { revalidate: 60 * 60 } } // Atualiza a cada 1h
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
    wallpaper: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
    poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
  }));
}

/**
 * Retorna um filme específico pelo ID
 */
export async function getPostById(id: number): Promise<Post | null> {
  const res = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=pt-BR`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    console.error("Filme não encontrado:", id);
    return null;
  }

  const movie = await res.json();

  return {
    id: movie.id,
    titulo: movie.title,
    genero: movie.genres?.map((g: any) => g.name).join(", ") || "",
    sinopse: movie.overview,
    qualityVideo: "1080p",
    codecAudio: "Dolby Digital",
    wallpaper: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
    poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
  };
}
