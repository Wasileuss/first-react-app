import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Reuse the site-wide headers from vercel.json for `vite preview`,
// so the Content-Security-Policy can be tested locally before deploying.
function headersFromVercelConfig() {
  const config = JSON.parse(readFileSync(new URL('./vercel.json', import.meta.url), 'utf8'));
  const global = config.headers?.find((rule) => rule.source === '/(.*)');
  return Object.fromEntries((global?.headers ?? []).map(({ key, value }) => [key, value]));
}

export default defineConfig({
  plugins: [react()],
  server: { port: 3000 },
  preview: { headers: headersFromVercelConfig() },
});
