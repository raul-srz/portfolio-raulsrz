// Configuración general de la web. Aquí se cambian datos sin tocar el diseño.

export const site = {
  name: 'Raúl Suárez',
  role: 'Creative Director',
  email: 'hello@raulsrz.com',
  location: 'Las Palmas de Gran Canaria',
  timezone: 'Atlantic/Canary',

  // Redes: las que tengan url vacía no se muestran.
  socials: [
    { label: 'Instagram', url: 'https://www.instagram.com/raul.srz/' },
    { label: 'Vimeo', url: '' },
    { label: 'LinkedIn', url: '' },
  ],

  // Vídeo del hero (loop). Rutas dentro de /public, p. ej. '/media/hero/loop.mp4'.
  // Vacío = se muestra un fondo provisional animado.
  hero: {
    loop: '',
    loopMobile: '', // versión vertical 9:16 para móvil
    poster: '', // imagen fija mientras carga
  },

  // ID de YouTube del reel. Cuando exista, el cursor muestra "Watch reel" sobre el hero.
  reel: '',

  // About: listas editables. Vacías = la fila no se muestra.
  collaborations: ['Client A', 'Client B', 'Client C', 'Client D', 'Client E', 'Client F'],
  awards: [
    { title: 'Festival name (City, Country)', detail: 'Month Year · Project · Official Selection' },
    { title: 'Festival name (City, Country)', detail: 'Month Year · Project · Award' },
  ],

  // Pantalla "en construcción" por encima de toda la web. Ver la web real: raulsrz.com/?preview
  underConstruction: true,

  // Playground: false = oculto en la web publicada (sí se ve en local para trabajar en él).
  playground: false,
};
