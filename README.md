# React Multi App

A small multi-page React app: todo list, notes, contacts, user profile and a weather widget, behind a simple login.

Built with React 19, React Router 7, MobX and Vite.

## Getting started

```bash
npm install
cp .env.example .env   # then put your OpenWeatherMap API key in .env
npm run dev            # http://localhost:3000
```

Test login: `test@gmail.com` / `1234`.

## Scripts

| Command           | What it does                       |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Start the dev server               |
| `npm run build`   | Build for production into `dist/`  |
| `npm run preview` | Serve the production build locally |

## Environment variables

| Name                   | Description                                                |
| ---------------------- | ---------------------------------------------------------- |
| `VITE_WEATHER_API_KEY` | [OpenWeatherMap](https://openweathermap.org/api) API key   |

## Deploy (Netlify)

`netlify.toml` sets the build command (`npm run build`) and publish directory (`dist`).
`public/_redirects` sends every route to `index.html`, so client-side routing works on refresh.
Set `VITE_WEATHER_API_KEY` in the site's environment variables, otherwise the weather search won't work.
