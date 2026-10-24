import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

export async function getProjects(): Promise<Project[]> {
  const all = await getCollection('projects', (p) => !p.data.draft);
  return all.sort((a, b) => b.data.year - a.data.year || a.data.order - b.data.order);
}

export async function getFeatured(): Promise<Project[]> {
  const all = await getProjects();
  return all
    .filter((p) => p.data.featured)
    .sort((a, b) => (a.data.featured ?? 0) - (b.data.featured ?? 0))
    .slice(0, 3);
}

/** Tono estable a partir del nombre, para los fondos provisionales. */
export function hueFrom(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
}
