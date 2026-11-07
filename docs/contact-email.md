# Contact form email setup

The form posts to `/api/contact`. The server sends the enquiry to your inbox
through Resend. Visitors stay on the website and can reply using their own address.
No enquiries are saved in a website database.

## Enable delivery

1. Create an account at https://resend.com and add a domain you own.
2. Add the DNS records provided by Resend and wait for the domain to be verified.
3. Create a Resend API key with permission to send emails.
4. Create `.env.local` in this project with these values:

   ```dotenv
   RESEND_API_KEY=re_your_private_key
   CONTACT_FROM_EMAIL=Ragav Portfolio <contact@your-verified-domain.com>
   CONTACT_TO_EMAIL=raghavanofficials@gmail.com
   ```

   Replace the example values. Use your verified domain for the sender, not a
   visitor's email address or your Gmail address. The visitor's email is Reply-To.
   Keep the API key server-only: never prefix it with `NEXT_PUBLIC_` or commit it.
   `.env.local` is already excluded by `.gitignore`.

5. Restart the local development server. For production, add the same variables
   in Vercel project settings for the relevant environments and redeploy.
6. Submit a real enquiry. Check the recipient inbox, spam folder and Resend
   delivery logs. An API success means the provider accepted the email; mailbox
   delivery can still fail or be delayed.

Without a key and sender, the form returns a clear unavailable message, never
a false success. Resend test senders have account restrictions; use a verified
domain for production. Free/premium resource enquiry links still open an email
draft; this setup applies to the main contact form.

## Checks

Run `node --test tests/contact.test.mjs` to check validation and the email provider
integration using a mock. These tests never send email. The form also includes a
hidden honeypot field and rejects submissions from a different browser origin.

Provider reference: https://resend.com/docs/api-reference/emails/send-email
Domain setup: https://resend.com/docs/dashboard/domains/introduction
