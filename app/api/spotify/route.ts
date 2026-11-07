import {getSpotifyShowcase} from '../../../lib/spotify-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Public read-only data. Playlist/account changes have no web endpoint.
export async function GET() {
  return Response.json(await getSpotifyShowcase(), {headers: {'Cache-Control': 'public, max-age=300, s-maxage=900, stale-while-revalidate=3600'}});
}
