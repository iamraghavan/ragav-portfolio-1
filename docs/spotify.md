# Personal Spotify showcase

The homepage shows the owner's five long-term top tracks, their original album
artwork, Spotify links and a click-to-load embedded player. Visitors never
authorize an account and cannot modify the owner's Spotify account.

`data/spotify-top-tracks.json` contains a real saved selection and the public
showcase playlist URL. This file contains only public music metadata, no account
tokens. The selection remains visible without Spotify credentials on deployment.

## Refresh the selection manually

Keep a current Spotify token with the `user-top-read` scope in `.env.local`:

```dotenv
SPOTIFY_ACCESS_TOKEN=your_private_token
```

Run:

```sh
node --env-file=.env.local scripts/sync-spotify.mjs
```

Commit the updated public snapshot and redeploy. The token is deliberately
excluded from Git. Never put it into a client component, public file or a
`NEXT_PUBLIC_` environment variable. Replace the token originally shared in chat
before using credentials for deployment.

## Live refresh

For automatic refresh, create a Spotify developer app and use its authorization
code flow to authorize your own account with `user-top-read`. Keep the client ID,
client secret and the resulting refresh token in server-only environment variables:

```dotenv
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REFRESH_TOKEN=your_refresh_token
```

Add them locally or to the relevant Vercel environment and restart/redeploy.
The read-only `/api/spotify` endpoint refreshes credentials server-side, strips
the account response down to display fields and caches the result for 15 minutes.
It uses the saved selection if credentials expire or Spotify is unavailable.
No API credentials are returned to the browser. Reauthorize when Spotify expires
or revokes a refresh token.

## Playlist and listening

The owner's maintenance script supports `--create-playlist`, which additionally
requires `playlist-modify-public`. It creates a public `Ragav | Top 5` playlist
and adds the five selected tracks. This is an explicit owner command, never a
public button or automatic effect of viewing the site. A saved playlist is a
snapshot; a future live top-track refresh does not silently modify it.

The playlist has already been created and populated. Avoid creating duplicates:
the script reuses the recorded playlist rather than creating another one.
Playback uses Spotify's official embeds and is subject to the listener's account,
region and content availability. The site does not promise unrestricted full-song
playback or auto-play.

References:
- https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
- https://developer.spotify.com/documentation/web-api/tutorials/refreshing-tokens
- https://developer.spotify.com/documentation/web-api/reference/create-playlist
- https://developer.spotify.com/documentation/embeds/tutorials/creating-an-embed
