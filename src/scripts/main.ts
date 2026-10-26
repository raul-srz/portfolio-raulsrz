// Interacciones de la web. Cada bloque comprueba si su sección existe en la página.

const mm = (q: string) => window.matchMedia(q).matches;
const reduceMotion = mm('(prefers-reduced-motion: reduce)');
const finePointer = mm('(hover: hover) and (pointer: fine)');
const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s) as T | null;
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll<T>(s)];

/* En construcción: bloquear la web de debajo */
if (document.documentElement.classList.contains('uc')) {
  $$('.site-header, #main, .footer, .skip').forEach((el) => el.setAttribute('inert', ''));
  $$<HTMLVideoElement>('#main video').forEach((v) => v.pause());
}

/* Menú móvil */
const menuBtn = $<HTMLButtonElement>('#menuBtn');
menuBtn?.addEventListener('click', () => {
  const open = document.body.classList.toggle('menu-open');
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.textContent = open ? menuBtn.dataset.close! : menuBtn.dataset.open!;
});

/* Vídeos: "hover" se reproduce al pasar el ratón; en táctil, el que está en pantalla */
const hoverVideos = $$<HTMLVideoElement>('video[data-play="hover"]');
const play = (v: HTMLVideoElement) => v.play().catch(() => {});
if (finePointer) {
  hoverVideos.forEach((v) => {
    const target = v.closest('a') ?? v;
    target.addEventListener('mouseenter', () => play(v));
    target.addEventListener('mouseleave', () => v.pause());
  });
} else if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => (e.isIntersecting ? play(e.target as HTMLVideoElement) : (e.target as HTMLVideoElement).pause())),
    { threshold: 0.6 },
  );
  hoverVideos.forEach((v) => io.observe(v));
}
if (reduceMotion) $$<HTMLVideoElement>('video[autoplay]').forEach((v) => v.pause());

/* Texto grande: las palabras pasan de gris a blanco con el scroll */
const statementWords = $$('[data-statement] .w');
function updateStatement() {
  const line = innerHeight * 0.75;
  statementWords.forEach((w) => w.classList.toggle('lit', reduceMotion || w.getBoundingClientRect().top < line));
}

/* Carrusel de Selected work */
$$('[data-carousel]').forEach((car) => {
  const track = $('[data-track]', car)!;
  const prev = $<HTMLButtonElement>('[data-prev]', car)!;
  const next = $<HTMLButtonElement>('[data-next]', car)!;
  const index = () => Math.round(track.scrollLeft / track.clientWidth);
  const count = track.children.length;
  const update = () => {
    const i = index();
    prev.disabled = i <= 0;
    next.disabled = i >= count - 1;
  };
  const goTo = (i: number) => track.scrollTo({ left: i * track.clientWidth, behavior: reduceMotion ? 'auto' : 'smooth' });
  prev.addEventListener('click', () => goTo(index() - 1));
  next.addEventListener('click', () => goTo(index() + 1));
  track.addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();

  // Arrastrar con el ratón
  let down = false, moved = 0, sx = 0, sl = 0;
  track.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return;
    down = true; moved = 0; sx = e.clientX; sl = track.scrollLeft;
    track.style.scrollSnapType = 'none';
  });
  addEventListener('pointermove', (e) => {
    if (!down) return;
    moved = Math.abs(e.clientX - sx);
    track.scrollLeft = sl - (e.clientX - sx);
  });
  addEventListener('pointerup', () => {
    if (!down) return;
    down = false;
    track.style.scrollSnapType = '';
    goTo(Math.round(track.scrollLeft / track.clientWidth));
  });
  // Si se ha arrastrado, no abrir el proyecto
  track.addEventListener('click', (e) => { if (moved > 6) { e.preventDefault(); moved = 0; } }, true);
  track.addEventListener('dragstart', (e) => e.preventDefault());
});

