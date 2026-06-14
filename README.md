# zachs-site

A personal React + TypeScript SPA built with Vite, deployed to Cloudflare Pages.

**Live site:** https://zachs-site.pages.dev

## Accessing the site

The site is password-protected. Visiting the URL will redirect to a login page — enter the password to gain access. A session cookie is set on successful login and lasts 7 days, after which you'll be prompted again.

## How the auth gate works

A Cloudflare Pages Function (`functions/_middleware.js`) intercepts every request at the edge. Unauthenticated requests are redirected to `/login`, which serves a login form. On correct password entry, a signed session cookie is set using an HMAC secret (`COOKIE_SECRET`, also stored in Cloudflare Pages secrets). Subsequent requests validate the cookie signature and expiry before passing through to the static site.

To change the password or rotate the signing secret, update the corresponding values in the Cloudflare Pages dashboard under **Settings → Environment variables** — no redeploy needed.

## Deployment

Pushes to `main` trigger a GitHub Actions workflow that builds the project and deploys to Cloudflare Pages via `cloudflare/pages-action`. The `functions/` directory is picked up automatically alongside the built `dist/` output.

## Local development

```bash
npm install
npm run dev      # Start dev server with HMR at localhost:5173
npm run build    # TypeScript check + Vite production build
npm run lint     # ESLint
npm run preview  # Preview production build locally
```