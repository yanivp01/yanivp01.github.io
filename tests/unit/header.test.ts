import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import Header from '../../src/components/Header.astro';

describe('Header', () => {
  it('renders the six nav items and a mailto CTA', async () => {
    const c = await AstroContainer.create();
    const html = await c.renderToString(Header, { request: new Request('https://www.yapros.co.uk/speaking') });
    for (const label of ['Speaking', 'Teaching', 'Research', 'Essays', 'Model', 'About']) expect(html).toContain(`>${label}<`);
    expect(html).toContain('href="mailto:yanivproselkov@gmail.com');
    expect(html).toContain('aria-current="page"');
    expect(html).toContain('aria-expanded="false"');
  });
});
