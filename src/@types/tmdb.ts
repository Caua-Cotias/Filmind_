type TMDBData = {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  genres?: { id: number; name: string }[];
  poster_path?: string;
  backdrop_path?: string;
};

type MediaRecord = {
  id: string | number;
  title?: string | null;
  synopsis?: string | null;
  genres?: string | null;
  posterUrl?: string | null;
  wallpaperUrl?: string | null;
  qualityVideo?: string | null;
  codecAudio?: string | null;
};
