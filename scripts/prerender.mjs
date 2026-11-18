/*
 * Pré-renderização: roda depois do `vite build` e grava em `dist/` um HTML por
 * página, com o <head> próprio (título, descrição, canonical, Open Graph e
 * JSON-LD) e o texto da página já dentro do #root, para os buscadores lerem
 * sem depender de JavaScript. Gera também o sitemap.xml e, quando o AdSense
 * está configurado, o ads.txt.
 *
 *    node --env-file-if-exists=.env scripts/prerender.mjs
 *
 * As páginas dos desafios vêm do banco (os dias já liberados). Sem as
 * variáveis do Supabase, ou se a busca falhar, saem só as páginas fixas.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { registerHooks } from 'node:module'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// O Node já roda TypeScript; falta só achar os imports sem extensão.
registerHooks({
   resolve(specifier, context, nextResolve) {
      try {
         return nextResolve(specifier, context)
      } catch (error) {
         if (!specifier.startsWith('.')) throw error
         try {
            return nextResolve(specifier + '.ts', context)
         } catch {
            return nextResolve(specifier + '/index.ts', context)
         }
      }
   },
})

const {
   SITE_URL,
   SITE_NAME,
   SITE_TAGLINE,
   SITE_DESCRIPTION,
   CONTACT_EMAIL,
   ROUTES,
   SITE_NAV,
   STATIC_PAGES,
   HOW_TO_PLAY,
   formatLongDate,
   shiftISODate,
} = await import('../src/shared/site/index.ts')
const {
   byLevel,
   puzzleSentence,
   puzzleSummary,
   challengeTitle,
   challengeDescription,
} = await import('../src/features/DailyChallenge/utils/copy.ts')
const { FIRST_PUZZLE_DATE } =
   await import('../src/features/DailyChallenge/utils/constants.ts')

const DIST = fileURLToPath(new URL('../dist/', import.meta.url))
const env = (name) => (process.env[name] ?? '').trim()

const esc = (text) =>
   String(text)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')

// ── Desafios já liberados ────────────────────────────────────────

/** Hoje no horário de Brasília (AAAA-MM-DD). */
const today = new Intl.DateTimeFormat('en-CA', {
   timeZone: 'America/Sao_Paulo',
}).format(new Date())

