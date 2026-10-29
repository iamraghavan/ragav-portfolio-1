# Ragav portfolio — Vercel edition

Standard Next.js App Router, TypeScript and Tailwind CSS. This is a separate deployment copy of the Ragav Sites portfolio. The live Sites project has not been modified.

Includes the Ragav header/footer logo, Rj favicon sizes, local fonts, portrait placeholder, campaign links, SEO metadata, structured data, robots.txt, sitemap.xml and original resume PDF with viewer/download page.

## Run locally

Install Node.js 22 LTS and Git. Open this folder in VS Code's terminal:

```bash
npm ci
npm run dev
```

Open http://localhost:3000. Production check: `npm run build`.

## Push to your GitHub account

Create an empty GitHub repository called `ragav-portfolio`. Do not initialize it with a README, license or .gitignore. Replace YOUR_USERNAME below with your GitHub username.

```bash
git init
git add .
git commit -m "Initial Ragav portfolio"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ragav-portfolio.git
git push -u origin main
```

If Git asks for authentication, sign in with GitHub's browser or credential-manager flow. GitHub account passwords are not used for Git pushes.

## Deploy through Vercel

1. Sign in to https://vercel.com with GitHub.
2. Choose Add New > Project, then import your `ragav-portfolio` repository.
3. Framework: Next.js. Root directory: folder containing package.json. Build: npm run build. Leave output directory at its Next.js default. Node.js: 22.x.
4. Click Deploy. This deployment is separate from ChatGPT Sites sharing settings.
5. Open the resulting production URL. Verify the homepage, /resume, /robots.txt and /sitemap.xml.

The application uses Vercel's production-domain environment variable for canonical URLs automatically. If you want to explicitly choose a custom domain, add `NEXT_PUBLIC_SITE_URL=https://your-domain.com` under Project > Settings > Environment Variables and redeploy. Do not set the example placeholder as a real value. Include https:// and omit the trailing slash. For local development, it defaults to http://localhost:3000.

## Publish later updates

```bash
git add .
git commit -m "Update portfolio content"
git push
```

Vercel builds each connected Git push. The production branch (normally main) updates the production site; other branches receive preview deployments.

## SEO after migration

- Canonical URLs, sitemap links and JSON-LD all use the configured production origin.
- Once you have a final production domain, verify it in Google Search Console and submit /sitemap.xml.
- Decide which site is the primary portfolio if you keep both Vercel and ChatGPT Sites online. Their SEO configuration must point to the intended primary origin to avoid competing copies.
- No Search Console submission or public Vercel deployment was performed during this export.

## Portrait

`components/HeroPortrait.tsx` contains the portrait asset setting. Add your supplied photograph to public/ and update that setting.

## Contact

The form opens a mailto draft. It does not send mail through a backend or store submissions. No API keys are required for the existing portfolio.

## References

- https://vercel.com/docs/frameworks/full-stack/nextjs
- https://vercel.com/docs/git/vercel-for-github
- https://vercel.com/docs/environment-variables/system-environment-variables
