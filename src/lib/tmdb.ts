// lib/tmdb.ts
const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export async function searchTmdbByTitle(title: string) {
  if (!API_KEY) throw new Error("TMDB_API_KEY missing");
  const q = encodeURIComponent(title);
  const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&language=pt-BR&query=${q}&page=1`);
  if (!res.ok) throw new Error("TMDB search failed");
  return res.json();
}

export async function getTmdbDetailsMovie(id: number) {
  const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=pt-BR`);
  if (!res.ok) throw new Error("TMDB details failed");
  return res.json();
}

export async function getTmdbLogo(id: number, type: "movie" | "tv" = "movie") {
  const res = await fetch(
    `${BASE_URL}/${type}/${id}/images?api_key=${API_KEY}&language=null`,
    { next: { revalidate: 60 * 60 } }
  );
  if (!res.ok) throw new Error("TMDB logo fetch failed");

  const data = await res.json();
  // logos oficiais normalmente vêm no campo "logos"
  const logo = data.logos?.[0]?.file_path || null;
  return logo ? `https://image.tmdb.org/t/p/w500${logo}` : null;
}


async function fetchFromTMDB(endpoint: string, page = 1, limit = 10) {
  const res = await fetch(
    `${BASE_URL}${endpoint}?api_key=${API_KEY}&language=pt-BR&page=${page}`,
    { next: { revalidate: 60 * 60 } }
  );

  const data = await res.json();

  // ⚡ Busca logos em paralelo
  const results = await Promise.all(
    data.results.slice(0, limit).map(async (item: any) => {
      const type = endpoint.includes("/tv") ? "tv" : "movie";
      const logoUrl = await getTmdbLogo(item.id, type);

      return {
        id: item.id,
        titulo: item.title || item.name,
        genero: item.genre_ids.join(", "),
        sinopse: item.overview,
        qualityVideo: "1080p",
        codecAudio: "Dolby Digital",
        wallpaper: `https://image.tmdb.org/t/p/original${item.backdrop_path}`,
        image: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
        logoUrl,
      };
    })
  );

  return results;
}


// 🔹 Filmes populares
export const getPopularMovies = (page = 1, limit = 10) =>
  fetchFromTMDB("/movie/popular", page, limit);

// 🔹 Séries populares
export const getPopularSeries = (page = 1, limit = 10) =>
  fetchFromTMDB("/tv/popular", page, limit);

// 🔹 Lançamentos recentes
export const getUpcomingMovies = (page = 1, limit = 10) =>
  fetchFromTMDB("/movie/upcoming", page, limit);