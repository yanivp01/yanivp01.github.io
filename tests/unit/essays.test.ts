import { readdirSync, readFileSync } from 'node:fs';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { essaySchema } from '../../src/content/schemas';

const dir = new URL('../../src/content/essays/', import.meta.url);

describe('essays', () => {
  const files = readdirSync(dir).filter((f) => f.endsWith('.mdx'));
  it('has all ten legacy essays', () => {
    expect(files.sort()).toEqual([
      'a-new-name.mdx', 'automating-venture-capital.mdx', 'cambridge-innovation-ecosystem-2025.mdx', 'due-diligence-in-vc.mdx',
      'maritime-vs-continental-governance-ai.mdx', 'multilayer-thinking-bubble-tricks.mdx', 'mushrooms-not-ecosystems.mdx',
      'next-great-teachers-ai-displaces.mdx', 'sailing-into-the-unknown-phd-viva.mdx', 'tower-of-babel-vc-jargon.mdx',
    ]);
  });
  for (const f of files) {
    it(`${f} has valid frontmatter and a body`, () => {
      const src = readFileSync(new URL(f, dir), 'utf8');
      const { data, content } = matter(src);
      expect(essaySchema.safeParse(data).success, JSON.stringify(data)).toBe(true);
      expect(content.trim().length).toBeGreaterThan(400);
      expect(src).not.toMatch(/<(div|span|figure)\b/);
    });
  }
});
