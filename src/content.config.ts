import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { courseSchema, essaySchema, logoSchema, paperSchema, talkSchema, testimonialSchema, videoSchema } from './content/schemas';

export const collections = {
  essays: defineCollection({ loader: glob({ pattern: '**/*.mdx', base: './src/content/essays' }), schema: essaySchema }),
  papers: defineCollection({ loader: file('./src/content/papers.json'), schema: paperSchema }),
  talks: defineCollection({ loader: file('./src/content/talks.json'), schema: talkSchema }),
  courses: defineCollection({ loader: file('./src/content/courses.json'), schema: courseSchema }),
  videos: defineCollection({ loader: file('./src/content/videos.json'), schema: videoSchema }),
  testimonials: defineCollection({ loader: file('./src/content/testimonials.json'), schema: testimonialSchema }),
  logos: defineCollection({ loader: file('./src/content/logos.json'), schema: logoSchema }),
};
