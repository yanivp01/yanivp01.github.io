import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const dist = new URL('../../dist/', import.meta.url);

describe('build artifacts', () => {
  it('keeps the custom domain', () => {
    expect(readFileSync(new URL('CNAME', dist), 'utf8').trim()).toBe('www.yapros.co.uk');
  });
  it('serves legacy asset folders at the same paths', () => {
    for (const p of ['pictures/yaniv standing.jpg', 'papers_pdf', 'videos', 'favicon.svg', 'robots.txt']) {
      expect(existsSync(new URL(p, dist)), p).toBe(true);
    }
  });
});
