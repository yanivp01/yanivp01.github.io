import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import Base from '../../src/layouts/Base.astro';

describe('Base layout', () => {
  it('emits title, description, OG and JSON-LD', async () => {
    const c = await AstroContainer.create();
    const html = await c.renderToString(Base, {
      props: { title: 'Test page', description: 'A test description.' },
      slots: { default: '<p>body</p>' },
    });
    expect(html).toContain('<title>Test page – Dr. Yaniv Proselkov</title>');
    expect(html).toContain('name="description" content="A test description."');
    expect(html).toContain('property="og:image"');
    expect(html).toContain('"@type":"Person"');
    expect(html).toContain('<p>body</p>');
  });
});
