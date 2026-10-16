// Genera el sitio en dist/: copia cada subfolder de presentación (sin fuentes
// como .md o .pptx), arma un index.html general y _redirects para que
// /<carpeta>/ abra directamente su HTML.
//
// Uso: node scripts/build.mjs   (Netlify lo corre en cada deploy)

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(ROOT, 'dist');
const SITE_TITLE = 'Presentaciones';

// Carpetas de la raíz que no son presentaciones.
const SKIP_DIRS = new Set(['dist', 'scripts', 'node_modules']);
// Archivos que no se publican (material fuente / privado).
const SKIP_EXT = new Set(['.md', '.pptx', '.key', '.docx']);
const SKIP_FILES = new Set(['.DS_Store']);

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function readMeta(file) {
  const html = fs.readFileSync(file, 'utf8');
  const pick = (re) => html.match(re)?.[1]?.trim();
  return {
    title: pick(/<title[^>]*>([\s\S]*?)<\/title>/i),
    description:
      pick(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) ??
      pick(/<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i),
  };
}

function lastCommitDate(dir) {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', dir], { cwd: ROOT, encoding: 'utf8' }).trim();
    return out ? new Date(out) : null;
  } catch {
    return null;
  }
}

function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (SKIP_FILES.has(entry.name) || entry.name.startsWith('.')) continue;
    const s = path.join(src, entry.name);
    const d = path.join(dst, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else if (!SKIP_EXT.has(path.extname(entry.name).toLowerCase())) fs.copyFileSync(s, d);
  }
}

const humanize = (name) => name.replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

// --- recolectar presentaciones ---------------------------------------------
const decks = [];
for (const entry of fs.readdirSync(ROOT, { withFileTypes: true })) {
  if (!entry.isDirectory() || entry.name.startsWith('.') || SKIP_DIRS.has(entry.name)) continue;
  const dir = path.join(ROOT, entry.name);
  const htmls = fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith('.html')).sort();
  if (htmls.length === 0) continue;
  const main = htmls.includes('index.html') ? 'index.html' : htmls[0];
  const meta = readMeta(path.join(dir, main));
  decks.push({
    slug: entry.name,
    main,
    title: meta.title || humanize(entry.name),
    description: meta.description || '',
    date: lastCommitDate(entry.name),
  });
}
decks.sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0) || a.title.localeCompare(b.title));

// --- generar dist/ ----------------------------------------------------------
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const redirects = [];
for (const d of decks) {
  copyDir(path.join(ROOT, d.slug), path.join(OUT, d.slug));
  if (d.main !== 'index.html') {
    const target = `/${encodeURI(d.slug)}/${encodeURI(d.main)}`;
    redirects.push(`/${encodeURI(d.slug)}    ${target}    302`);
    redirects.push(`/${encodeURI(d.slug)}/    ${target}    302`);
  }
}
fs.writeFileSync(path.join(OUT, '_redirects'), redirects.join('\n') + '\n');

const fmtDate = (d) =>
  d ? d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'America/Argentina/Buenos_Aires' }) : '';

const cards = decks
  .map(
    (d) => `
      <li>
        <a class="card" href="/${esc(encodeURI(d.slug))}/">
          <span class="card-title">${esc(d.title)}</span>
          ${d.description ? `<span class="card-desc">${esc(d.description)}</span>` : ''}
          <span class="card-meta">
            <span class="slug">/${esc(d.slug)}</span>
            ${d.date ? `<time datetime="${d.date.toISOString()}">${esc(fmtDate(d.date))}</time>` : ''}
          </span>
        </a>
      </li>`,
  )
  .join('');

const index = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(SITE_TITLE)}</title>
<meta name="robots" content="noindex">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect x='3' y='6' width='26' height='17' rx='2' fill='none' stroke='%23444' stroke-width='2.5'/><path d='M16 23v4M11 27h10' stroke='%23444' stroke-width='2.5' stroke-linecap='round'/></svg>">
<style>
:root {
  --bg: #f7f7f5; --surface: #ffffff; --ink: #1b1d1c; --muted: #6b706d;
  --line: #e3e5e2; --accent: #0a7a45; --shadow: 0 1px 2px rgb(0 0 0 / .04), 0 4px 16px rgb(0 0 0 / .04);
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #121413; --surface: #1b1e1c; --ink: #ecefed; --muted: #9aa19d;
    --line: #2b302d; --accent: #4cc489; --shadow: none;
  }
}
* { box-sizing: border-box; }
body {
  margin: 0; background: var(--bg); color: var(--ink);
  font: 16px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
}
main { max-width: 860px; margin: 0 auto; padding: 64px 16px 80px; }
header { margin-bottom: 32px; }
h1 { font-size: clamp(28px, 5vw, 36px); line-height: 1.15; margin: 0 0 6px; letter-spacing: -.02em; }
header p { margin: 0; color: var(--muted); }
ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }
.card {
  display: flex; flex-direction: column; gap: 6px; padding: 18px 20px;
  background: var(--surface); border: 1px solid var(--line); border-radius: 12px;
  box-shadow: var(--shadow); color: inherit; text-decoration: none;
  transition: border-color .15s, transform .15s;
}
.card:hover, .card:focus-visible { border-color: var(--accent); transform: translateY(-1px); outline: none; }
.card-title { font-size: 18px; font-weight: 600; }
.card-desc { color: var(--muted); font-size: 15px; }
.card-meta { display: flex; flex-wrap: wrap; gap: 4px 16px; font-size: 13px; color: var(--muted); }
.slug { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; color: var(--accent); }
.empty { color: var(--muted); }
</style>
</head>
<body>
<main>
  <header>
    <h1>${esc(SITE_TITLE)}</h1>
    <p>${decks.length} ${decks.length === 1 ? 'presentación' : 'presentaciones'}</p>
  </header>
  ${decks.length ? `<ul>${cards}\n  </ul>` : '<p class="empty">Todavía no hay presentaciones.</p>'}
</main>
</body>
</html>
`;
fs.writeFileSync(path.join(OUT, 'index.html'), index);

console.log(`dist/ generado con ${decks.length} presentación(es):`);
for (const d of decks) console.log(`  /${d.slug}/ -> ${d.main}  (${d.title})`);
