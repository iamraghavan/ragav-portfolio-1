export type SpotifyTrack = {id: string; name: string; artists: string; album: string; image: string | null; url: string; durationMs: number};
export type SpotifyShowcase = {tracks: SpotifyTrack[]; playlist: {id: string; url: string} | null; updatedAt: string; timeRange: string; source: 'live' | 'saved'};
