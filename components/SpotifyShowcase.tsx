'use client';

import {useEffect, useState} from 'react';
import {ArrowUpRight, Play, Headphones, Music2, X} from 'lucide-react';
import snapshot from '../data/spotify-top-tracks.json';
import type {SpotifyShowcase} from '../lib/spotify';
import './SpotifyShowcase.css';

export default function SpotifyShowcase() {
  const [data, setData] = useState<SpotifyShowcase>({...snapshot, source: 'saved'});
  const [selected, setSelected] = useState<{type: 'track' | 'playlist'; id: string; name: string} | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/spotify', {signal: controller.signal}).then(response => response.ok ? response.json() : null).then(result => {if (result && Array.isArray(result.tracks)) setData(result);}).catch(() => {});
    return () => controller.abort();
  }, []);
  const updated = new Intl.DateTimeFormat('en-IN', {day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata'}).format(new Date(data.updatedAt));
  return <section id="music" className="section spotify-section" aria-labelledby="spotify-heading"><div className="spotify-layout"><div className="spotify-story"><p className="overline"><Headphones size={15}/> Headphones on. World off.</p><h2 id="spotify-heading">My taste.<br/><em>Zero skips.</em></h2><p>My kind of downtime: headphones on, favourite songs queued, and &ldquo;just one more listen&rdquo; for the tenth time. These five know the repeat button very well.</p><div className="spotify-attribution"><span className="spotify-dot"/> My Spotify top 5 <span>Long-term listening</span></div>{data.playlist && <a className="spotify-playlist-link" href={data.playlist.url} target="_blank" rel="noopener noreferrer">Open my Top 5 playlist <ArrowUpRight size={17}/></a>}<p className="spotify-updated">{data.source === 'live' ? 'Synced from Spotify' : 'Saved from Spotify'} · {updated}</p></div>
      <div className="spotify-collection"><div className="spotify-list-heading"><span>THE PERSONAL SOUNDTRACK</span><Music2 size={17}/></div><ol className="spotify-track-list">{data.tracks.map((track, index) => <li key={track.id} className={selected?.id === track.id ? 'is-selected' : undefined}><button className="spotify-track-select" onClick={() => setSelected({type: 'track', id: track.id, name: track.name})} aria-label={'Listen to ' + track.name + ' by ' + track.artists} aria-pressed={selected?.id === track.id}><span className="spotify-rank">0{index + 1}</span>{track.image ? <img src={track.image} alt={track.album + ' album artwork'} width={58} height={58} loading="lazy"/> : <span className="spotify-art-fallback"><Music2 size={24}/></span>}<span className="spotify-track-copy"><strong>{track.name}</strong><span>{track.artists}</span></span><span className="spotify-track-play"><Play size={15} fill="currentColor"/></span></button><a className="spotify-track-external" href={track.url} target="_blank" rel="noopener noreferrer" aria-label={'Open ' + track.name + ' in Spotify'}><ArrowUpRight size={16}/></a></li>)}</ol>
        <div className="spotify-list-bottom"><span>Five songs. A suspicious number of replays.</span>{data.playlist && <button onClick={() => setSelected({type: 'playlist', id: data.playlist!.id, name: 'Ragav | Top 5'})}>Listen here <Headphones size={15}/></button>}</div>
      </div></div>
    <div className="spotify-player-area" aria-live="polite">{selected ? <><div className="spotify-player-label"><span>Spotify player / {selected.name}</span><button onClick={() => setSelected(null)} aria-label="Close Spotify player"><X size={17}/></button></div><iframe key={selected.type + selected.id} title={'Spotify player: ' + selected.name} src={'https://open.spotify.com/embed/' + selected.type + '/' + selected.id + '?utm_source=generator&theme=0'} width="100%" height={selected.type === 'playlist' ? 352 : 152} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/><p>Playback is provided by Spotify. Availability and full playback depend on Spotify, your account and region.</p></> : <p className="spotify-player-prompt"><Play size={15}/> Pick a track to load the Spotify player right here.</p>}</div>
  </section>;
}
