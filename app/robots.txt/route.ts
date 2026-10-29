import {site} from '../../lib/site';
export function GET(){return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${site.origin}/sitemap.xml\n`,{headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'public, max-age=3600'}})}
