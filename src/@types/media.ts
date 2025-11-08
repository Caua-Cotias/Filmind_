// src/types/media.ts
import { z } from "zod";

export const TMDBGenreSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const TMDBMovieSchema = z.object({
  id: z.number(),
  title: z.string().optional(),
  overview: z.string().optional(),
  backdrop_path: z.string().nullable().optional(),
  poster_path: z.string().nullable().optional(),
  genres: z.array(TMDBGenreSchema).optional(),
});

export const TMDBTvSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  overview: z.string().optional(),
  backdrop_path: z.string().nullable().optional(),
  poster_path: z.string().nullable().optional(),
  genres: z.array(TMDBGenreSchema).optional(),
});

export type TmdbMovie = z.infer<typeof TMDBMovieSchema>;
export type TmdbTv = z.infer<typeof TMDBTvSchema>;

export type MediaType = "movie" | "tv" | "local";

export type UIPost = {
  id: number | string;        // tmdb id (number) or local id (string/number)
  mediaType: MediaType;
  titulo: string;
  sinopse?: string;
  genero?: string;
  image?: string;
  wallpaper?: string;
  qualityVideo?: string;
  codecAudio?: string;
  logoUrl?: string | null;
};
