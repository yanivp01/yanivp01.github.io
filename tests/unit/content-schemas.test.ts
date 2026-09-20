import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { courseSchema, logoSchema, paperSchema, talkSchema, testimonialSchema, videoSchema } from '../../src/content/schemas';

const load = (name: string) => JSON.parse(readFileSync(new URL(`../../src/content/${name}.json`, import.meta.url), 'utf8'));

describe('JSON collections validate and have unique ids', () => {
  const cases = [
    ['papers', paperSchema, 15],
    ['talks', talkSchema, 18],
    ['courses', courseSchema, 2],
    ['videos', videoSchema, 2],
    ['testimonials', testimonialSchema, 0],
    ['logos', logoSchema, 6],
  ] as const;
  for (const [name, schema, count] of cases) {
    it(name, () => {
      const rows = load(name);
      expect(rows).toHaveLength(count);
      const ids = new Set<string>();
      for (const row of rows) {
        const parsed = schema.safeParse(row);
        expect(parsed.success, JSON.stringify(parsed.success ? null : parsed.error.issues)).toBe(true);
        expect(ids.has(row.id), `duplicate id ${row.id}`).toBe(false);
        ids.add(row.id);
      }
    });
  }
  it('every talk and paper image exists in public/', () => {
    for (const row of [...load('papers'), ...load('talks')]) {
      if (row.image) expect(existsSync(new URL(`../../public${row.image.src}`, import.meta.url)), row.image.src).toBe(true);
    }
  });
});
