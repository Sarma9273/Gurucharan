(() => {
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('gc-theme');
  const preferred = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  root.dataset.theme = savedTheme || preferred;

  document.querySelector('[data-theme-toggle]')?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem('gc-theme', next);
  });

  const menu = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('.main-nav');
  menu?.addEventListener('click', () => {
    const open = nav?.classList.toggle('open') || false;
    menu.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  });
  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menu?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }));

  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach((link) => {
    const href = link.getAttribute('href')?.replace('./', '') || '';
    if (href === current || (current === '' && href === 'index.html')) link.setAttribute('aria-current', 'page');
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));

  const cursor = document.querySelector('[data-cursor]');
  if (cursor && matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y;
    addEventListener('pointermove', (event) => { tx = event.clientX; ty = event.clientY; }, { passive: true });
    const loop = () => {
      x += (tx - x) * 0.18; y += (ty - y) * 0.18;
      cursor.style.transform = `translate3d(${x}px,${y}px,0)`;
      requestAnimationFrame(loop);
    };
    loop();
    document.querySelectorAll('a,button,input,textarea,select').forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('active'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });
  } else if (cursor) cursor.remove();

  const loader = document.querySelector('[data-loader]');
  if (loader) {
    const seen = sessionStorage.getItem('gc-intro-seen') === '1';
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finish = () => {
      sessionStorage.setItem('gc-intro-seen', '1');
      loader.classList.add('complete');
      document.body.classList.remove('intro-lock');
      setTimeout(() => loader.remove(), 700);
    };
    if (seen || reduce) loader.remove();
    else {
      document.body.classList.add('intro-lock');
      const bar = loader.querySelector('[data-loader-bar]');
      const percent = loader.querySelector('[data-loader-percent]');
      const message = loader.querySelector('[data-loader-message]');
      const messages = ['Initialising identity layer…','Connecting security projects…','Synchronising Drive journal…','Calibrating intelligence core…','Security intelligence ready.'];
      let value = 0;
      const timer = setInterval(() => {
        value = Math.min(100, value + Math.ceil(Math.random() * 12));
        if (bar) bar.style.width = `${value}%`;
        if (percent) percent.textContent = `${String(value).padStart(2,'0')}%`;
        if (message) message.textContent = messages[Math.min(messages.length - 1, Math.floor(value / 23))];
        if (value >= 100) { clearInterval(timer); setTimeout(finish, 350); }
      }, 110);
      loader.querySelector('[data-loader-skip]')?.addEventListener('click', () => { clearInterval(timer); finish(); });
    }
  }

  const data = window.GC_DATA || {};
  const focusButtons = [...document.querySelectorAll('[data-focus]')];
  const focusLabel = document.querySelector('[data-focus-label]');
  const focusHeadline = document.querySelector('[data-focus-headline]');
  const focusDescription = document.querySelector('[data-focus-description]');
  const focusSignals = document.querySelector('[data-focus-signals]');
  focusButtons.forEach((button) => button.addEventListener('click', () => {
    const area = data.focus?.find((item) => item.id === button.dataset.focus);
    if (!area) return;
    focusButtons.forEach((item) => item.classList.toggle('active', item === button));
    if (focusLabel) focusLabel.textContent = area.label;
    if (focusHeadline) focusHeadline.textContent = area.headline;
    if (focusDescription) focusDescription.textContent = area.description;
    if (focusSignals) {
      focusSignals.replaceChildren(...area.signals.map((signal) => {
        const span = document.createElement('span'); span.textContent = signal; return span;
      }));
    }
    dispatchEvent(new CustomEvent('gc-focus-change', { detail: area }));
  }));

  const archButtons = [...document.querySelectorAll('[data-arch-index]')];
  const archFields = {
    label: document.querySelector('[data-arch-label]'), title: document.querySelector('[data-arch-title]'),
    purpose: document.querySelector('[data-arch-purpose]'), input: document.querySelector('[data-arch-input]'),
    output: document.querySelector('[data-arch-output]'), status: document.querySelector('[data-arch-status]'),
    tech: document.querySelector('[data-arch-tech]')
  };
  archButtons.forEach((button) => button.addEventListener('click', () => {
    const stage = data.architecture?.[Number(button.dataset.archIndex)];
    if (!stage) return;
    archButtons.forEach((item) => item.classList.toggle('active', item === button));
    const values = { label: stage[0], title: stage[1], purpose: stage[2], input: stage[3], output: stage[4], status: stage[5], tech: stage[6] };
    Object.entries(archFields).forEach(([key, node]) => { if (node) node.textContent = values[key]; });
  }));

  const techButtons = [...document.querySelectorAll('[data-tech]')];
  const techHeadline = document.querySelector('[data-tech-headline]');
  const techEvidence = document.querySelector('[data-tech-evidence]');
  const techLearning = document.querySelector('[data-tech-learning]');
  techButtons.forEach((button) => button.addEventListener('click', () => {
    const group = data.techGroups?.find((item) => item.id === button.dataset.tech);
    if (!group) return;
    techButtons.forEach((item) => item.classList.toggle('active', item === button));
    if (techHeadline) techHeadline.textContent = group.headline;
    if (techLearning) techLearning.textContent = group.learning;
    if (techEvidence) {
      techEvidence.replaceChildren(...group.items.map(([name, evidence]) => {
        const row = document.createElement('div');
        const strong = document.createElement('strong'); const span = document.createElement('span');
        strong.textContent = name; span.textContent = evidence; row.append(strong, span); return row;
      }));
    }
  }));

  const rail = document.querySelector('[data-project-rail]');
  if (rail && matchMedia('(pointer:fine)').matches) {
    rail.addEventListener('wheel', (event) => {
      if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        event.preventDefault();
        rail.scrollLeft += event.deltaY * 1.15;
      }
    }, { passive: false });
  }
})();
