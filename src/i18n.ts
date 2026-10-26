export type Lang = 'en' | 'es';
export const langs: Lang[] = ['en', 'es'];

export const ui = {
  en: {
    metaDescription:
      'Raúl Suárez, creative director from Gran Canaria. Film, documentary, commercials and title sequences, with AI as part of the toolkit.',
    work: 'Work',
    about: 'About',
    menu: 'Menu',
    close: 'Close',
    behind: 'Behind the frame',
    statement:
      "I'm a creative director from Gran Canaria. I write, direct and design films, commercials and motion pieces, building worlds frame by frame and using AI as one more tool in my crew.",
    selected: 'Selected work',
    allWork: 'All work',
    prev: 'Previous project',
    next: 'Next project',
    all: 'All',
    grid: 'Grid',
    list: 'List',
    aboutProject: 'About the project',
    role: 'Role',
    type: 'Type',
    year: 'Year',
    client: 'Client',
    credits: 'Credits',
    nextProject: 'Next project',
    playFilm: 'Play film',
    closeFilm: 'Close',
    bio: 'Raúl Suárez is a creative director based in Gran Canaria. He writes, directs and designs films, commercials and motion pieces, with a sharp eye for art direction and a love for building worlds.',
    giant:
      'AI is one more tool in my crew. The idea, the script, the frame and the final cut are mine.',
    reel: 'Reel',
    contact: 'Contact',
    letsTalk: "Let's work together",
    collaborations: 'Collaborations',
    awards: 'Selections & Awards',
    elsewhere: 'Elsewhere',
    copy: 'Copy email',
    copied: 'Copied',
    selectCopy: 'Selected, press Ctrl+C',
    socials: 'Socials',
    soon: 'Soon',
    lookAround: 'Look around',
    drag: 'Drag to explore',
    watchReel: 'Watch reel',
    view: 'View',
    ucTitle: 'New site in progress',
    ucText: 'Meanwhile, say hi',
    aiTag: 'AI',
    cats: { film: 'Film', documentary: 'Documentary', commercial: 'Commercial', titles: 'Titles' },
  },
  es: {
    metaDescription:
      'Raúl Suárez, director creativo desde Gran Canaria. Ficción, documental, publicidad y cabeceras, con la IA como herramienta.',
    work: 'Trabajo',
    about: 'Sobre mí',
    menu: 'Menú',
    close: 'Cerrar',
    behind: 'Detrás del plano',
    statement:
      'Soy director creativo desde Gran Canaria. Escribo, dirijo y diseño films, anuncios y piezas de motion, construyendo mundos plano a plano y con la IA como una herramienta más de mi equipo.',
    selected: 'Trabajo destacado',
    allWork: 'Todo el trabajo',
    prev: 'Proyecto anterior',
    next: 'Proyecto siguiente',
    all: 'Todo',
    grid: 'Grid',
    list: 'Lista',
    aboutProject: 'Sobre el proyecto',
    role: 'Rol',
    type: 'Tipo',
    year: 'Año',
    client: 'Cliente',
    credits: 'Créditos',
    nextProject: 'Siguiente proyecto',
    playFilm: 'Ver film',
    closeFilm: 'Cerrar',
    bio: 'Raúl Suárez es director creativo afincado en Gran Canaria. Escribe, dirige y diseña films, anuncios y piezas de motion, con un ojo muy marcado para la dirección de arte y el gusto por construir mundos.',
    giant:
      'La IA es una herramienta más de mi equipo. La idea, el guion, el encuadre y el montaje final son míos.',
    reel: 'Reel',
    contact: 'Contacto',
    letsTalk: 'Trabajemos juntos',
    collaborations: 'Colaboraciones',
    awards: 'Selecciones y premios',
    elsewhere: 'En otros sitios',
    copy: 'Copiar email',
    copied: 'Copiado',
    selectCopy: 'Seleccionado, pulsa Ctrl+C',
    socials: 'Redes',
    soon: 'Pronto',
    lookAround: 'Echa un vistazo',
    drag: 'Arrastra para explorar',
    watchReel: 'Ver reel',
    view: 'Ver',
    ucTitle: 'Web nueva en camino',
    ucText: 'Mientras tanto, escríbeme',
    aiTag: 'IA',
    cats: { film: 'Ficción', documentary: 'Documental', commercial: 'Publicidad', titles: 'Cabeceras' },
  },
} as const;

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Ruta de un archivo de /public, p. ej. asset('/media/hero.mp4') */
export function asset(path: string) {
  return path && path.startsWith('/') ? `${BASE}${path}` : path;
}

/** Ruta en el idioma indicado. path siempre en formato inglés: '/', '/work', '/work/slug' */
export function href(lang: Lang, path: string) {
  if (lang === 'en') return `${BASE}${path}`;
  return path === '/' ? `${BASE}/es` : `${BASE}/es${path}`;
}

/** Quita la base y el prefijo /es de una ruta. */
export function basePath(pathname: string) {
  let p = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname;
  p = p.replace(/\/$/, '') || '/';
  if (p === '/es') return '/';
  return p.startsWith('/es/') ? p.slice(3) : p;
}
