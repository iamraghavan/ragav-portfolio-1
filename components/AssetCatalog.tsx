'use client';

import {useState} from 'react';
import Link from 'next/link';
import {ArrowUpRight, Search, X} from 'lucide-react';
import {digitalAssets} from '../lib/digital-assets';
import AssetPreview from './AssetPreview';

export default function AssetCatalog() {
  const [access, setAccess] = useState('All');
  const [category, setCategory] = useState('All categories');
  const [query, setQuery] = useState('');
  const filtered = digitalAssets.filter(asset => (access === 'All' || access === asset.access) && (category === 'All categories' || category === asset.category) && (asset.title + ' ' + asset.description + ' ' + asset.format).toLowerCase().includes(query.toLowerCase().trim()));
  function reset() {setAccess('All'); setCategory('All categories'); setQuery('');}
  return <section id="asset-catalog" aria-label="Browse digital assets">
    <div className="asset-filters"><div className="asset-access" role="group" aria-label="Availability">{['All', 'Free', 'Paid'].map(value => <button key={value} onClick={() => setAccess(value)} aria-pressed={access === value}>{value === 'Paid' ? 'Paid · coming soon' : value}</button>)}</div><div className="asset-search"><Search size={16}/><input aria-label="Search templates and assets" placeholder="Search the collection…" value={query} onChange={e => setQuery(e.target.value)}/>{query && <button aria-label="Clear search" onClick={() => setQuery('')}><X size={15}/></button>}</div><select aria-label="Filter by category" value={category} onChange={e => setCategory(e.target.value)}>{['All categories', 'Web templates', 'Marketing', 'Design assets'].map(value => <option key={value}>{value}</option>)}</select></div>
    <p className="asset-count" role="status" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'resource' : 'resources'}{access === 'Paid' ? ' · Concept previews, not yet for sale' : ' · Made to give you a head start'}</p>
    <div className="asset-grid">{filtered.map(asset => <Link className="asset-card" href={'/templates/' + asset.slug} key={asset.slug}><div className="asset-card-image"><AssetPreview asset={asset}/><span className={'asset-badge ' + (asset.access === 'Free' ? 'asset-free' : 'asset-paid')}>{asset.access === 'Free' ? 'Free download' : 'Paid · coming soon'}</span></div><div className="asset-card-content"><p className="asset-category">{asset.category} <span>↗</span></p><h2>{asset.title}</h2><p>{asset.description}</p><div className="asset-card-bottom"><span>{asset.format}</span><span>{asset.access === 'Free' ? 'View & download' : 'View concept'} <ArrowUpRight size={15}/></span></div></div></Link>)}</div>
    {filtered.length === 0 && <div className="asset-empty"><h2>No matching resources.</h2><p>Try another search or explore the complete collection.</p><button className="button primary" onClick={reset}>Clear filters</button></div>}
  </section>;
}
