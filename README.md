# React Multi App

A small multi-page React app: todo list, notes, contacts, user profile and a weather widget, behind a login.

Built with React 19, React Router 7, MobX and Vite.

## Getting started

```bash
npm install
cp .env.example .env   # then put your OpenWeatherMap API key in .env
npm run dev            # http://localhost:3000
```

Create an account on the **Sign up** page. There are no built-in test accounts.

## Scripts

| Command           | What it does                       |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Start the dev server               |
| `npm run build`   | Build for production into `dist/`  |
| `npm run preview` | Serve the production build locally, with the same security headers as on Vercel |
| `npm run lint`    | Run ESLint (React hooks + accessibility rules) |

## Accounts and data

This is a front-end-only demo: there is no server. Everything is kept in the browser.

- **Passwords are never stored.** Each account keeps a random salt and a PBKDF2-SHA-256 hash (310,000 iterations, Web Crypto API).
- **Sign-up checks**: valid email, account doesn't exist yet, password of at least 8 characters with a letter and a number, not a common password and not containing the email name. A strength meter and a live checklist show what's missing.
- **Login**: one generic "Incorrect email or password" message. After 5 failed attempts, login for that email is paused for 1 minute, with a countdown. A warning shows when 2 attempts are left.
- **Sessions** last 12 hours and end when the tab is closed. With *Remember me* they last 30 days. Logging out in one tab logs out the other tabs too.
- **Data is per account**: todos, notes, contacts and profile are stored under `rma:user:<id>:*`, so two people using the same browser don't see each other's data. *Delete account* (in Profile, needs the password) removes the account and all its data.
- Data from older versions (global `todos` / `notes` / `users` keys) is moved into the first account that logs in. The old plain-text `email` / `password` keys are deleted on start.

> Anyone with access to the browser can read or change `localStorage`, so this protects against casual snooping, not against a determined attacker. A real app needs server-side authentication.

Login needs a secure context (HTTPS or `localhost`), because the Web Crypto API isn't available over plain HTTP.

## Environment variables

| Name                   | Description                                                |
| ---------------------- | ---------------------------------------------------------- |
| `VITE_WEATHER_API_KEY` | [OpenWeatherMap](https://openweathermap.org/api) API key   |

`VITE_*` variables are built into the JavaScript bundle, so this key is visible to anyone who opens the site. That's acceptable for a free OpenWeatherMap key. For a paid key, call the API through a serverless function (e.g. a Vercel Function in `api/`) instead.

## Deploy (Vercel)

1. In Vercel, **Add New → Project** and import the GitHub repository. Pick the branch to deploy as the production branch (Settings → Environments → Production → Branch Tracking), or merge into `main`.
2. Vercel detects Vite automatically; `vercel.json` pins the settings anyway: install `npm ci`, build `npm run build`, output `dist`.
3. In **Settings → Environment Variables**, add `VITE_WEATHER_API_KEY` for Production and Preview. It's read at build time, so **redeploy** after adding or changing it, otherwise the weather search won't work.
4. Node.js: the project needs Node 20.19+ (`engines` in `package.json`); Vercel's default Node version satisfies this.

What `vercel.json` does:

- **SPA rewrite**: every route that isn't a real file is served `index.html`, so links like `/todo` work on refresh and when opened directly.
- **Security headers** on every response: Content-Security-Policy, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`. If you add a new external service (fonts, images, APIs), allow its domain in the CSP there; `npm run preview` uses the same headers, so check it locally first.
- **Caching**: hashed files in `/assets/` are cached for a year (`immutable`); `index.html` is always revalidated, so a new deploy is picked up right away.

Every push to another branch or pull request gets its own Preview deployment with its own URL.

Login needs HTTPS (Web Crypto API). Vercel serves every deployment over HTTPS, so nothing extra is needed.
