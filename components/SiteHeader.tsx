'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {ArrowUpRight, Menu, X} from 'lucide-react';
import BrandLogo from './BrandLogo';

const links = [{label: 'Home', href: '/'}, {label: 'My work', href: '/work'}, {label: 'Media & events', href: '/#media'}, {label: 'Templates & assets', href: '/templates'}, {label: 'About', href: '/#about'}];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [activeHash, setActiveHash] = useState('');
  const pathname = usePathname();
  useEffect(() => {
    const syncHash = () => setActiveHash(window.location.hash);
    syncHash();
    window.addEventListener('hashchange', syncHash);
    window.addEventListener('popstate', syncHash);
    return () => {
      window.removeEventListener('hashchange', syncHash);
      window.removeEventListener('popstate', syncHash);
    };
  }, [pathname]);
  function navigate(href: string) {
    setOpen(false);
    setActiveHash(href.includes('#') ? '#' + href.split('#')[1] : '');
  }
  function isActive(href: string) {
    if (href.includes('#')) return pathname === '/' && activeHash === '#' + href.split('#')[1];
    if (href === '/') return pathname === '/' && !['#media', '#about', '#contact'].includes(activeHash);
    return pathname === href || pathname.startsWith(href + '/');
  }
  return <header id="top" className="site-header" onKeyDown={event => {if (event.key === 'Escape') {setOpen(false); document.getElementById('site-menu-toggle')?.focus();}}}>
    <Link href="/" className="brand" aria-label="Ragav home" onClick={() => navigate('/')}><BrandLogo/></Link>
    <button id="site-menu-toggle" className="site-menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="site-navigation" onClick={() => setOpen(!open)}>{open ? <X size={22}/> : <Menu size={22}/>}</button>
    <nav id="site-navigation" aria-label="Main navigation" className={'site-navigation' + (open ? ' is-open' : '')}>
      {links.map(link => <Link key={link.href} href={link.href} aria-current={isActive(link.href) ? (link.href.includes('#') ? 'location' : 'page') : undefined} onClick={() => navigate(link.href)}>{link.label}</Link>)}
      <Link href="/resume" className="site-resume" aria-current={isActive('/resume') ? 'page' : undefined} onClick={() => navigate('/resume')}>Resume <ArrowUpRight size={14}/></Link>
      <Link href="/#contact" className="site-contact" aria-current={isActive('/#contact') ? 'location' : undefined} onClick={() => navigate('/#contact')}>Let’s talk <ArrowUpRight size={16}/></Link>
    </nav>
  </header>;
}
