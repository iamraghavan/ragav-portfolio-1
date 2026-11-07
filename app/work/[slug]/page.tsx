import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {ArrowLeft, ArrowUpRight} from 'lucide-react';
import {caseStudies, resultsNote} from '../../../lib/case-studies';
import {site} from '../../../lib/site';

type Props = {params: Promise<{slug: string}>};
export function generateStaticParams() {return caseStudies.map(({slug}) => ({slug}));}
export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params;
  const study = caseStudies.find(s => s.slug === slug);
  if (!study) notFound();
  return {title: study.category + ' case study | Ragav', description: study.summary,
    alternates: {canonical: site.origin + '/work/' + slug},
    openGraph: {title: study.title, description: study.summary, url: site.origin + '/work/' + slug, type: 'article', images: ['/social-card.png']}};
}

export default async function CaseStudyPage({params}: Props) {
  const {slug} = await params;
  const study = caseStudies.find(s => s.slug === slug);
  if (!study) notFound();
  return <>


    <main id="case-main" className="case-page">
      <div className="case-heading"><p className="overline">Case study / {study.category}</p><h1>{study.title}</h1><p>{study.summary}</p></div>
      <div className="case-layout"><article className="case-story">
        <section><p className="overline">01 / The challenge</p><h2>A practical business need.</h2><p>{study.challenge}</p></section>
        <section><p className="overline">02 / My contribution</p><h2>Where I made a difference.</h2><p>{study.contribution}</p></section>
        <section><p className="overline">03 / The approach</p><h2>Connecting the pieces.</h2><ol className="case-steps">{study.steps.map(([title, body]) => <li key={title}><h3>{title}</h3><p>{body}</p></li>)}</ol></section>
      </article><aside className="case-result"><p className="overline">The reported outcome</p><strong>{study.metric}</strong><h2>{study.metricLabel}</h2><p>{study.outcome}</p>{study.slug === 'admission-advertising' && <div className="case-comparison"><div><span>Before</span><b>₹170 / lead</b></div><ArrowUpRight aria-hidden="true" size={22}/><div><span>After</span><b>₹120 / lead</b></div></div>}<div className="case-tools">{study.tools.map(tool => <span key={tool}>{tool}</span>)}</div><p className="case-source">{resultsNote}</p></aside></div>
      <section className="case-cta"><div><p className="overline">Let’s work together</p><h2>Bring your next challenge.</h2><p>Explore a role or discuss a project with me.</p></div><Link href="/#contact" className="button primary">Start a conversation <ArrowUpRight size={18}/></Link></section>
      <nav className="case-related" aria-label="More case studies"><h2>More selected work</h2>{caseStudies.filter(s => s.slug !== slug).map(s => <Link href={'/work/' + s.slug} key={s.slug}><span>{s.category}</span><ArrowUpRight size={18}/></Link>)}</nav>
    </main>
  </>;
}
