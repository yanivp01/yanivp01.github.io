import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const legacy = readFileSync(new URL('../../_legacy/sitemap.xml', import.meta.url), 'utf8');
const paths = [...legacy.matchAll(/<loc>https:\/\/www\.yapros\.co\.uk(\/[^<]*)<\/loc>/g)].map((m) => m[1]).filter((p) => p !== '/');
const dist = new URL('../../dist/', import.meta.url);

describe('legacy URLs still resolve', () => {
  for (const p of paths) {
    it(p, () => {
      const file = new URL(p.replace(/^\//, ''), dist);
      expect(existsSync(file), `${p} missing from dist`).toBe(true);
      const html = readFileSync(file, 'utf8');
      expect(html).toMatch(/http-equiv="refresh"|<link rel="canonical"/);
    });
  }
  it('videos.html points at the speaking page', () => {
    expect(readFileSync(new URL('videos.html', dist), 'utf8')).toContain('/speaking#videos');
  });
});
