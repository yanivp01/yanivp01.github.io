import { z } from 'astro/zod';

const image = z.object({ src: z.string(), alt: z.string().default('') });
const link = z.object({ kind: z.enum(['pdf', 'ext', 'internal']).default('ext'), label: z.string().optional(), href: z.string() });

export const paperSchema = z.object({
  id: z.string(),
  category: z.enum(['academic', 'thesis', 'think-tank']),
  title: z.string(),
  byline: z.string(),
  year: z.number().int().optional(),
  blurb: z.string(),
  image: image.optional(),
  links: z.array(link).default([]),
});

export const talkSchema = z.object({
  id: z.string(),
  kind: z.enum(['keynote', 'panel', 'lecture', 'conference']),
  title: z.string(),
  byline: z.string(),
  year: z.number().int(),
  blurb: z.string(),
  image: image.optional(),
  links: z.array(link).default([]),
  featured: z.boolean().default(false),
});

export const courseSchema = z.object({
  id: z.string(),
  title: z.string(),
  format: z.string(),
  duration: z.string(),
  audience: z.array(z.string()),
  languages: z.array(z.string()),
  summary: z.string(),
  modules: z.array(z.object({ title: z.string(), blurb: z.string().optional() })),
});

export const videoSchema = z.object({
  id: z.string(),
  title: z.string(),
  event: z.string(),
  date: z.string(),
  youtube: z.string().optional(),
  mp4: z.string().optional(),
  summary: z.string(),
  speakers: z.array(z.string()).default([]),
});

export const testimonialSchema = z.object({ id: z.string(), quote: z.string(), name: z.string(), role: z.string(), org: z.string() });

export const logoSchema = z.object({ id: z.string(), name: z.string(), src: z.string(), height: z.number(), wordmark: z.string().optional() });

export const essaySchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  summary: z.string(),
  cover: image.optional(),
  tags: z.array(z.string()).default([]),
  linkedin: z.string().url().optional(),
  ogImage: z.string().optional(),
});

export type Paper = z.infer<typeof paperSchema>;
export type Talk = z.infer<typeof talkSchema>;
export type Course = z.infer<typeof courseSchema>;
export type Video = z.infer<typeof videoSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
export type Logo = z.infer<typeof logoSchema>;
