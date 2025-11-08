
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/audio.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

import { MediaPlayer, MediaProvider, Poster, Track, TrackProps } from "@vidstack/react"
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default';

export default function Vidstack(){
    return(
        <div className='flex w-screen h-screen items-center justify-center'>
            <div className='w-3/6'>
                <MediaPlayer
                    src="http://localhost:3000/hls/output.m3u8"
                    viewType='video'
                    streamType='on-demand'
                    logLevel='warn'
                    crossOrigin
                    playsInline
                    title=''
                    >
                    <MediaProvider>
                        <Poster className="vds-poster" />
                    </MediaProvider>
                    <DefaultVideoLayout
                        icons={defaultLayoutIcons}
                    />
                </MediaPlayer>
            </div>
        </div>
    );
}