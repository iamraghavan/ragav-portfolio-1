import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve, dirname} from 'node:path';
import {runInNewContext} from 'node:vm';
import ts from 'typescript';

// Run the actual route with isolated configuration and a mocked email provider.
function route({env = {}, fetch = () => {throw new Error('Unexpected provider call');}} = {}) {
  function load(file) {
    const module = {exports: {}};
    const code = ts.transpileModule(readFileSync(file, 'utf8'), {compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022}}).outputText;
    runInNewContext(code, {module, exports: module.exports, require: specifier => load(resolve(dirname(file), specifier + '.ts')), process: {env}, Request, Response, URL, AbortSignal, fetch, console: {error() {}}});
    return module.exports;
  }
  return load(resolve('app/api/contact/route.ts')).POST;
}

const enquiry = {name: 'Test Visitor', email: 'visitor@example.com', topic: 'A collaboration', message: 'I would like to discuss a project.', website: ''};
const request = (body, origin = 'http://localhost:3000') => new Request('http://localhost:3000/api/contact', {method: 'POST', headers: {'Content-Type': 'application/json', Origin: origin}, body: JSON.stringify(body)});

test('sends to the configured inbox with visitor as Reply-To', async () => {
  let sent;
  const POST = route({env: {RESEND_API_KEY: 'test-key', CONTACT_FROM_EMAIL: 'Ragav <contact@example.com>', CONTACT_TO_EMAIL: 'owner@example.com'}, fetch: async (url, options) => {
    assert.equal(url, 'https://api.resend.com/emails');
    assert.equal(options.headers.Authorization, 'Bearer test-key');
    sent = JSON.parse(options.body);
    return Response.json({id: 'mock-email-id'});
  }});
  const response = await POST(request(enquiry));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).ok, true);
  assert.deepEqual(Array.from(sent.to), ['owner@example.com']);
  assert.equal(sent.reply_to, enquiry.email);
  assert.equal(sent.from, 'Ragav <contact@example.com>');
  assert.ok(sent.text.includes(enquiry.message));
});

test('rejects invalid fields and cross-origin requests before contacting provider', async () => {
  const POST = route();
  for (const invalid of [{...enquiry, email: 'invalid'}, {...enquiry, message: 'short'}, {...enquiry, topic: 'unexpected'}, {...enquiry, name: 'Injected\r\nName'}]) {
    assert.equal((await POST(request(invalid))).status, 400);
  }
  assert.equal((await POST(request(enquiry, 'https://other.example'))).status, 403);
  assert.equal((await POST(new Request('http://localhost:3000/api/contact', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: '{broken'}))).status, 400);
});

test('does not report success when email configuration is absent', async () => {
  const response = await route()(request(enquiry));
  assert.equal(response.status, 503);
  assert.ok((await response.json()).error);
});

test('provider rejection and network errors produce an actionable failure', async () => {
  const env = {RESEND_API_KEY: 'test-key', CONTACT_FROM_EMAIL: 'contact@example.com'};
  for (const fetch of [async () => Response.json({error: 'rejected'}, {status: 403}), async () => {throw new Error('Offline');}]) {
    const response = await route({env, fetch})(request(enquiry));
    assert.equal(response.status, 502);
    assert.ok((await response.json()).error);
  }
});

test('honeypot submissions never call the email provider', async () => {
  assert.equal((await route()(request({...enquiry, website: 'spam.example'}))).status, 200);
});
