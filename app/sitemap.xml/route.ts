import {site} from '../../lib/site';
import {caseStudies} from '../../lib/case-studies';
import {digitalAssets} from '../../lib/digital-assets';
export function GET(){return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/','/resume','/work','/templates','/policies',...digitalAssets.map(asset=>'/templates/'+asset.slug),...caseStudies.map(s=>'/work/'+s.slug)].map(path=>`<url><loc>${site.origin}${path}</loc></url>`).join('')}</urlset>`,{headers:{'Content-Type':'application/xml; charset=utf-8','Cache-Control':'public, max-age=3600'}})}
