import { getCollection, type CollectionEntry } from 'astro:content';

export type Essay = CollectionEntry<'essays'>;

export async function getEssays(): Promise<Essay[]> {
  const all = await getCollection('essays');
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function related(essays: Essay[], current: Essay, max = 3): Essay[] {
  const tags = new Set(current.data.tags);
  return essays
    .filter((e) => e.id !== current.id)
    .map((e) => ({ e, score: e.data.tags.filter((t) => tags.has(t)).length }))
    .sort((a, b) => b.score - a.score || b.e.data.date.getTime() - a.e.data.date.getTime())
    .slice(0, max)
    .map(({ e }) => e);
}

export const formatDate = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
