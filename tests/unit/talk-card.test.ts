import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import TalkCard from '../../src/components/TalkCard.astro';

describe('TalkCard', () => {
  it('renders kind badge, title, byline, year and links', async () => {
    const c = await AstroContainer.create();
    const html = await c.renderToString(TalkCard, { props: { talk: {
      id: 't', kind: 'panel', title: 'Why Knowledge Rarely Translates into Capital Allocation', byline: 'Panellist (2026). London Business School, London, UK.', year: 2026, blurb: 'Panel on ecosystem infrastructure.',
      image: { src: '/pictures/talk_lbs.jpg', alt: 'LBS panel' }, links: [{ kind: 'ext', label: 'LinkedIn Post', href: 'https://www.linkedin.com/posts/x' }], featured: true,
    } } });
    expect(html).toContain('Panel');
    expect(html).toContain('Why Knowledge Rarely Translates');
    expect(html).toContain('2026');
    expect(html).toContain('src="/pictures/talk_lbs.jpg"');
    expect(html).toContain('href="https://www.linkedin.com/posts/x"');
  });
});
