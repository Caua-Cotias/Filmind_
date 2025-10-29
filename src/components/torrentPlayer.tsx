'use client';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';


const TorrentPlayer = ({ magnet }: { magnet: string }) => {
const videoRef = useRef<HTMLVideoElement>(null);
const [status, setStatus] = useState('Carregando...');


useEffect(() => {
if (!magnet) return;


const load = async () => {
const WebTorrent = (await import('webtorrent')).default;
const client = new WebTorrent();


setStatus('Conectando aos peers...');


client.add(magnet, (torrent) => {
const file = torrent.files.find((f) => f.name.endsWith('.mp4'));
if (!file) {
setStatus('Nenhum arquivo de vídeo encontrado.');
return;
}


setStatus('Iniciando reprodução...');
file.renderTo(videoRef.current!);


torrent.on('download', () => {
const progress = (torrent.progress * 100).toFixed(1);
setStatus(`Baixando: ${progress}% - Peers: ${torrent.numPeers}`);
});


torrent.on('done', () => setStatus('Download completo.'));
});


return () => client.destroy();
};


load();
}, [magnet]);


return (
<div className="flex flex-col items-center gap-3">
<video ref={videoRef} controls autoPlay className="w-full rounded-lg shadow" />
<p className="text-sm text-gray-400">{status}</p>
</div>
);
};


export default dynamic(() => Promise.resolve(TorrentPlayer), { ssr: false });