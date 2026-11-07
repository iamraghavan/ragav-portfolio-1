'use client';

import {useState} from 'react';
import Link from 'next/link';
import {ArrowRight, Check, LoaderCircle} from 'lucide-react';
import {contactTopics} from '../lib/contact';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending') return;
    const form = event.currentTarget;
    const fields = Object.fromEntries(new FormData(form));
    setStatus('sending');
    setError('');
    try {
      const response = await fetch('/api/contact', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(fields), signal: AbortSignal.timeout(20000)});
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || 'Your message could not be sent. Please try again.');
      form.reset();
      setStatus('success');
    } catch (caught) {
      setStatus('error');
      setError(caught instanceof Error && caught.name !== 'TimeoutError' ? caught.message : 'Sending took too long. Please try again or email me directly.');
    }
  }
  return <form className="contact-form" onSubmit={submit} aria-busy={status === 'sending'}>
    <h3>Tell me about the opportunity</h3>
    <fieldset disabled={status === 'sending'} className="contact-fields"><legend className="sr-only">Your enquiry</legend>
      <div className="form-row"><label>Your name<input name="name" required minLength={2} maxLength={100} autoComplete="name" placeholder="Name"/></label><label>Email address<input name="email" required type="email" maxLength={254} autoComplete="email" placeholder="you@company.com"/></label></div>
      <label>What would you like to discuss?<select name="topic">{contactTopics.map(topic => <option key={topic}>{topic}</option>)}</select></label>
      <label>Your message<textarea name="message" required minLength={10} maxLength={5000} rows={4} placeholder="A few details about the role, your team or your project…"/></label>
      <div className="contact-honeypot" aria-hidden="true"><label>Leave this field empty<input name="website" type="text" tabIndex={-1} autoComplete="off"/></label></div>
      <button className="button primary" type="submit" disabled={status === 'sending'}>{status === 'sending' ? <>Sending… <LoaderCircle size={17}/></> : <>Send message <ArrowRight size={17}/></>}</button>
    </fieldset>
    {status === 'success' && <p className="contact-feedback contact-success" role="status"><Check size={17}/> Thanks! Your message has been sent. I’ll get back to you by email.</p>}
    {status === 'error' && <p className="contact-feedback contact-error" role="alert">{error} You can also email <a href="mailto:raghavanofficials@gmail.com">raghavanofficials@gmail.com</a>.</p>}
    <p className="form-note">Your details are used to respond to your enquiry. <Link href="/policies#privacy">Privacy policy</Link></p>
  </form>;
}
