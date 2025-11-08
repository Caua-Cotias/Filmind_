export interface Post {
  id: number | string;
  titulo: string;
  sinopse: string;
  genero: string;
  image: string;
  qualityVideo?: string;
  codecAudio?: string;
}
