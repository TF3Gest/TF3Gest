document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('#navbar_container');
  if (!container) return;

  const pageName = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const onHome = pageName === 'index.html' || pageName === '';
  const homeHref = anchor => onHome ? anchor : `index.html${anchor}`;

  container.innerHTML = `
    <div class="nw-nav__inner">
      <a class="nw-brand" href="${homeHref('#hero-section')}" aria-label="TF3Gest, inicio">
        <img src="images/tf3gest-logo.png?v=2" alt="" width="68" height="48">
        <span class="nw-brand__copy"><strong>TF3Gest</strong><small>Gestión y facturación para talleres</small></span>
      </a>
      <button class="nw-menu-toggle" type="button" aria-expanded="false" aria-controls="nw-main-nav" aria-label="Abrir menú">
        <span></span><span></span><span></span>
      </button>
      <nav class="nw-main-nav" id="nw-main-nav" aria-label="Navegación principal">
        <a data-section="benefits-section" href="${homeHref('#benefits-section')}">VeriFactu</a>
        <a data-section="features-section" href="${homeHref('#features-section')}">Funciones</a>
        <a data-section="migration-section" href="${homeHref('#migration-section')}">Migración</a>
        <a data-section="pricing-section" href="${homeHref('#pricing-section')}">Precio</a>
        <a data-section="faq-section" href="${homeHref('#faq-section')}">FAQ</a>
        <a href="contact.html"${pageName === 'contact.html' ? ' class="is-active" aria-current="page"' : ''}>Contacto</a>
        <a class="nw-nav-cta" href="${homeHref('#download-section')}">Solicitar demo <span aria-hidden="true">→</span></a>
      </nav>
    </div>`;

  const header = document.querySelector('.header');
  const toggle = container.querySelector('.nw-menu-toggle');
  const nav = container.querySelector('.nw-main-nav');
  const links = [...nav.querySelectorAll('[data-section]')];

  const closeMenu = (restoreFocus = false) => {
    nav.classList.remove('is-open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
    document.body.classList.remove('menu-open');
    if (restoreFocus) toggle.focus();
  };

  toggle.addEventListener('click', () => {
    const opening = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', opening);
    toggle.classList.toggle('is-open', opening);
    toggle.setAttribute('aria-expanded', String(opening));
    toggle.setAttribute('aria-label', opening ? 'Cerrar menú' : 'Abrir menú');
    document.body.classList.toggle('menu-open', opening);
  });

  nav.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('click', event => {
    if (!container.contains(event.target)) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) closeMenu(true);
  });
  window.addEventListener('resize', () => {
    if (innerWidth > 960) closeMenu();
  });

  const updateHeader = () => header?.classList.toggle('is-scrolled', scrollY > 8);
  updateHeader();
  addEventListener('scroll', updateHeader, { passive: true });

  if (onHome && 'IntersectionObserver' in window) {
    const sections = links.map(link => document.getElementById(link.dataset.section)).filter(Boolean);
    const observer = new IntersectionObserver(entries => {
      const current = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!current) return;
      links.forEach(link => {
        const active = link.dataset.section === current.target.id;
        link.classList.toggle('is-active', active);
        active ? link.setAttribute('aria-current','location') : link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-28% 0px -58% 0px', threshold: [0.05,.2,.5] });
    sections.forEach(section => observer.observe(section));
  }
});
