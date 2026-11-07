import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve, dirname} from 'node:path';
import {runInNewContext} from 'node:vm';
import ts from 'typescript';

function loadSpotify({env = {}, fetch = () => {throw new Error('Unexpected network request');}} = {}) {
  const modules = new Map();
  function load(file) {
    if (file.endsWith('.json')) return JSON.parse(readFileSync(file, 'utf8'));
    if (modules.has(file)) return modules.get(file).exports;
    const module = {exports: {}};
    modules.set(file, module);
    const code = ts.transpileModule(readFileSync(file, 'utf8'), {compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true}}).outputText;
    runInNewContext(code, {module, exports: module.exports, require: path => load(resolve(dirname(file), path.endsWith('.json') ? path : path + '.ts')), process: {env}, Buffer, URLSearchParams, Date, Response, AbortSignal, fetch});
    return module.exports;
  }
  return load(resolve('lib/spotify-server.ts')).getSpotifyShowcase;
}

test('saved real songs remain visible without account credentials', async () => {
  const result = await loadSpotify()();
  assert.equal(result.source, 'saved');
  assert.equal(result.tracks.length, 5);
  assert.equal(result.tracks[0].name, 'Anbe Anbe');
  assert.ok(result.playlist.url.startsWith('https://open.spotify.com/playlist/'));
});

test('expired Spotify credentials fall back without leaking errors or tokens', async () => {
  const secret = 'secret-test-token';
  const result = await loadSpotify({env: {SPOTIFY_ACCESS_TOKEN: secret}, fetch: async () => Response.json({error: {message: secret}}, {status: 401})})();
  assert.equal(result.source, 'saved');
  assert.equal(JSON.stringify(result).includes(secret), false);
  assert.equal(result.tracks.length, 5);
});

test('concurrent readers share a single request and only public fields are returned', async () => {
  let requests = 0;
  const get = loadSpotify({env: {SPOTIFY_ACCESS_TOKEN: 'private-token'}, fetch: async (url, options) => {
    requests++;
    assert.ok(url.includes('limit=5'));
    assert.equal(options.headers.Authorization, 'Bearer private-token');
    return Response.json({private_field: 'not-public', items: [{id: '5fdKNHHTgu4rtE9PMR2sRB', name: 'Anbe Anbe', artists: [{name: 'Harris Jayaraj'}], album: {name: 'Album', images: []}, duration_ms: 1000}]});
  }});
  const [first, second] = await Promise.all([get(), get()]);
  await get();
  assert.equal(requests, 1);
  assert.equal(first.source, 'live');
  assert.equal(second.tracks[0].name, 'Anbe Anbe');
  assert.equal(first.tracks[0].image, null);
  assert.equal(JSON.stringify(first).includes('not-public'), false);
});

test('refresh credentials stay on the server and replace the temporary token', async () => {
  const calls = [];
  const get = loadSpotify({env: {SPOTIFY_CLIENT_ID: 'client', SPOTIFY_CLIENT_SECRET: 'secret', SPOTIFY_REFRESH_TOKEN: 'refresh'}, fetch: async (url, options) => {
    calls.push(url);
    if (url.includes('accounts.spotify.com')) return Response.json({access_token: 'renewed-private-token', expires_in: 3600});
    assert.equal(options.headers.Authorization, 'Bearer renewed-private-token');
    return Response.json({items: []});
  }});
  const result = await get();
  assert.equal(calls.length, 2);
  assert.equal(result.source, 'saved');
  assert.equal(JSON.stringify(result).includes('renewed-private-token'), false);
});
