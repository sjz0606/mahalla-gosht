// Mahalla by Gōsht: 3D only on their real footage. A reel ring, a tilting hero, tilting dish cards.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const lerp = (a, b, k) => a + (b - a) * k;

  // ---------- 1. reel ring ----------
  const host = document.querySelector('[data-reels]');
  if (host && CSS.supports('transform-style', 'preserve-3d')) {
    const cards = [...host.querySelectorAll('.reel')];
    const N = cards.length;
    const step = 360 / N;
    const ring = document.createElement('div');
    ring.className = 'ring';
    cards.forEach((c) => ring.appendChild(c));
    host.appendChild(ring);
    host.classList.add('is-ring');
    // the ring decides which videos play, not the generic observer
    const vids = cards.map((c) => { const v = c.querySelector('video'); v.removeAttribute('data-autoplay'); return v; });

    let R = 0, angle = 0, vel = reduce ? 0 : -0.05, target = null, inView = false;
    function layout() {
      const w = cards[0].getBoundingClientRect().width || 260;
      R = Math.round((w / 2) / Math.tan(Math.PI / N) + w * 0.06);
      host.style.setProperty('--R', R + 'px');
      cards.forEach((c, i) => { c.style.transform = `translateX(-50%) rotateY(${i * step}deg) translateZ(${R}px)`; });
    }
    new ResizeObserver(layout).observe(host);
    layout();

    // drag with inertia; a click on a sound button still works because drag starts after 6px
    let down = null;
    host.addEventListener('pointerdown', (e) => { down = { x: e.clientX, a: angle, moved: false, t: performance.now(), lastX: e.clientX }; });
    addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - down.x;
      if (!down.moved && Math.abs(dx) > 6) { down.moved = true; host.setPointerCapture?.(e.pointerId); host.classList.add('is-dragging'); }
      if (down.moved) {
        const now = performance.now();
        vel = ((e.clientX - down.lastX) * 0.25) / Math.max(1, (now - down.t) / 16);
        down.lastX = e.clientX; down.t = now;
        angle = down.a + dx * 0.25;
        target = null;
      }
    });
    addEventListener('pointerup', () => { if (down && down.moved) { host.classList.remove('is-dragging'); host.classList.add('was-drag'); setTimeout(() => host.classList.remove('was-drag'), 0); } down = null; });
    host.addEventListener('click', (e) => { if (host.classList.contains('was-drag')) e.preventDefault(); }, true);
    host.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      const snap = Math.round(angle / step) * step;
      target = snap + (e.key === 'ArrowLeft' ? step : -step);
      vel = 0;
    });

    // scroll nudges the ring a little
    let lastY = scrollY;
    addEventListener('scroll', () => { const dy = scrollY - lastY; lastY = scrollY; if (inView && !reduce && !down) vel = Math.max(-3, Math.min(3, vel - dy * 0.02)); }, { passive: true });

    new IntersectionObserver(([en]) => { inView = en.isIntersecting; if (!inView) vids.forEach((v) => v.pause()); }, { threshold: 0.15 }).observe(host);

    const playing = new Set();
    function frame() {
      if (inView) {
        if (target !== null) { angle = lerp(angle, target, 0.12); if (Math.abs(target - angle) < 0.05) { angle = target; target = null; } }
        else if (!down) {
          angle += vel;
          vel = lerp(vel, reduce ? 0 : -0.05, 0.03);
        }
        ring.style.transform = `translateZ(${-R}px) rotateY(${angle}deg)`;
        cards.forEach((c, i) => {
          const a = ((i * step + angle) % 360 + 540) % 360 - 180; // -180..180, 0 = facing us
          const f = Math.cos((a * Math.PI) / 180);
          c.style.setProperty('--f', Math.max(0, f).toFixed(3));
          const front = f > 0.55;
          c.toggleAttribute('data-front', front);
          c.querySelector('.reel__sound').tabIndex = front ? 0 : -1;
          const v = vids[i];
          if (front && !reduce) {
            if (!playing.has(v)) { playing.add(v); if (v.preload === 'none') v.preload = 'auto'; v.play().catch(() => {}); }
          } else if (playing.has(v)) { playing.delete(v); v.pause(); }
        });
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  if (reduce) return;

  // ---------- 2. hero reels tilt toward the pointer ----------
  const hero = document.querySelector('.hero');
  const wall = document.querySelector('.hero__reels');
  if (hero && wall && fine) {
    let tx = 0, ty = 0, x = 0, y = 0, running = false;
    hero.addEventListener('pointermove', (e) => {
      const r = wall.getBoundingClientRect();
      tx = ((e.clientX - (r.left + r.width / 2)) / innerWidth) * 2;
      ty = ((e.clientY - (r.top + r.height / 2)) / innerHeight) * 2;
      if (!running) { running = true; requestAnimationFrame(tick); }
    });
    hero.addEventListener('pointerleave', () => { tx = 0; ty = 0; });
    function tick() {
      x = lerp(x, tx, 0.08); y = lerp(y, ty, 0.08);
      wall.style.setProperty('--ry', (x * 9).toFixed(2) + 'deg');
      wall.style.setProperty('--rx', (-y * 6).toFixed(2) + 'deg');
      if (Math.abs(x - tx) + Math.abs(y - ty) > 0.001) requestAnimationFrame(tick); else running = false;
    }
  }

  // ---------- 3. dish cards tilt with a glare ----------
  if (fine) {
    document.querySelectorAll('.pick').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--ry', ((px - 0.5) * 12).toFixed(2) + 'deg');
        card.style.setProperty('--rx', ((0.5 - py) * 10).toFixed(2) + 'deg');
        card.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
        card.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
        card.classList.add('is-tilt');
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--ry', '0deg'); card.style.setProperty('--rx', '0deg');
        card.classList.remove('is-tilt');
      });
    });
  }
})();
