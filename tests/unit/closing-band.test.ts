import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import ClosingBand from '../../src/components/ClosingBand.astro';

describe('ClosingBand', () => {
  it('renders the default heading and a mailto CTA', async () => {
    const c = await AstroContainer.create();
    const html = await c.renderToString(ClosingBand, {});
    expect(html).toContain('Working on something at the intersection of networks, capital and AI?');
    expect(html).toContain('href="mailto:yanivproselkov@gmail.com');
  });

  it('renders a custom heading when the prop is provided', async () => {
    const c = await AstroContainer.create();
    const html = await c.renderToString(ClosingBand, { props: { heading: 'Custom heading text' } });
    expect(html).toContain('Custom heading text');
    expect(html).not.toContain('Working on something at the intersection of networks, capital and AI?');
  });
});
