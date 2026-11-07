import type {Metadata} from 'next';
import Link from 'next/link';
import {ArrowDown, ArrowUpRight, Download, PencilLine, Layers} from 'lucide-react';
import AssetCatalog from '../../components/AssetCatalog';
import {site} from '../../lib/site';

export const metadata: Metadata = {title: 'Templates & digital assets', description: 'Free website templates, marketing planners and editable design assets by Ragav. Explore upcoming paid collections.', alternates: {canonical: site.origin + '/templates'}};

export default function TemplatesPage() {
  return <main id="templates-main" className="assets-page"><section className="assets-hero"><div><p className="overline">THE RESOURCE STUDIO / BY RAGAV</p><h1>A head start for<br/><em>your next idea.</em></h1><p>Templates, tools and little creative shortcuts for people who build, market and make things happen.</p><a href="#asset-catalog" className="button primary">Explore the collection <ArrowDown size={17}/></a></div><aside className="assets-hero-note"><span className="assets-note-number">01—06</span><p>A small collection.<br/>Plenty of possibilities.</p><span>3 free resources to use today.<br/>3 paid concepts on the drawing board.</span></aside></section><div className="assets-benefits"><span><Download size={16}/> Direct free downloads</span><span><PencilLine size={16}/> Editable source files</span><span><Layers size={16}/> Personal & commercial projects</span></div><AssetCatalog/><section className="assets-custom"><div><p className="overline">SOMETHING MORE PERSONAL?</p><h2>Your idea.<br/><em>Built around you.</em></h2><p>Need a custom website, campaign template or design asset? Let’s discuss what you have in mind.</p></div><Link href="/#contact" className="button primary">Let’s make it happen <ArrowUpRight size={18}/></Link></section></main>;
}
