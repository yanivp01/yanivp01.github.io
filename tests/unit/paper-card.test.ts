import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import PaperCard from '../../src/components/PaperCard.astro';

describe('PaperCard', () => {
  it('renders title, byline, blurb and typed links', async () => {
    const c = await AstroContainer.create();
    const html = await c.renderToString(PaperCard, { props: { paper: {
      id: 'x', category: 'academic', title: 'A Paper', byline: 'Y Proselkov (2024). Journal.', blurb: 'Blurb.', year: 2024,
      image: { src: '/pictures/x.png', alt: 'X' },
      links: [{ kind: 'ext', label: 'arXiv', href: 'https://arxiv.org/abs/1' }, { kind: 'pdf', href: '/papers_pdf/x.pdf' }],
    } } });
    expect(html).toContain('A Paper');
    expect(html).toContain('Y Proselkov (2024). Journal.');
    expect(html).toContain('href="https://arxiv.org/abs/1"');
    expect(html).toContain('Read PDF');
    expect(html).toContain('target="_blank"');
  });
});
