import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const bi = z.object({ en: z.string(), es: z.string() });

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    categories: z.array(z.enum(['film', 'documentary', 'commercial', 'titles'])).min(1),
    ai: z.boolean().default(false), // muestra la etiqueta AI / IA
    year: z.number().optional(),
    order: z.number().default(100), // orden en Work: menor = antes
    featured: z.number().optional(), // 1, 2, 3 = posición en "Selected work" de la home
    role: bi,
    type: bi,
    client: z.string().default(''),
    about: bi,
    youtube: z.string().default(''), // ID del vídeo de YouTube
    loop: z.string().default(''), // loop corto mp4 en /public
    poster: z.string().default(''), // imagen fija
    stills: z.array(z.string()).default([]),
    credits: z.array(z.object({ role: z.string(), name: z.string() })).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects };
