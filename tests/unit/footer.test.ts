import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import Footer from '../../src/components/Footer.astro';
import { SITE } from '../../src/lib/site';

describe('Footer', () => {
  it('renders the social links, sitemap link and current year', async () => {
    const c = await AstroContainer.create();
    const html = await c.renderToString(Footer, {});
    expect(html).toContain(`href="${SITE.linkedin}"`);
    expect(html).toContain(`href="${SITE.scholar}"`);
    expect(html).toContain(`href="${SITE.researchgate}"`);
    expect(html).toContain('href="/sitemap-index.xml"');
    expect(html).toContain(String(new Date().getFullYear()));
  });
});
