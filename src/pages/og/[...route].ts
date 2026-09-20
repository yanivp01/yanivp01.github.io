import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';

const essays = await getCollection('essays');
const pages = Object.fromEntries(essays.map((e) => [`essays/${e.id}`, { title: e.data.title, description: e.data.summary }]));

export const { getStaticPaths, GET } = await OGImageRoute({
  pages,
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    bgGradient: [[255, 255, 255]],
    border: { color: [31, 78, 216], width: 16, side: 'inline-start' },
    padding: 80,
    font: {
      title: { color: [14, 14, 16], size: 64, lineHeight: 1.05, families: ['Instrument Serif'], weight: 'Normal' },
      description: { color: [106, 106, 114], size: 28, lineHeight: 1.4, families: ['Geist'], weight: 'Normal' },
    },
    fonts: [
      'node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2',
      'node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2',
    ],
    logo: { path: './src/assets/og-logo.png', size: [48] },
  }),
});
