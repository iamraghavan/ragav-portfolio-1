import Link from 'next/link';
import {ArrowUp, ArrowUpRight, Code2, MessageCircle} from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function SiteFooter() {
  return <footer className="site-footer"><div className="site-footer-main">
    <div className="site-footer-contact"><p className="overline">HAVE SOMETHING IN MIND?</p><a href="mailto:raghavanofficials@gmail.com">Let’s create something good. <ArrowUpRight size={17}/></a><span>Nagapattinam, Tamil Nadu<br/>Open to opportunities in Chennai.</span><div className="site-footer-social"><a href="https://github.com/iamraghavan" target="_blank" rel="noopener noreferrer"><Code2 size={15}/> GitHub</a><a href="https://wa.me/919942502245" target="_blank" rel="noopener noreferrer"><MessageCircle size={15}/> WhatsApp</a></div></div>
    <div className="site-footer-brand"><Link href="/" className="brand" aria-label="Ragav home"><BrandLogo/></Link><p>Ideas into impact.<br/>Marketing, design & development.</p><span><i/> Open to new opportunities</span></div>
    <nav className="site-footer-explore" aria-label="Footer navigation"><p className="overline">EXPLORE</p><Link href="/work">Selected work <ArrowUpRight size={13}/></Link><Link href="/templates">Templates & assets <ArrowUpRight size={13}/></Link><Link href="/resume">View resume <ArrowUpRight size={13}/></Link><Link href="/#music">My Spotify top 5 <ArrowUpRight size={13}/></Link><Link href="/#about">About Raghavan <ArrowUpRight size={13}/></Link></nav>
  </div><div className="site-footer-bottom"><p>© {new Date().getFullYear()} J.S. Raghavan. All rights reserved.</p><nav aria-label="Policies"><Link href="/policies#privacy">Privacy</Link><Link href="/policies#terms">Terms</Link><Link href="/policies#cookies">Cookies</Link></nav><a href="#top" className="site-back-top">Back to top <ArrowUp size={14}/></a></div></footer>;
}
