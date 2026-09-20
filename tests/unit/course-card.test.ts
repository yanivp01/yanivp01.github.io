import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import CourseCard from '../../src/components/CourseCard.astro';

describe('CourseCard', () => {
  it('renders spec row, syllabus and CTA', async () => {
    const c = await AstroContainer.create();
    const html = await c.renderToString(CourseCard, { props: { course: {
      id: 'x', title: 'Course X', format: 'Weekly lecture', duration: '8 weeks', audience: ['Executives'], languages: ['English'], summary: 'Sum.',
      modules: [{ title: 'Mod 1', blurb: 'B1' }, { title: 'Mod 2' }],
    } } });
    expect(html).toContain('Course X');
    expect(html).toContain('8 weeks');
    expect(html).toContain('Mod 1');
    expect(html).toContain('Mod 2');
    expect(html).toContain('Commission this course');
  });
});
