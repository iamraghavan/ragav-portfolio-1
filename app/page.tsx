import type {Metadata} from 'next';
import Portfolio from '../components/Portfolio';
import SchemaScript from '../components/SchemaScript';
import {site} from '../lib/site';
export const metadata:Metadata={alternates:{canonical:site.origin+'/'},openGraph:{title:site.title,description:site.description,url:site.origin+'/',type:'profile',siteName:'Ragav — J.S. Raghavan',locale:'en_IN',images:[{url:'/social-card.png',width:1200,height:630,alt:'J.S. Raghavan — Marketing, design and development'}]}};
export default function Page(){return <><SchemaScript/><Portfolio/></>}
