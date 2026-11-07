import type {Metadata} from 'next';
import Link from 'next/link';
import {ArrowLeft, ArrowUpRight} from 'lucide-react';
import {caseStudies} from '../../lib/case-studies';
import {site} from '../../lib/site';

export const metadata: Metadata = {
  title: 'Selected work | Ragav',
  description: 'Explore J.S. Raghavan’s work in admission advertising, organic search and CRM conversion improvements.',
  alternates: {canonical: site.origin + '/work'},
};

export default function WorkPage() {
  return <>


    <main id="work-main" className="case-page">
      <div className="case-heading"><p className="overline">Selected work · EGS Pillay Group of Institutions</p><h1>Behind the work.<br/><em>Beyond the numbers.</em></h1><p>A closer look at how I connect marketing, websites and admission systems to support growth.</p></div>
      <div className="case-grid">{caseStudies.map((study, i) => <Link className="case-card" href={'/work/' + study.slug} key={study.slug}>
        <span className="overline">0{i + 1} / {study.category}</span><div className="case-card-metric">{study.metric}<span>{study.metricLabel}</span></div><h2>{study.title}</h2><p>{study.summary}</p><span className="case-card-link">Read case study <ArrowUpRight size={18}/></span>
      </Link>)}</div>
      <section className="case-cta"><div><h2>Have a similar challenge?</h2><p>Let’s talk about your campaign, website or enquiry journey.</p></div><Link href="/#contact" className="button primary">Get in touch <ArrowUpRight size={18}/></Link></section>
    </main>
  </>;
}
