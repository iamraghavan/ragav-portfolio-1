import {contactTopics} from '../../../lib/contact';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!request.headers.get('content-type')?.includes('application/json')) return Response.json({error: 'Please submit the contact form.'}, {status: 415});
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return Response.json({error: 'Please submit the form from this website.'}, {status: 403});
  if (Number(request.headers.get('content-length')) > 20000) return Response.json({error: 'Your message is too long.'}, {status: 413});
  let fields: unknown;
  try {fields = await request.json();} catch {return Response.json({error: 'The form could not be read. Please try again.'}, {status: 400});}
  if (!fields || typeof fields !== 'object' || Array.isArray(fields)) return Response.json({error: 'Please complete the contact form.'}, {status: 400});
  const input = fields as Record<string, unknown>;
  if (typeof input.website === 'string' && input.website.trim()) return Response.json({ok: true});
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const email = typeof input.email === 'string' ? input.email.trim() : '';
  const topic = typeof input.topic === 'string' ? input.topic : '';
  const message = typeof input.message === 'string' ? input.message.trim() : '';
  if (name.length < 2 || name.length > 100 || /[\r\n]/.test(name)) return Response.json({error: 'Enter a name between 2 and 100 characters.'}, {status: 400});
  if (email.length > 254 || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) return Response.json({error: 'Enter a valid email address.'}, {status: 400});
  if (!contactTopics.some(value => value === topic)) return Response.json({error: 'Choose a valid enquiry topic.'}, {status: 400});
  if (message.length < 10 || message.length > 5000) return Response.json({error: 'Write a message between 10 and 5,000 characters.'}, {status: 400});
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL || 'raghavanofficials@gmail.com';
  if (!apiKey || !from) return Response.json({error: 'The contact form is temporarily unavailable. Please email me directly.'}, {status: 503});
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json'},
      body: JSON.stringify({from, to: [to], reply_to: email, subject: 'Portfolio enquiry: ' + topic, text: `New portfolio enquiry\n\nName: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${message}`}),
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) {
      console.error('Contact email provider rejected request with status', response.status);
      return Response.json({error: 'Your message could not be sent. Please try again later.'}, {status: 502});
    }
    return Response.json({ok: true});
  } catch {
    return Response.json({error: 'The email service could not be reached. Please try again later.'}, {status: 502});
  }
}
