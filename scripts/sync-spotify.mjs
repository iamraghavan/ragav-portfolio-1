import {readFile, writeFile, mkdir} from 'node:fs/promises';

// Owner-only maintenance command. Never exposed as a public HTTP endpoint.
// node --env-file=.env.local scripts/sync-spotify.mjs [--create-playlist]
async function getToken() {
  if (process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET && process.env.SPOTIFY_REFRESH_TOKEN) {
    const response = await fetch('https://accounts.spotify.com/api/token', {method: 'POST', headers: {Authorization: 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'), 'Content-Type': 'application/x-www-form-urlencoded'}, body: new URLSearchParams({grant_type: 'refresh_token', refresh_token: process.env.SPOTIFY_REFRESH_TOKEN}), signal: AbortSignal.timeout(12000)});
    if (!response.ok) throw new Error('Spotify token refresh failed. Check your private credentials.');
    return (await response.json()).access_token;
  }
  if (!process.env.SPOTIFY_ACCESS_TOKEN) throw new Error('Set SPOTIFY_ACCESS_TOKEN or refresh credentials in .env.local.');
  return process.env.SPOTIFY_ACCESS_TOKEN;
}

async function main() {
  const token = await getToken();
  async function api(path, method = 'GET', body) {
    const response = await fetch('https://api.spotify.com/v1/' + path, {method, headers: {Authorization: 'Bearer ' + token, 'Content-Type': 'application/json'}, body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(12000)});
    if (!response.ok) throw new Error(`Spotify returned ${response.status}. Check token expiry and required scopes. No credentials were logged.`);
    return response.json();
  }
  const data = await api('me/top/tracks?time_range=long_term&limit=5');
  if (!Array.isArray(data.items) || data.items.length === 0) throw new Error('Spotify returned no top tracks.');
  const tracks = data.items.filter(track => /^[a-zA-Z0-9]{22}$/.test(track.id)).map(track => ({id: track.id, name: track.name, artists: track.artists.map(artist => artist.name).join(', '), album: track.album.name, image: track.album.images?.[0]?.url || null, url: 'https://open.spotify.com/track/' + track.id, durationMs: track.duration_ms}));
  let playlist = null;
  let playlistReady = false;
  const snapshotPath = new URL('../data/spotify-top-tracks.json', import.meta.url);
  try {
    const previous = JSON.parse(await readFile(snapshotPath, 'utf8'));
    playlist = previous.playlist || null;
    playlistReady = previous.playlistReady === true;
  } catch {}
  // Write the track snapshot even if playlist scopes have not been granted.
  const snapshot = {tracks, playlist, playlistReady, updatedAt: new Date().toISOString(), timeRange: 'long_term'};
  await mkdir(new URL('../data/', import.meta.url), {recursive: true});
  await writeFile(snapshotPath, JSON.stringify(snapshot, null, 2) + '\n');
  console.log(`Saved ${tracks.length} public track records. No account tokens were included.`);
  if (process.argv.includes('--create-playlist')) {
    if (playlist) {
      if (!playlistReady) {
        await api('playlists/' + playlist.id + '/items', 'PUT', {uris: tracks.map(track => 'spotify:track:' + track.id)});
        await writeFile(snapshotPath, JSON.stringify({...snapshot, playlistReady: true}, null, 2) + '\n');
      }
      console.log('A showcase playlist already exists. Keeping it: ' + playlist.url);
      return;
    }
    const created = await api('me/playlists', 'POST', {name: 'Ragav | Top 5', public: true, description: 'Five of my long-term favourite tracks, shared on my personal portfolio.'});
    playlist = {id: created.id, url: 'https://open.spotify.com/playlist/' + created.id};
    // Record the playlist immediately so retries cannot create duplicate playlists.
    await writeFile(snapshotPath, JSON.stringify({...snapshot, playlist, playlistReady: false}, null, 2) + '\n');
    await api('playlists/' + created.id + '/items', 'POST', {uris: tracks.map(track => 'spotify:track:' + track.id)});
    await writeFile(snapshotPath, JSON.stringify({...snapshot, playlist, playlistReady: true}, null, 2) + '\n');
    console.log('Created showcase playlist: ' + playlist.url);
  }
}

main().catch(error => {console.error(error.message); process.exitCode = 1;});
