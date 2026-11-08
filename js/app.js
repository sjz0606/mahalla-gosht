(() => {
  const RU = {
    'skip': 'Перейти к меню',
    'nav.menu': 'Меню', 'nav.places': 'Филиалы', 'nav.delivery': 'Доставка',
    'cta.order': 'Заказать', 'cta.menu': 'Смотреть меню', 'cta.orderbot': 'Заказать в боте',
    'hero.title': 'Бургеры на углях. 100% мясо.',
    'hero.lead': 'Готовим в печи Josper, в четырёх точках Ташкента.',
    'menu.title': 'Меню', 'menu.burgers': 'Бургеры', 'menu.rolls': 'Роллы и хот-доги', 'menu.snacks': 'Снэки',
    'menu.cap.burgers': 'Каждый бургер достоин вашего внимания.',
    'menu.cap.rolls': 'Хот-дог «Махалля».',
    'menu.cap.snacks': 'Наггетсы в фирменной упаковке.',
    'menu.note': 'Цены в сумах, из меню в Instagram. Точную цену уточняйте в филиале или в боте.',
    'd.blacklamb': 'Чёрный ягнёнок', 'd.silence': 'Молчание ягнят', 'd.steak': 'Стейк', 'd.classiccheese': 'Классик с сыром',
    'd.gosht': 'Гошт', 'd.mahalla': 'Махалля', 'd.bbq': 'Барбекю', 'd.classic': 'Классик', 'd.beshanja': 'Бешанджа', 'd.hotchick': 'Горячая цыпочка', 'd.juja': 'Жужа', 'd.junior': 'Джуниор',
    'd.rollgosht': 'Ролл Гошт', 'd.rolljuja': 'Ролл Жужа', 'd.hdmahalla': 'Хот-дог Махалля', 'd.hdclassic': 'Хот-дог Классика',
    'd.chuchvara': 'Чучвара Махалля', 'd.nuggets': 'Куриные наггетсы', 'd.fries': 'Картофель фри',
    'k.r1': 'Наши гости', 'k.r2': 'Время обеда', 'k.r3': '«Чёрный ягнёнок»', 'k.r4': 'Удовольствие в каждом кусочке', 'k.r5': 'Стоит один раз попробовать', 'k.r6': 'Наггетсы в фирменной упаковке',
    'k.title': 'На кухне и в зале', 'k.r7': 'Хот-дог Махалля, в руке', 'k.r8': 'Milliy Fest, Milliy Bog‘', 'k.hint': 'Потяните, чтобы покрутить',
    'pk.title': 'Рекомендуем попробовать', 'pk.blacklamb': 'Сочная котлета, мягкая булочка, фирменный соус и мастерство наших поваров.', 'pk.steak': 'Для тех, кто любит насыщенный вкус: нежное мясо, аккуратно приготовленное.', 'pk.hotdog': 'Вкус, от которого невозможно отказаться.', 'd.steakburger': 'Стейк-бургер', 'k.lead': 'Самое интересное всегда происходит на кухне.',
    'f.title': 'На городских праздниках: красный фургон', 'f.japan': 'Японский сад', 'f.milliy': 'Milliy Bog‘', 'f.sep': 'сентябрь', 'f.mar': 'март',
    'p.title': 'Четыре адреса', 'p.navoi': 'Театр им. Алишера Навои', 'p.riviera': 'ТРЦ «Riviera»', 'p.cp': 'ул. Махатма Ганди, парк Тельмана',
    'p.eco': 'EcoBozor Beruniy', 'p.ask': 'Часы работы: уточните в Instagram', 'p.write': 'Написать', 'p.map': 'На карте',
    'dl.title': 'Домой, в офис, на праздник', 'dl.lead': 'Заказывайте через Telegram-бот, или в Yandex Eats и Uzum Tezkor.',
    'c.title': 'Кейтеринг', 'c.text': 'День рождения, корпоратив или фестиваль: готовим бургеры на месте.', 'c.cta': 'Договориться в Instagram',
    'ft.group': 'Из семьи Gōsht Group. С 2017 года.',
    'ft.note': 'Концепт сайта. Фото, видео и цены: со страницы @mahalla_by_gosht в Instagram.',
    'st.open': 'Открыто', 'st.closed': 'Закрыто', 'st.until': 'до', 'st.opens': 'откроется в',
    'now.some': (n) => `Сейчас открыто: ${n} из 3 филиалов с известными часами`, 'now.none': 'Сейчас все филиалы закрыты',
  };
  const UZ = {
    'st.open': 'Ochiq', 'st.closed': 'Yopiq', 'st.until': 'gacha', 'st.opens': 'ochiladi',
    'now.some': (n) => `Hozir ochiq: soatlari ma’lum 3 filialdan ${n} tasi`, 'now.none': 'Hozir barcha filiallar yopiq',
  };

  const nodes = [...document.querySelectorAll('[data-i18n]')];
  const original = new Map(nodes.map((n) => [n, n.textContent]));
  let lang = 'uz';
  let saved = null;
  try { saved = localStorage.getItem('mahalla-lang'); } catch { /* storage blocked */ }
  lang = saved === 'ru' || saved === 'uz' ? saved : (navigator.language || '').toLowerCase().startsWith('ru') ? 'ru' : 'uz';

  const t = (key) => (lang === 'ru' ? RU[key] : UZ[key]);

  function applyLang(next) {
    lang = next;
    document.documentElement.lang = lang;
    nodes.forEach((n) => { const k = n.dataset.i18n; n.textContent = lang === 'ru' && typeof RU[k] === 'string' ? RU[k] : original.get(n); });
    document.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    try { localStorage.setItem('mahalla-lang', lang); } catch { /* ignore */ }
    updateStatus();
  }
  document.querySelectorAll('[data-lang]').forEach((b) => b.addEventListener('click', () => applyLang(b.dataset.lang)));

  // ---------- nav: solid after the hero, hides on the way down ----------
  const nav = document.querySelector('[data-nav]');
  let lastY = scrollY;
  addEventListener('scroll', () => {
    const y = scrollY;
    nav.classList.toggle('is-solid', y > innerHeight * 0.6);
    nav.classList.toggle('is-hidden', y > innerHeight && y > lastY + 4);
    if (y < lastY - 4) nav.classList.remove('is-hidden');
    lastY = y;
  }, { passive: true });

  // ---------- menu tabs ----------
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const photo = document.querySelector('[data-menu-photo]');
  const caption = document.querySelector('[data-menu-caption]');
  function select(tab, focus) {
    tabs.forEach((x) => {
      const on = x === tab;
      x.setAttribute('aria-selected', String(on));
      x.tabIndex = on ? 0 : -1;
      document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
    });
    const panel = document.getElementById(tab.getAttribute('aria-controls'));
    if (photo && panel.dataset.photo && !photo.src.endsWith(panel.dataset.photo)) {
      photo.classList.add('is-swapping');
      setTimeout(() => { photo.src = panel.dataset.photo; photo.alt = caption.textContent; }, 200);
      photo.onload = () => photo.classList.remove('is-swapping');
    }
    if (caption) { caption.dataset.i18n = panel.dataset.cap; const n = nodes.indexOf(caption); original.set(caption, CAPS_UZ[panel.dataset.cap]); caption.textContent = lang === 'ru' ? RU[panel.dataset.cap] : CAPS_UZ[panel.dataset.cap]; if (n < 0) nodes.push(caption); }
    if (focus) tab.focus();
  }
  const CAPS_UZ = {
    'menu.cap.burgers': 'Har bir burger alohida e’tiborga loyiq.',
    'menu.cap.rolls': '«Mahalla» hot-dogi.',
    'menu.cap.snacks': 'Naggetslar: firma qutisida.',
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (e) => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (e.key === 'Home') { e.preventDefault(); select(tabs[0], true); }
      else if (e.key === 'End') { e.preventDefault(); select(tabs[tabs.length - 1], true); }
      else if (d) { e.preventDefault(); select(tabs[(i + d + tabs.length) % tabs.length], true); }
    });
  });

  // ---------- open now, in Tashkent time (UTC+5) ----------
  function tashkentMinutes() {
    const now = new Date();
    return ((now.getUTCHours() + 5) % 24) * 60 + now.getUTCMinutes();
  }
  const toMin = (s) => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
  function isOpen(open, close, m) {
    const o = toMin(open), c = toMin(close);
    return c > o ? m >= o && m < c : m >= o || m < c; // closes after midnight
  }
  function updateStatus() {
    const m = tashkentMinutes();
    let openCount = 0;
    document.querySelectorAll('[data-places] li[data-open]').forEach((li) => {
      const el = li.querySelector('[data-status]');
      const on = isOpen(li.dataset.open, li.dataset.close, m);
      if (on) openCount++;
      el.textContent = on ? `${t('st.open')}` : `${t('st.closed')}, ${li.dataset.open} ${t('st.opens')}`;
      if (lang === 'ru' && !on) el.textContent = `${t('st.closed')}, ${t('st.opens')} ${li.dataset.open}`;
      el.classList.toggle('is-open', on);
    });
    const now = document.querySelector('[data-now]');
    if (now) now.textContent = openCount ? t('now.some')(openCount) : t('now.none');
  }
  setInterval(updateStatus, 60000);

  // ---------- videos play only while on screen ----------
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting && !reduce) {
        if (target.preload === 'none') target.preload = 'auto';
        target.play().catch(() => {});
      } else target.pause();
    });
  }, { threshold: 0.35 });
  document.querySelectorAll('video[data-autoplay]').forEach((v) => io.observe(v));

  document.querySelectorAll('[data-sound]').forEach((btn) => {
    const v = btn.closest('.reel__media').querySelector('video');
    btn.addEventListener('click', () => {
      const unmute = v.muted;
      document.querySelectorAll('video').forEach((o) => { o.muted = true; });
      document.querySelectorAll('[data-sound]').forEach((b) => b.setAttribute('aria-pressed', 'false'));
      v.muted = !unmute;
      btn.setAttribute('aria-pressed', String(unmute));
      if (unmute) v.play().catch(() => {});
    });
  });

  applyLang(lang);
})();
