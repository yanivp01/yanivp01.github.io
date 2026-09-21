import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import LogoStrip from '../../src/components/LogoStrip.astro';

describe('LogoStrip', () => {
  it('renders every logo with alt text and the Cambridge wordmark', async () => {
    const c = await AstroContainer.create();
    const html = await c.renderToString(LogoStrip, { props: { logos: [
      { id: 'cambridge', name: 'Cambridge Judge Business School', src: '/logos/cambridge-judge.png', height: 40 },
      { id: 'bt', name: 'BT', src: '/logos/bt.svg', height: 32 },
    ] } });
    expect(html).toContain('alt="Cambridge Judge Business School"');
    expect(html).toContain('alt="BT"');
    expect(html).toContain('Spoken at');
  });
});
