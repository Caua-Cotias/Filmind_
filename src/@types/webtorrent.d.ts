declare module "webtorrent" {
  export default class WebTorrent {
    add(
      torrentId: string,
      options?: any,
      callback?: (torrent: Torrent) => void
    ): Torrent;
    destroy(): void;
  }

  export interface Torrent {
    files: TorrentFile[];
    on(event: string, callback: (...args: any[]) => void): void;
    magnetURI: string;
    name: string;
  }

  export interface TorrentFile {
    name: string;
    length: number;
    getBlobURL(
      callback: (err: Error | null, url?: string) => void
    ): void;
    renderTo(
      element: HTMLElement | string,
      options?: any,
      callback?: (err?: Error) => void
    ): void;
  }
}

declare module "webtorrent/dist/webtorrent.min.js" {
  const WebTorrent: any;
  export default WebTorrent;
}