/* Work: filtros, vista grid/lista e indicador de año */
const work = $('[data-work]');
const cards = work ? $$<HTMLAnchorElement>('.card', work) : [];
const yearItems = work ? $$('[data-years] li', work) : [];
if (work) {
  const grid = $('[data-grid]', work)!;
  const list = $('[data-list]', work)!;
  const rows = $$<HTMLLIElement>('li[data-cats]', list);
  const setPressed = (group: HTMLElement[], on: HTMLElement) =>
    group.forEach((b) => { b.classList.toggle('on', b === on); b.setAttribute('aria-pressed', String(b === on)); });

  const filters = $$<HTMLButtonElement>('[data-filter]', work);
  filters.forEach((b) =>
    b.addEventListener('click', () => {
      const f = b.dataset.filter!;
      setPressed(filters, b);
      let slot = 0;
      cards.forEach((c) => {
        const show = f === 'all' || c.dataset.cats!.split(' ').includes(f);
        c.hidden = !show;
        if (show) c.dataset.slot = String(slot++ % 6);
      });
      rows.forEach((r) => (r.hidden = !(f === 'all' || r.dataset.cats!.split(' ').includes(f))));
      updateYear();
    }),
  );

  const views = $$<HTMLButtonElement>('[data-view]', work);
  views.forEach((b) =>
    b.addEventListener('click', () => {
      setPressed(views, b);
      const isList = b.dataset.view === 'list';
      list.hidden = !isList;
      grid.hidden = isList;
      const yrs = $('[data-years]', work);
      if (yrs) yrs.hidden = isList;
    }),
  );
}
function updateYear() {
  if (!yearItems.length) return;
  const mid = innerHeight / 2;
  let best: HTMLElement | null = null, bestD = Infinity;
  cards.forEach((c) => {
    if (c.hidden) return;
    const r = c.getBoundingClientRect();
    const d = Math.abs(r.top + r.height / 2 - mid);
    if (d < bestD) { bestD = d; best = c; }
  });
  const y = (best as HTMLElement | null)?.dataset.year;
  yearItems.forEach((li) => li.classList.toggle('on', li.dataset.year === y));
}

/* Scroll */
let ticking = false;
addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => { updateStatement(); updateYear(); ticking = false; });
}, { passive: true });
addEventListener('resize', updateStatement);
updateStatement();
updateYear();

/* Reloj de Las Palmas en el footer */
$$('[data-clock]').forEach((el) => {
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: el.dataset.clock, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const tick = () => (el.textContent = fmt.format(new Date()));
  tick();
  setInterval(tick, 1000);
});

/* Copiar email */
$$<HTMLButtonElement>('[data-copy]').forEach((b) => {
  const label = b.textContent;
  b.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(b.dataset.copy!);
      b.textContent = b.dataset.copied!;
    } catch {
      const mail = $('[data-mail]');
      if (mail) { const r = document.createRange(); r.selectNodeContents(mail); getSelection()?.removeAllRanges(); getSelection()?.addRange(r); }
      b.textContent = b.dataset.select!;
    }
    setTimeout(() => (b.textContent = label), 2000);
  });
});

/* Film de proyecto (YouTube, se carga solo al pulsar) */
const filmBox = $('[data-film-box]');
const filmId = $('[data-film]')?.dataset.film;
if (filmBox && filmId) {
  const frame = $('[data-film-frame]', filmBox)!;
  const open = () => {
    frame.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${filmId}?autoplay=1&rel=0&modestbranding=1" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="Film"></iframe>`;
    filmBox.hidden = false;
    document.body.style.overflow = 'hidden';
    $<HTMLButtonElement>('[data-close-film]', filmBox)?.focus();
  };
  const close = () => { frame.innerHTML = ''; filmBox.hidden = true; document.body.style.overflow = ''; };
  $('[data-open-film]')?.addEventListener('click', open);
  $('[data-close-film]', filmBox)?.addEventListener('click', close);
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !filmBox.hidden) close(); });
}