async function fetchReleasedDays() {
   const url = env('VITE_SUPABASE_URL')
   const key = env('VITE_SUPABASE_PUBLISHABLE_KEY')
   if (!url || !key) {
      console.warn('prerender: sem as variáveis do Supabase; só páginas fixas.')
      return []
   }
   try {
      const query = new URLSearchParams({
         select: 'date,level,target,digit,count',
         and: `(date.gte.${FIRST_PUZZLE_DATE},date.lte.${today})`,
         order: 'date.asc',
      })
      const response = await fetch(`${url}/rest/v1/daily_puzzles?${query}`, {
         headers: { apikey: key },
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const days = new Map()
      for (const puzzle of await response.json())
         days.set(puzzle.date, [...(days.get(puzzle.date) ?? []), puzzle])
      return [...days].map(([date, puzzles]) => ({ date, puzzles }))
   } catch (error) {
      console.warn(`prerender: não deu para buscar os desafios (${error.message}); só páginas fixas.`)
      return []
   }
}

// ── Pedaços de HTML (as classes são as mesmas das telas em React) ──

const link = (to, label) => `<a href="${esc(to)}">${esc(label)}</a>`

const siteNav = (current) =>
   `<nav class="site-nav" aria-label="Páginas do site">${SITE_NAV.filter(
      (item) => item.to !== current
   )
      .map((item) => link(item.to, item.label))
      .join('')}</nav>`

const paragraph = (text) =>
   `<p>${esc(text).replaceAll('{email}', `<a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>`)}</p>`

const sections = (list, tag) =>
   list
      .map(
         (section) =>
            (section.heading ? `<${tag}>${esc(section.heading)}</${tag}>` : '') +
            section.paragraphs.map(paragraph).join('')
      )
      .join('')

/** Moldura das páginas de texto (igual ao PageShell). */
const pageShell = (path, heading, body) =>
   `<div class="page"><header class="page-top"><a href="/" aria-label="algarism.io: desafio de hoje"><img src="/logo-algarism.webp" alt="algarism.io" width="720" height="192"></a></header><main class="prose"><h1>${esc(heading)}</h1>${body}</main>${siteNav(path)}</div>`

/**
 * Páginas do jogo: a primeira tela fica reservada para o jogo, que o React
 * monta, e o texto vem abaixo dela, no mesmo lugar em que aparece depois.
 */
const gameShell = (path, title, notes) =>
   `<div class="stage"><div class="col"><h1 class="sr-only">${esc(title)}</h1></div><div class="below prose">${notes}<section><h2>Como jogar</h2>${sections(HOW_TO_PLAY, 'h3')}</section>${siteNav(path)}</div></div>`

// ── Páginas ──────────────────────────────────────────────────────

const days = await fetchReleasedDays()
const pages = []

pages.push({
   path: ROUTES.home,
   title: `${SITE_NAME} — ${SITE_TAGLINE}`,
   description: SITE_DESCRIPTION,
   changefreq: 'daily',
   jsonLd: [
      {
         '@context': 'https://schema.org',
         '@type': 'WebSite',
         name: SITE_NAME,
         url: SITE_URL + '/',
         description: SITE_DESCRIPTION,
         inLanguage: 'pt-BR',
      },
      {
         '@context': 'https://schema.org',
         '@type': 'Organization',
         name: SITE_NAME,
         url: SITE_URL + '/',
         logo: SITE_URL + '/icon-512.png',
      },
   ],
   body: gameShell(
      ROUTES.home,
      `${SITE_NAME} — ${SITE_TAGLINE}`,
      `<section><h2>Os desafios de hoje</h2><p>Todo dia são três desafios novos, um de cada nível: Fácil, Médio e Difícil. Em cada um você forma o número-alvo usando um único algarismo, uma quantidade exata de vezes.</p><p class="day-links">${link(ROUTES.archive, 'Todos os desafios')}</p></section>`
   ),
})

for (const page of STATIC_PAGES)
   pages.push({
      path: page.path,
      title: `${page.title} — ${SITE_NAME}`,
      description: page.description,
      body: pageShell(page.path, page.heading, sections(page.sections, 'h2')),
   })

pages.push({
   path: ROUTES.archive,
   title: `Todos os desafios — ${SITE_NAME}`,
   description:
      'O arquivo do algarism.io: todos os desafios diários de matemática já publicados, dia a dia, para jogar quando quiser.',
   changefreq: 'daily',
   body: pageShell(
      ROUTES.archive,
      'Todos os desafios',
      `<p>Todo dia saem três desafios novos, um de cada nível. Os anteriores continuam abertos: escolha um dia para jogar.</p><ul class="archive">${[
         ...days,
      ]
         .reverse()
         .map(
            ({ date, puzzles }) =>
               `<li>${link(ROUTES.challenge(date), formatLongDate(date))}<span>${esc(puzzleSummary(puzzles))}</span></li>`
         )
         .join('')}</ul>`
   ),
})

for (const { date, puzzles } of days) {
   const longDate = formatLongDate(date)
   const path = ROUTES.challenge(date)
   const title = challengeTitle(longDate)
   const description = challengeDescription(longDate, puzzles)
   const dayLinks = [
      date > FIRST_PUZZLE_DATE &&
         link(ROUTES.challenge(shiftISODate(date, -1)), '← Dia anterior'),
      date < today &&
         link(ROUTES.challenge(shiftISODate(date, 1)), 'Dia seguinte →'),
      link(ROUTES.archive, 'Todos os desafios'),
   ].filter(Boolean)

   pages.push({
      path,
      title: `${title} — ${SITE_NAME}`,
      description,
      lastmod: date,
      jsonLd: [
         {
            '@context': 'https://schema.org',
            '@type': 'Quiz',
            name: title,
            description,
            url: SITE_URL + path,
            inLanguage: 'pt-BR',
            datePublished: date,
            isAccessibleForFree: true,
            learningResourceType: 'Desafio de matemática',
            about: { '@type': 'Thing', name: 'Matemática' },
            hasPart: byLevel(puzzles).map((puzzle) => ({
               '@type': 'Question',
               name: puzzleSentence(puzzle),
            })),
         },
      ],
      body: gameShell(
         path,
         title,
         `<section><h2>Desafios de ${esc(longDate)}</h2><p>Neste dia foram três desafios, um de cada nível:</p><ul>${byLevel(
            puzzles
         )
            .map((puzzle) => `<li>${esc(puzzleSentence(puzzle))}</li>`)
            .join('')}</ul><p class="day-links">${dayLinks.join('')}</p></section>`
      ),
   })
}

// ── Escrita ──────────────────────────────────────────────────────

const template = await readFile(DIST + 'index.html', 'utf8')
const SEO_BLOCK = /<!-- seo:start[\s\S]*?<!-- seo:end -->/
const ROOT = '<div id="root"></div>'
if (!SEO_BLOCK.test(template) || !template.includes(ROOT))
   throw new Error('prerender: dist/index.html sem o bloco "seo" ou sem o #root vazio.')

function head({ path, title, description, jsonLd = [] }) {
   const url = SITE_URL + path
   const image = SITE_URL + '/og-card.png'
   return [
      `<title>${esc(title)}</title>`,
      `<meta name="description" content="${esc(description)}" />`,
      `<link rel="canonical" href="${esc(url)}" />`,
      `<meta property="og:type" content="website" />`,
      `<meta property="og:site_name" content="${esc(SITE_NAME)}" />`,
      `<meta property="og:locale" content="pt_BR" />`,
      `<meta property="og:title" content="${esc(title)}" />`,
      `<meta property="og:description" content="${esc(description)}" />`,
      `<meta property="og:url" content="${esc(url)}" />`,
      `<meta property="og:image" content="${image}" />`,
      `<meta property="og:image:width" content="600" />`,
      `<meta property="og:image:height" content="600" />`,
      `<meta name="twitter:card" content="summary" />`,
      `<meta name="twitter:title" content="${esc(title)}" />`,
      `<meta name="twitter:description" content="${esc(description)}" />`,
      `<meta name="twitter:image" content="${image}" />`,
      ...jsonLd.map(
         (data) =>
            `<script type="application/ld+json">${JSON.stringify(data).replaceAll('<', '\\u003c')}</script>`
      ),
   ].join('\n      ')
}

for (const page of pages) {
   const file = DIST + page.path.slice(1) + 'index.html'
   await mkdir(dirname(file), { recursive: true })
   await writeFile(
      file,
      template
         .replace(SEO_BLOCK, () => head(page))
         .replace(ROOT, () => `<div id="root">${page.body}</div>`)
   )
}

await writeFile(
   DIST + 'sitemap.xml',
   '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      pages
         .map(
            ({ path, lastmod, changefreq }) =>
               `   <url><loc>${esc(SITE_URL + path)}</loc>` +
               (lastmod ? `<lastmod>${lastmod}</lastmod>` : '') +
               (changefreq ? `<changefreq>${changefreq}</changefreq>` : '') +
               '</url>'
         )
         .join('\n') +
      '\n</urlset>\n'
)

// ads.txt: autoriza o Google a vender os anúncios do site (só com o AdSense configurado).
const adsClient = env('VITE_ADSENSE_CLIENT')
if (adsClient)
   await writeFile(
      DIST + 'ads.txt',
      `google.com, ${adsClient.replace(/^ca-/, '')}, DIRECT, f08c47fec0942fa0\n`
   )

console.log(
   `prerender: ${pages.length} páginas (${days.length} dias de desafios), sitemap.xml${adsClient ? ', ads.txt' : ''}`
)
