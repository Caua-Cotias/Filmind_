export interface UIPost {
  id: number | string;
  titulo: string;
  sinopse: string;
  genero: string;
  image: string;
  qualityVideo?: string;
  codecAudio?: string;
  type?: "movie" | "tv";
  source?: "local" | "tmdb"; // 👈 novo campo indicando origem
}