/* Playground: lienzo infinito arrastrable */
const pg = $('[data-pg]');
if (pg) {
  const layer = $('[data-layer]', pg)!;
  const sources: string[] = JSON.parse(pg.dataset.items || '[]');
  const W = 1800, H = 1400, COLS = 5, ROWS = 4;
  let seed = 11;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const ratios = [[4, 5], [16, 9], [1, 1], [3, 4], [9, 16], [21, 9]];
  const tiles: { i: number; x: number; y: number; w: number; h: number }[] = [];
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      const [a, b] = ratios[Math.floor(rnd() * ratios.length)];
      let w = 150 + rnd() * 130, h = (w * b) / a;
      if (h > 270) { h = 270; w = (h * a) / b; }
      const cw = W / COLS, ch = H / ROWS;
      tiles.push({ i: r * COLS + c, w, h, x: c * cw + rnd() * Math.max(0, cw - w), y: r * ch + rnd() * Math.max(0, ch - h - 24) });
    }
  const tileHtml = (i: number) => {
    const src = sources.length ? sources[i % sources.length] : '';
    if (!src) return `<div class="media"><div class="media-ph" style="--h:${(i * 37) % 360}"></div></div>`;
    return src.endsWith('.mp4')
      ? `<div class="media"><video src="${src}" muted loop playsinline autoplay></video></div>`
      : `<div class="media"><img src="${src}" alt="" loading="lazy" decoding="async"></div>`;
  };
  let html = '';
  for (let by = -1; by <= 2; by++)
    for (let bx = -1; bx <= 2; bx++)
      tiles.forEach((t) => {
        html += `<div class="pg-item" style="left:${(t.x + bx * W).toFixed(0)}px;top:${(t.y + by * H).toFixed(0)}px;width:${t.w.toFixed(0)}px">` +
          `<div style="height:${t.h.toFixed(0)}px">${tileHtml(t.i)}</div><small>EXP_${String(t.i + 1).padStart(2, '0')}</small></div>`;
      });
  layer.innerHTML = html;
  $$('.pg-item > div', layer).forEach((d) => { const m = d.firstElementChild as HTMLElement; m.style.height = '100%'; });

  let ox = -300, oy = -250, vx = 0, vy = 0, drag = false, lx = 0, ly = 0;
  pg.addEventListener('pointerdown', (e) => { drag = true; lx = e.clientX; ly = e.clientY; vx = vy = 0; pg.setPointerCapture(e.pointerId); });
  pg.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - lx, dy = e.clientY - ly;
    lx = e.clientX; ly = e.clientY; ox += dx; oy += dy; vx = dx; vy = dy;
  });
  const end = () => { drag = false; };
  pg.addEventListener('pointerup', end);
  pg.addEventListener('pointercancel', end);
  pg.addEventListener('wheel', (e) => { e.preventDefault(); ox -= e.deltaX; oy -= e.deltaY; }, { passive: false });
  const frame = () => {
    if (!drag) {
      ox += vx; oy += vy; vx *= 0.93; vy *= 0.93;
      if (Math.abs(vx) < 0.05) vx = 0;
      if (Math.abs(vy) < 0.05) vy = 0;
      if (!reduceMotion && !vx && !vy) { ox -= 0.25; oy -= 0.12; }
    }
    const s = innerWidth < 640 ? 0.62 : 1, bw = W * s, bh = H * s;
    const tx = (((ox % bw) + bw) % bw) - bw, ty = (((oy % bh) + bh) % bh) - bh;
    layer.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
    requestAnimationFrame(frame);
  };
  frame();
}

/* Cursor en negativo (solo ratón) */
const cursor = $('#cursor');
if (cursor && finePointer) {
  document.documentElement.classList.add('has-cursor');
  const label = $('b', cursor)!;
  const reelHero = $('.hero[data-reel]');
  let x = 0, y = 0, cx = 0, cy = 0, shown = false;
  addEventListener('pointermove', (e) => {
    x = e.clientX; y = e.clientY;
    if (!shown) { cx = x; cy = y; shown = true; }
    cursor.classList.add('on');
    const t = e.target as Element;
    const onReel = !!reelHero && reelHero.contains(t);
    cursor.classList.toggle('label', onReel);
    label.textContent = onReel ? label.dataset.reel! : '';
    cursor.classList.toggle('big', !onReel && !!t.closest('a, button, .pg-item, [data-open-film]'));
  }, { passive: true });
  document.documentElement.addEventListener('mouseleave', () => cursor.classList.remove('on'));
  addEventListener('pointerdown', () => cursor.classList.add('press'));
  addEventListener('pointerup', () => cursor.classList.remove('press'));
  const loop = () => {
    const k = reduceMotion ? 1 : 0.2;
    cx += (x - cx) * k; cy += (y - cy) * k;
    cursor.style.transform = `translate(${cx}px, ${cy}px)`;
    requestAnimationFrame(loop);
  };
  loop();
}
