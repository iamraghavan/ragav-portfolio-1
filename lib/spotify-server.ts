import snapshot from '../data/spotify-top-tracks.json';
import type {SpotifyShowcase, SpotifyTrack} from './spotify';

let cached: {value: SpotifyShowcase; expiresAt: number} | undefined;
let pending: Promise<SpotifyShowcase> | undefined;
let access: {token: string; expiresAt: number} | undefined;

async function getAccessToken() {
  if (access && access.expiresAt > Date.now()) return access.token;
  const {SPOTIFY_CLIENT_ID: client, SPOTIFY_CLIENT_SECRET: secret, SPOTIFY_REFRESH_TOKEN: refresh} = process.env;
  if (client && secret && refresh) {
    const response = await fetch('https://accounts.spotify.com/api/token', {method: 'POST', headers: {Authorization: 'Basic ' + Buffer.from(client + ':' + secret).toString('base64'), 'Content-Type': 'application/x-www-form-urlencoded'}, body: new URLSearchParams({grant_type: 'refresh_token', refresh_token: refresh}), cache: 'no-store', signal: AbortSignal.timeout(8000)});
    if (!response.ok) throw new Error('Spotify refresh unavailable');
    const result = await response.json();
    if (typeof result.access_token !== 'string') throw new Error('Spotify token unavailable');
    access = {token: result.access_token, expiresAt: Date.now() + Math.max(0, (Number(result.expires_in) || 3600) - 60) * 1000};
    return access.token;
  }
  return process.env.SPOTIFY_ACCESS_TOKEN;
}

async function refreshShowcase(): Promise<SpotifyShowcase> {
  const saved: SpotifyShowcase = {...snapshot, source: 'saved'};
  try {
    const token = await getAccessToken();
    if (!token) return saved;
    const response = await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=5', {headers: {Authorization: 'Bearer ' + token}, cache: 'no-store', signal: AbortSignal.timeout(8000)});
    if (!response.ok) return cached ? {...cached.value, source: 'saved'} : saved;
    const result = await response.json();
    if (!Array.isArray(result.items) || result.items.length === 0) return saved;
    const tracks: SpotifyTrack[] = result.items.slice(0, 5).filter((track: {id?: string}) => typeof track.id === 'string' && /^[a-zA-Z0-9]{22}$/.test(track.id)).map((track: {id: string; name: string; artists: {name: string}[]; album: {name: string; images?: {url: string}[]}; duration_ms: number}) => ({id: track.id, name: track.name, artists: track.artists.map(artist => artist.name).join(', '), album: track.album.name, image: track.album.images?.[0]?.url || null, url: 'https://open.spotify.com/track/' + track.id, durationMs: track.duration_ms}));
    return tracks.length ? {...saved, tracks, updatedAt: new Date().toISOString(), source: 'live'} : saved;
  } catch {
    return cached ? {...cached.value, source: 'saved'} : saved;
  }
}

export async function getSpotifyShowcase(): Promise<SpotifyShowcase> {
  if (cached && cached.expiresAt > Date.now()) return cached.value;
  if (!pending) pending = refreshShowcase().then(value => {
    cached = {value, expiresAt: Date.now() + 15 * 60 * 1000};
    return value;
  }).finally(() => {pending = undefined;});
  return pending;
}
