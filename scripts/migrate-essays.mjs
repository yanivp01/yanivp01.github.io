// scripts/migrate-essays.mjs — one-off: convert _legacy/essays/*.html to src/content/essays/*.mdx
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { load } from 'cheerio';
import TurndownService from 'turndown';

const td = new TurndownService({ headingStyle: 'atx', emDelimiter: '*' });
const meta = JSON.parse(readFileSync('_legacy/data/essays.json', 'utf8')).essays;
const byId = Object.fromEntries(meta.map((e) => [e.id, e]));
mkdirSync('src/content/essays', { recursive: true });

const yaml = (v) => JSON.stringify(v);
for (const file of readdirSync('_legacy/essays').filter((f) => f.endsWith('.html'))) {
  const id = file.replace(/\.html$/, '');
  const $ = load(readFileSync(`_legacy/essays/${file}`, 'utf8'));
  const article = $('article.essay-article');
  const title = article.find('h1').first().text().trim();
  const date = article.find('time').attr('datetime');
  const cover = article.find('.essay-cover img').first();
  const linkedin = article.find('.essay-source a').attr('href');
  article.find('h1, .essay-meta, .essay-cover, .essay-back, .essay-rule, .essay-source').remove();
  article.find('img').each((_, img) => { const s = $(img).attr('src') || ''; $(img).attr('src', s.replace(/^\.\.\//, '/')); });
  const body = td.turndown(article.html() || '').trim();
  const m = byId[id];
  const fm = {
    title: m?.title ?? title,
    date: m?.date ?? date,
    summary: m?.summary ?? $('meta[name="description"]').attr('content') ?? '',
    cover: m?.cover ? { src: '/' + m.cover.src.replace(/^\/?/, ''), alt: m.cover.alt ?? '' } : cover.length ? { src: (cover.attr('src') || '').replace(/^\.\.\//, '/'), alt: cover.attr('alt') || '' } : undefined,
    tags: m?.tags ?? [],
    linkedin: m?.linkedin ?? linkedin,
  };
  const lines = ['---'];
  for (const [k, v] of Object.entries(fm)) {
    if (v === undefined) continue;
    if (k === 'cover') lines.push(`cover:\n  src: ${yaml(v.src)}\n  alt: ${yaml(v.alt)}`);
    else if (Array.isArray(v)) lines.push(`${k}: [${v.map(yaml).join(', ')}]`);
    else lines.push(`${k}: ${yaml(v)}`);
  }
  lines.push('---', '', body, '');
  writeFileSync(`src/content/essays/${id}.mdx`, lines.join('\n'));
  console.log('wrote', id);
}
