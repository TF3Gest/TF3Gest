(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", function () {
    var progress = document.getElementById("nw-page-progress-bar");
    var back = document.getElementById("nw-back-to-top");

    function updateScrollUi() {
      var doc = document.documentElement;
      var max = Math.max(1, doc.scrollHeight - doc.clientHeight);
      var ratio = Math.min(1, Math.max(0, window.scrollY / max));
      if (progress) progress.style.transform = "scaleX(" + ratio + ")";
      if (back) back.classList.toggle("is-visible", window.scrollY > 700);
    }
    updateScrollUi();
    window.addEventListener("scroll", updateScrollUi, { passive: true });

    if (back) {
      back.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      });
    }

    var faqItems = Array.prototype.slice.call(document.querySelectorAll(".nw-faq-item"));
    faqItems.forEach(function (item) {
      item.addEventListener("toggle", function () {
        if (!item.open) return;
        faqItems.forEach(function (other) { if (other !== item) other.open = false; });
      });
    });

    var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nw-main-nav [data-section]"));
    if (navLinks.length && "IntersectionObserver" in window) {
      var sections = navLinks.map(function (link) { return document.getElementById(link.dataset.section); }).filter(Boolean);
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (link) {
            var active = link.dataset.section === entry.target.id;
            link.classList.toggle("is-active", active);
            if (active) link.setAttribute("aria-current", "location"); else link.removeAttribute("aria-current");
          });
        });
      }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
      sections.forEach(function (section) { observer.observe(section); });
    }
  });
})();
