import { defineConfig } from 'astro/config';

export default defineConfig({
  site: process.env.SITE_URL || 'https://raulsrz.com',
  // Mientras la web viva en raul-srz.github.io/portfolio-raulsrz se usa BASE_PATH; con el dominio propio, '/'.
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
