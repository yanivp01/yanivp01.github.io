import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import Hero from '../../src/components/Hero.astro';
import { bookingHref } from '../../src/lib/site';

describe('Hero', () => {
  it('renders the approved copy and roles', async () => {
    const c = await AstroContainer.create();
    const html = await c.renderToString(Hero);
    expect(html).toContain('Researcher &amp; Strategist');
    expect(html).toContain('AI Engineer');
    expect(html).not.toContain('CTO');
    expect(html).toContain('I study how things spread through networks');
    // Astro's scoped-style compiler adds a data-astro-cid-* attribute to every
    // element in a component that has a <style> block, so these match the tag
    // + class (the meaningful contract) rather than an exact attribute-free tag.
    expect(html).toMatch(/<em[^>]*>money, risk, ideas<\/em>/);
    expect(html).toContain('and build the systems that steer them.');
    for (const v of ['speak', 'teach', 'build']) expect(html).toMatch(new RegExp(`<strong class="verb"[^>]*>${v}</strong>`));
    for (const s of ['AI', 'supply-chain finance', 'innovation ecosystems']) expect(html).toMatch(new RegExp(`<span class="subj"[^>]*>${s}</span>`));
    expect(html).toContain('AI Engineer, AIOS');
    expect(html).toContain('Director of Research, Global Cambridge');
    expect(html).toContain(`href="${bookingHref('Speaking enquiry')}"`);
    expect(html).toContain('href="/research"');
  });
});
