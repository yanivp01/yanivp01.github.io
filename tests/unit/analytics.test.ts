import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import Analytics from '../../src/components/Analytics.astro';

describe('Analytics', () => {
  it('renders nothing without an id', async () => {
    const c = await AstroContainer.create();
    const html = await c.renderToString(Analytics, { props: { id: '' } });
    expect(html).not.toContain('googletagmanager');
  });
  it('renders the gtag snippet with an id', async () => {
    const c = await AstroContainer.create();
    const html = await c.renderToString(Analytics, { props: { id: 'G-TEST1234' } });
    expect(html).toContain('https://www.googletagmanager.com/gtag/js?id=G-TEST1234');
    expect(html).toContain('const id = "G-TEST1234"');
  });
});
