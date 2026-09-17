/* ==========================================================================
   BR HIDRÁULICA — interações
   ========================================================================== */
(function () {
  'use strict';

  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  /* ---------- Barra de progresso de rolagem ---------- */
  const bar = $('.progressbar');
  const header = $('.header');

  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
    if (header) header.classList.toggle('is-stuck', y > 40);
    const top = $('.totop');
    if (top) top.classList.toggle('is-on', y > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const d = e.target.dataset.delay || 0;
          setTimeout(() => e.target.classList.add('is-in'), d);
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px' }
  );
  $$('[data-reveal]').forEach((el) => io.observe(el));

  /* Rede de segurança: se o IntersectionObserver não disparar (navegador antigo,
     aba em background, prefers-reduced-motion), tudo aparece mesmo assim. */
  setTimeout(() => $$('[data-reveal]:not(.is-in)').forEach((el) => el.classList.add('is-in')), 3000);

  /* ---------- Mega menu (desktop) ---------- */
  $$('.nav__item--has').forEach((item) => {
    let t;
    item.addEventListener('mouseenter', () => {
      clearTimeout(t);
      $$('.nav__item--has').forEach((o) => o !== item && o.classList.remove('is-open'));
      item.classList.add('is-open');
    });
    item.addEventListener('mouseleave', () => {
      t = setTimeout(() => item.classList.remove('is-open'), 140);
    });
    const link = $('.nav__link', item);
    link.addEventListener('click', (ev) => {
      if (window.matchMedia('(hover: none)').matches) {
        ev.preventDefault();
        item.classList.toggle('is-open');
      }
    });
  });

  /* ---------- Menu mobile ---------- */
  const burger = $('.burger');
  const drawer = $('.drawer');
  const scrim = $('.scrim');
  function closeDrawer() {
    drawer && drawer.classList.remove('is-open');
    scrim && scrim.classList.remove('is-on');
    burger && burger.classList.remove('is-on');
    document.body.style.overflow = '';
  }
  function openDrawer() {
    drawer.classList.add('is-open');
    scrim.classList.add('is-on');
    burger.classList.add('is-on');
    document.body.style.overflow = 'hidden';
  }
  if (burger) burger.addEventListener('click', () => (drawer.classList.contains('is-open') ? closeDrawer() : openDrawer()));
  if (scrim) scrim.addEventListener('click', closeDrawer);
  $$('.drawer__close, .drawer a').forEach((el) => el.addEventListener('click', closeDrawer));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && closeDrawer());

  /* ---------- Hero slider ---------- */
  const slides = $$('.hero__slide');
  const dots = $$('.hero__dots button');
  if (slides.length > 1) {
    let i = 0;
    let timer;
    const go = (n) => {
      slides[i].classList.remove('is-on');
      dots[i] && dots[i].classList.remove('is-on');
      i = (n + slides.length) % slides.length;
      slides[i].classList.add('is-on');
      dots[i] && dots[i].classList.add('is-on');
    };
    const start = () => (timer = setInterval(() => go(i + 1), 6500));
    dots.forEach((d, n) =>
      d.addEventListener('click', () => {
        clearInterval(timer);
        go(n);
        start();
      })
    );
    start();
  }

  /* ---------- Contadores ---------- */
  const counters = $$('[data-count]');
  if (counters.length) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          const end = parseFloat(el.dataset.count);
          const prefix = el.dataset.prefix || '';
          const sep = !('nosep' in el.dataset); /* anos não levam separador de milhar */
          const fmt = (n) => (sep ? n.toLocaleString('pt-BR') : String(n));
          const dur = 1600;
          const t0 = performance.now();
          const step = (t) => {
            const p = Math.min((t - t0) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = prefix + fmt(Math.round(end * eased));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          cio.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => cio.observe(c));

    /* Se a animação não rodar, mostra o número final em vez de zero. */
    setTimeout(() => {
      counters.forEach((el) => {
        if (el.textContent === '0') {
          const n = parseFloat(el.dataset.count);
          el.textContent = (el.dataset.prefix || '') + ('nosep' in el.dataset ? String(n) : n.toLocaleString('pt-BR'));
        }
      });
    }, 3000);
  }

  /* ---------- Abas ---------- */
  $$('[data-tabs]').forEach((group) => {
    const tabs = $$('.tab', group);
    const panels = $$('.tabpanel', group);
    tabs.forEach((tab, n) =>
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.classList.remove('is-on'));
        panels.forEach((p) => p.classList.remove('is-on'));
        tab.classList.add('is-on');
        panels[n] && panels[n].classList.add('is-on');
      })
    );
  });

  /* ---------- FAQ ---------- */
  $$('.faq__item').forEach((item) => {
    const q = $('.faq__q', item);
    const a = $('.faq__a', item);
    q.addEventListener('click', () => {
      const open = item.classList.contains('is-open');
      $$('.faq__item').forEach((o) => {
        o.classList.remove('is-open');
        $('.faq__a', o).style.maxHeight = null;
      });
      if (!open) {
        item.classList.add('is-open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Vídeo institucional ---------- */
  const playBtn = $('.playbtn');
  if (playBtn) {
    const video = $('#institucional');
    playBtn.addEventListener('click', () => {
      playBtn.classList.add('is-hidden');
      video.setAttribute('controls', '');
      video.play();
    });
    video.addEventListener('pause', () => playBtn.classList.remove('is-hidden'));
  }

  /* ---------- Marquee: duplica os itens para loop contínuo ---------- */
  $$('.marquee__track').forEach((track) => {
    track.innerHTML += track.innerHTML;
  });

  /* ---------- Voltar ao topo ---------- */
  const totop = $('.totop');
  if (totop) totop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Formulários (envio via WhatsApp) ---------- */
  $$('form[data-whats]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const d = new FormData(form);
      const linhas = [];
      linhas.push('*Novo contato pelo site BR Hidráulica*');
      for (const [k, v] of d.entries()) {
        if (String(v).trim()) linhas.push('*' + k + ':* ' + v);
      }
      const url = 'https://wa.me/' + form.dataset.whats + '?text=' + encodeURIComponent(linhas.join('\n'));
      window.open(url, '_blank', 'noopener');
      form.reset();
      const ok = $('.form-ok', form.parentNode);
      if (ok) {
        ok.hidden = false;
        setTimeout(() => (ok.hidden = true), 6000);
      }
    });
  });

  /* ---------- Ano no rodapé ---------- */
  $$('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- Marca link ativo ---------- */
  const path = location.pathname.split('/').pop() || 'index.html';
  $$('.nav__link[href]').forEach((a) => {
    if (a.getAttribute('href') === path) a.classList.add('is-active');
  });
})();
