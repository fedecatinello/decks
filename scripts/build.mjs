// Genera el sitio en dist/: copia cada subfolder de presentación (sin fuentes
// como .md o .pptx), arma un index.html general y _redirects para que
// /<carpeta>/ abra directamente su HTML.
//
// Estructura:
//   <deck>/            carpeta con un .html → presentación
//   <grupo>/<deck>/    carpeta sin .html → grupo (ej. itba/), con su propia
//                      página /<grupo>/ que lista sus presentaciones
//
// Opcional en cualquier carpeta (deck o grupo):
//   logo.(svg|png|jpg|webp)  logo que se muestra en la tarjeta
//   meta.json                { "title": "...", "description": "..." }
//                            (pisa <title> / <meta name="description">)
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
const SKIP_FILES = new Set(['.DS_Store', 'meta.json']);
const LOGO_FILES = ['logo.svg', 'logo.png', 'logo.webp', 'logo.jpg'];

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

function readMetaJson(dir) {
  const file = path.join(dir, 'meta.json');
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
}

const findLogo = (dir) => LOGO_FILES.find((f) => fs.existsSync(path.join(dir, f)));

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
const byDate = (a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0) || a.title.localeCompare(b.title);

// --- recolectar presentaciones y grupos ------------------------------------
// Devuelve los items (decks y grupos) dentro de `rel`. Una carpeta con .html es
// un deck; una sin .html pero con decks adentro es un grupo.
function collect(rel) {
  const items = [];
  for (const entry of fs.readdirSync(path.join(ROOT, rel), { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
    if (!rel && SKIP_DIRS.has(entry.name)) continue;
    const slug = rel ? `${rel}/${entry.name}` : entry.name;
    const dir = path.join(ROOT, slug);
    const json = readMetaJson(dir);
    const logo = findLogo(dir);
    const htmls = fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith('.html')).sort();

    if (htmls.length === 0) {
      const children = collect(slug);
      if (children.length === 0) continue;
      children.sort(byDate);
      items.push({
        kind: 'group',
        slug,
        logo,
        title: json.title || humanize(entry.name),
        description: json.description || '',
        date: children[0].date,
        children,
      });
      continue;
    }

    const main = htmls.includes('index.html') ? 'index.html' : htmls[0];
    const meta = readMeta(path.join(dir, main));
    items.push({
      kind: 'deck',
      slug,
      main,
      logo,
      title: json.title || meta.title || humanize(entry.name),
      description: json.description || meta.description || '',
      date: lastCommitDate(slug),
    });
  }
  return items;
}

const tree = collect('').sort(byDate);

// --- render -----------------------------------------------------------------
const fmtDate = (d) =>
  d ? d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'America/Argentina/Buenos_Aires' }) : '';
const href = (slug) => `/${encodeURI(slug)}/`;
const plural = (n) => `${n} ${n === 1 ? 'presentación' : 'presentaciones'}`;

const card = (it) => `
      <li>
        <a class="card${it.logo ? ' has-logo' : ''}" href="${esc(href(it.slug))}">
          ${it.logo ? `<span class="logo"><img src="${esc(href(it.slug) + it.logo)}" alt=""></span>` : ''}
          <span class="card-body">
            <span class="card-title">${esc(it.title)}</span>
            ${it.description ? `<span class="card-desc">${esc(it.description)}</span>` : ''}
            <span class="card-meta">
              ${it.kind === 'group' ? `<span class="count">${esc(plural(it.children.length))}</span>` : `<span class="slug">/${esc(it.slug)}</span>`}
              ${it.date ? `<time datetime="${it.date.toISOString()}">${esc(fmtDate(it.date))}</time>` : ''}
            </span>
          </span>
          ${it.kind === 'group' ? '<span class="chev" aria-hidden="true">›</span>' : ''}
        </a>
      </li>`;

