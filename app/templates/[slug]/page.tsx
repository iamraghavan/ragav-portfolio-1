import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {ArrowLeft, ArrowUpRight, Check, Download, Mail} from 'lucide-react';
import {digitalAssets} from '../../../lib/digital-assets';
import AssetPreview from '../../../components/AssetPreview';
import {site} from '../../../lib/site';

type Props = {params: Promise<{slug: string}>};
export function generateStaticParams() {return digitalAssets.map(({slug}) => ({slug}));}
export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params;
  const asset = digitalAssets.find(item => item.slug === slug);
  if (!asset) notFound();
  return {title: asset.title, description: asset.description, alternates: {canonical: site.origin + '/templates/' + slug}};
}

export default async function AssetPage({params}: Props) {
  const {slug} = await params;
  const asset = digitalAssets.find(item => item.slug === slug);
  if (!asset) notFound();
  const related = digitalAssets.filter(item => item.slug !== slug && item.category === asset.category);
  return <main id="templates-main" className="assets-page"><Link href="/templates" className="asset-return"><ArrowLeft size={16}/> Back to the collection</Link><div className="asset-detail"><section className="asset-detail-visual"><AssetPreview asset={asset}/><p>{asset.access === 'Free' ? 'Design preview · Download the source file below to customise it.' : 'Concept preview · Final design and contents may change.'}</p></section><section className="asset-detail-copy"><p className="overline">{asset.category} / {asset.access === 'Free' ? 'FREE RESOURCE' : 'UPCOMING PAID COLLECTION'}</p><h1>{asset.title}</h1><p className="asset-description">{asset.description}</p><div className="asset-purchase"><div><strong>{asset.access === 'Free' ? 'Free' : 'Coming soon'}</strong><span>{asset.access === 'Free' ? 'No sign-up required' : 'Pricing to be announced'}</span></div><span className="asset-format">{asset.format}</span></div>{asset.download ? <a className="button primary asset-download" href={asset.download} download>Download free <Download size={18}/></a> : <><a className="button primary asset-download" href={'mailto:raghavanofficials@gmail.com?subject=' + encodeURIComponent('Interested in ' + asset.title) + '&body=' + encodeURIComponent('Hi Raghavan,\n\nI would like to know when ' + asset.title + ' becomes available.\n\nThanks!')}>Ask about this collection <Mail size={18}/></a><p className="asset-action-note">Opens an email draft. No purchase or payment is available yet.</p></>}<h2>{asset.access === 'Free' ? 'What’s included' : 'What’s planned'}</h2><ul className="asset-includes">{asset.includes.map(item => <li key={item}><Check size={16}/>{item}</li>)}</ul></section></div><div className="asset-detail-info"><section><p className="overline">GETTING STARTED</p><h2>{asset.access === 'Free' ? 'Make it your own.' : 'On the drawing board.'}</h2><p>{asset.instructions}</p>{asset.download && <a href={asset.download} target="_blank" rel="noopener noreferrer" className="asset-text-link">Open source file in a new tab <ArrowUpRight size={15}/></a>}</section><section><p className="overline">{asset.access === 'Free' ? 'USAGE & LICENSE' : 'AVAILABILITY'}</p><h2>{asset.access === 'Free' ? 'Create with confidence.' : 'A preview of what’s next.'}</h2><p>{asset.access === 'Free' ? 'Use and modify this free resource in personal and commercial projects, including client work. Attribution is appreciated, not required. Do not resell or redistribute the source file as a standalone template. Provided as-is, without warranty.' : 'This listing describes a planned product. The complete files are not available yet. Contact me to discuss the concept or a custom alternative.'}</p>{asset.access === 'Free' && <a href="/downloads/LICENSE.txt" className="asset-text-link" download>Download the free resource license <Download size={15}/></a>}</section></div><section className="asset-related"><h2>Keep exploring.</h2>{related.map(item => <Link key={item.slug} href={'/templates/' + item.slug}><span>{item.title}<small>{item.access === 'Free' ? 'Free download' : 'Paid · coming soon'}</small></span><ArrowUpRight size={20}/></Link>)}</section></main>;
}
