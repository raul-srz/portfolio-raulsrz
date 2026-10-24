# raulsrz.com

Portfolio de Raúl Suárez. Web estática hecha con [Astro](https://astro.build), publicada en GitHub Pages.

## Dónde está cada cosa

- `src/site.ts`: datos generales (email, redes, vídeo del hero, reel, colaboraciones, premios, playground on/off).
- `src/i18n.ts`: todos los textos de la web en inglés y español.
- `src/content/projects/`: un archivo `.md` por proyecto (título, categorías, año, rol, textos EN/ES, YouTube, loop, stills, créditos).
- `public/media/`: vídeos e imágenes. Se enlazan desde los proyectos como `/media/...`.

## Añadir un proyecto

Copiar uno de los archivos de `src/content/projects/`, cambiar los datos y subir el material a `public/media/<nombre-del-proyecto>/`.
`featured: 1`, `2` o `3` lo coloca en el carrusel de la home.

## Comandos

- `npm install`: instalar dependencias.
- `npm run dev`: ver la web en local (http://localhost:4321).
- `npm run build`: generar la web en `dist/`.

Cada cambio en `main` se publica solo (ver `.github/workflows/deploy.yml`).
