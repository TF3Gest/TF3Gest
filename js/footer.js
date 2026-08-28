(function () {
  const host = document.querySelector("[data-shared-footer]");
  if (!host) return;
  const year = new Date().getFullYear();
  host.outerHTML = `
<footer class="nw-footer">
  <div class="nw-footer__shell">
    <div class="nw-footer__top">
      <div class="nw-footer__brand">
        <a class="nw-footer__logo" href="index.html#inicio" aria-label="Volver al inicio">
          <img class="nw-footer__logo-image" src="images/tf3gest-logo-white.png?v=20260828e" alt="TF3Gest" decoding="async">
        </a>
        <p>Software de gestión y facturación para talleres.</p>
      </div>
      <div class="nw-footer__links">
        <div class="nw-footer__column"><strong>Producto</strong><a href="index.html#features-section">Funciones</a><a href="index.html#benefits-section">VeriFactu</a><a href="index.html#migration-section">Migración</a><a href="index.html#pricing-section">Precio</a></div>
        <div class="nw-footer__column"><strong>Información</strong><a href="index.html#faq-section">Preguntas frecuentes</a><a href="contact.html">Contacto</a></div>
        <div class="nw-footer__column"><strong>Legal</strong><a href="privacidad.html">Privacidad</a><a href="aviso-legal.html">Aviso legal</a><a href="declaracion-responsable.html">Declaraciones responsables</a></div>
      </div>
    </div>
    <div class="nw-footer__bottom"><p>© <span data-current-year>${year}</span> TF3Gest. Todos los derechos reservados.</p></div>
  </div>
</footer>`;
})();
