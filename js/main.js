/* ============================================================
   MASA ENTERPRISE — GLOBAL JS
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ── NAV SCROLL ─────────────────────────────────────────── */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── MOBILE DRAWER ──────────────────────────────────────── */
  const toggle = document.querySelector('.nav-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const bars   = document.querySelectorAll('.nav-toggle span');
  let drawerOpen = false;

  if (toggle && drawer) {
    toggle.addEventListener('click', () => {
      drawerOpen = !drawerOpen;
      drawer.classList.toggle('open', drawerOpen);
      document.body.style.overflow = drawerOpen ? 'hidden' : '';
      if (drawerOpen) {
        if (bars[0]) bars[0].style.cssText = 'transform:translateY(7px) rotate(45deg)';
        if (bars[1]) bars[1].style.cssText = 'opacity:0';
        if (bars[2]) bars[2].style.cssText = 'transform:translateY(-7px) rotate(-45deg)';
      } else {
        bars.forEach(b => (b.style.cssText = ''));
      }
    });
  }

  /* Close drawer on mobile link click */
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (drawer) {
        drawer.classList.remove('open');
        document.body.style.overflow = '';
        bars.forEach(b => (b.style.cssText = ''));
        drawerOpen = false;
      }
    });
  });

  /* ── ACTIVE NAV LINK HIGHLIGHT ──────────────────────────── */
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/index.html';
  document.querySelectorAll('a.nav-link, a.di, a.mobile-nav-link, a.flink').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    // Normalise: strip leading ./  and trailing /
    const norm = href.replace(/^\.\//, '').replace(/\/$/, '');
    if (currentPath.endsWith(norm) && norm.length > 1) {
      link.classList.add('active');
    }
  });

  /* ── SCROLL-REVEAL ──────────────────────────────────────── */
  const style = document.createElement('style');
  style.textContent = '.reveal.visible{opacity:1!important;transform:translateY(0)!important}';
  document.head.appendChild(style);

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal').forEach(el => {
    el.style.cssText += 'opacity:0;transform:translateY(28px);transition:opacity 0.55s ease,transform 0.55s ease;';
    revealObs.observe(el);
  });

  /* ── COUNTER ANIMATION ──────────────────────────────────── */
  /**
   * Animates any element with [data-count="TARGET_NUMBER"].
   * Counts from 0 to TARGET over ~1.8s using easeOutExpo.
   * Supports suffixes like "+" or "%" by preserving non-numeric tail.
   * Fires once when element enters the viewport.
   */
  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function animateCounter(el) {
    const raw      = el.getAttribute('data-count');        // e.g. "500", "24", "10"
    const suffix   = el.getAttribute('data-suffix') || ''; // e.g. "+", "%", "/7"
    const target   = parseFloat(raw);
    const decimals = raw.includes('.') ? raw.split('.')[1].length : 0;
    const duration = 1800; // ms
    let start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      const elapsed  = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutExpo(progress);
      const current  = eased * target;
      el.textContent = current.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(decimals) + suffix; // ensure exact final value
    }

    requestAnimationFrame(step);
  }

  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        counterObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => {
    el.textContent = '0'; // start at zero before animation fires
    counterObs.observe(el);
  });

  /* ── FOOTER YEAR ────────────────────────────────────────── */
  document.querySelectorAll('.year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

});