function page({ title, subtitle, items, back, logo }) {
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title === SITE_TITLE ? title : `${title} · ${SITE_TITLE}`)}</title>
<meta name="robots" content="noindex">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect x='3' y='6' width='26' height='17' rx='2' fill='none' stroke='%23444' stroke-width='2.5'/><path d='M16 23v4M11 27h10' stroke='%23444' stroke-width='2.5' stroke-linecap='round'/></svg>">
<style>
:root {
  --bg: #f7f7f5; --surface: #ffffff; --ink: #1b1d1c; --muted: #6b706d;
  --line: #e3e5e2; --accent: #0a7a45; --shadow: 0 1px 2px rgb(0 0 0 / .04), 0 4px 16px rgb(0 0 0 / .04);
  --logo-bg: #ffffff; --logo-line: var(--line);
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #121413; --surface: #1b1e1c; --ink: #ecefed; --muted: #9aa19d;
    --line: #2b302d; --accent: #4cc489; --shadow: none;
    --logo-bg: #f4f5f3; --logo-line: transparent;
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
.back { display: inline-block; margin-bottom: 20px; color: var(--muted); text-decoration: none; font-size: 14px; }
.back:hover { color: var(--accent); }
.head-row { display: flex; align-items: center; gap: 20px; }
.head-row .logo { width: 132px; height: 72px; }
h1 { font-size: clamp(28px, 5vw, 36px); line-height: 1.15; margin: 0 0 6px; letter-spacing: -.02em; }
header p { margin: 0; color: var(--muted); }
ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }
.card {
  display: flex; align-items: center; gap: 18px; padding: 18px 20px;
  background: var(--surface); border: 1px solid var(--line); border-radius: 12px;
  box-shadow: var(--shadow); color: inherit; text-decoration: none;
  transition: border-color .15s, transform .15s;
}
.card:hover, .card:focus-visible { border-color: var(--accent); transform: translateY(-1px); outline: none; }
.logo {
  flex: none; width: 112px; height: 64px; padding: 8px 10px;
  display: flex; align-items: center; justify-content: center;
  background: var(--logo-bg); border: 1px solid var(--logo-line); border-radius: 8px;
}
.logo img { width: 100%; height: 100%; object-fit: contain; display: block; }
.card-body { display: flex; flex-direction: column; gap: 6px; min-width: 0; flex: 1; }
.card-title { font-size: 18px; font-weight: 600; }
.card-desc { color: var(--muted); font-size: 15px; }
.card-meta { display: flex; flex-wrap: wrap; gap: 4px 16px; font-size: 13px; color: var(--muted); }
.slug { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; color: var(--accent); overflow-wrap: anywhere; }
.count { color: var(--accent); font-weight: 500; }
.chev { flex: none; font-size: 28px; line-height: 1; color: var(--muted); }
.card:hover .chev { color: var(--accent); }
.empty { color: var(--muted); }
@media (max-width: 520px) {
  .card { gap: 14px; padding: 14px 16px; }
  .logo { width: 84px; height: 52px; padding: 6px 8px; }
  .head-row .logo { width: 96px; height: 56px; }
}
</style>
</head>
<body>
<main>
  <header>
    ${back ? `<a class="back" href="${esc(back.href)}">← ${esc(back.label)}</a>` : ''}
    <div class="head-row">
      ${logo ? `<span class="logo"><img src="${esc(logo)}" alt=""></span>` : ''}
      <div>
        <h1>${esc(title)}</h1>
        <p>${esc(subtitle)}</p>
      </div>
    </div>
  </header>
  ${items.length ? `<ul>${items.map(card).join('')}\n  </ul>` : '<p class="empty">Todavía no hay presentaciones.</p>'}
</main>
</body>
</html>
`;
}

// --- generar dist/ ----------------------------------------------------------
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const redirects = [];
const decks = [];

function emit(items, parent) {
  for (const it of items) {
    const out = path.join(OUT, it.slug);
    if (it.kind === 'deck') {
      decks.push(it);
      copyDir(path.join(ROOT, it.slug), out);
      if (it.main !== 'index.html') {
        const target = `/${encodeURI(it.slug)}/${encodeURI(it.main)}`;
        redirects.push(`/${encodeURI(it.slug)}    ${target}    302`);
        redirects.push(`/${encodeURI(it.slug)}/    ${target}    302`);
      }
      continue;
    }
    fs.mkdirSync(out, { recursive: true });
    if (it.logo) fs.copyFileSync(path.join(ROOT, it.slug, it.logo), path.join(out, it.logo));
    const subtitle = [it.description, plural(it.children.length)].filter(Boolean).join(' · ');
    fs.writeFileSync(
      path.join(out, 'index.html'),
      page({
        title: it.title,
        subtitle,
        items: it.children,
        back: parent ? { href: href(parent.slug), label: parent.title } : { href: '/', label: SITE_TITLE },
        logo: it.logo ? href(it.slug) + it.logo : null,
      }),
    );
    emit(it.children, it);
  }
}
emit(tree, null);

fs.writeFileSync(path.join(OUT, '_redirects'), redirects.join('\n') + '\n');
fs.writeFileSync(path.join(OUT, 'index.html'), page({ title: SITE_TITLE, subtitle: plural(decks.length), items: tree }));

console.log(`dist/ generado con ${decks.length} presentación(es):`);
for (const d of decks) console.log(`  /${d.slug}/ -> ${d.main}  (${d.title})`);
