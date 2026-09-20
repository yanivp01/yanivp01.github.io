// scripts/migrate-papers.mjs — one-off: split _legacy/data/papers.json into papers.json + talks.json
import { readFileSync, writeFileSync } from 'node:fs';

const src = JSON.parse(readFileSync('_legacy/data/papers.json', 'utf8'));
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 60);
const year = (byline) => { const m = byline.match(/\((\d{4})/); return m ? Number(m[1]) : undefined; };
const fixSrc = (img) => (img ? { src: '/' + img.src.replace(/^\/?/, ''), alt: img.alt ?? '' } : undefined);
const cleanLinks = (links = []) => links.map((l) => ({ kind: l.kind ?? 'ext', label: l.label?.replace(/\s*[↗⬇]\s*/g, '').trim() || undefined, href: l.href.startsWith('papers_pdf') ? '/' + l.href : l.href }));

const categoryMap = { 'academic-papers': 'academic', theses: 'thesis', 'think-tank': 'think-tank' };
const papers = [];
const talks = [];
for (const cat of src.categories) {
  for (const item of cat.items) {
    const base = { id: slug(item.title), title: item.title, byline: item.byline, blurb: item.blurb, image: fixSrc(item.image), links: cleanLinks(item.links) };
    if (categoryMap[cat.id]) papers.push({ ...base, category: categoryMap[cat.id], year: year(item.byline) });
    else {
      const b = item.byline.toLowerCase();
      const kind = cat.id === 'conference-presentations' ? 'conference' : b.includes('panellist') ? 'panel' : b.includes('lecturer') || b.includes('lecture') ? 'lecture' : 'keynote';
      talks.push({ ...base, kind, year: year(item.byline) ?? 2024, featured: false });
    }
  }
}
// Dedupe ids by appending the year
for (const list of [papers, talks]) {
  const seen = new Map();
  for (const row of list) { const n = (seen.get(row.id) ?? 0) + 1; seen.set(row.id, n); if (n > 1) row.id = `${row.id}-${row.year ?? n}`; }
}
writeFileSync('src/content/papers.json', JSON.stringify(papers, null, 2) + '\n');
writeFileSync('src/content/talks.json', JSON.stringify(talks, null, 2) + '\n');
console.log(papers.length, 'papers;', talks.length, 'talks');
