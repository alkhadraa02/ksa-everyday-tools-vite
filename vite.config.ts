import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'

const SITE = (process.env.VITE_SITE_URL ?? 'http://localhost:3112').replace(/\/$/, '')
const ROUTES = [
  '/',
  '/hijri',
  '/vat',
  '/zakat',
  '/end-of-service',
  '/gosi',
  '/age',
  '/date-diff',
  '/number-to-words',
]

function seoFiles(): Plugin {
  return {
    name: 'seo-files',
    generateBundle() {
      const urls = ROUTES.map((r) => `  <url><loc>${SITE}${r === '/' ? '/' : r}</loc></url>`).join('\n')
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      })
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`,
      })
      this.emitFile({
        type: 'asset',
        fileName: 'llms.txt',
        source:
          '# أدوات يومية\n\n> حاسبات سعودية تعمل بالكامل في المتصفح: محوّل هجري/ميلادي، ضريبة القيمة المضافة 15%، الزكاة، مكافأة نهاية الخدمة، التأمينات الاجتماعية، العمر وفرق التواريخ، والأرقام بالحروف.\n\n' +
          ROUTES.map((r) => `- ${SITE}${r}`).join('\n') +
          '\n',
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), seoFiles()],
  server: { port: 3112, strictPort: true },
  preview: { port: 3112, strictPort: true },
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
})
