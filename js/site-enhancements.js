(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-current-year], #nw-current-year").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });

    var progress = document.getElementById("nw-page-progress-bar");
    var back = document.getElementById("nw-back-to-top");
    var scrollFrame = 0;

    function updateScrollUi() {
      scrollFrame = 0;
      var doc = document.documentElement;
      var max = Math.max(1, doc.scrollHeight - doc.clientHeight);
      var ratio = Math.min(1, Math.max(0, window.scrollY / max));
      if (progress) progress.style.transform = "scaleX(" + ratio + ")";
      if (back) back.classList.toggle("is-visible", window.scrollY > 700);
    }

    function requestScrollUiUpdate() {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(updateScrollUi);
    }

    updateScrollUi();
    window.addEventListener("scroll", requestScrollUiUpdate, { passive: true });
    window.addEventListener("resize", requestScrollUiUpdate, { passive: true });

    if (back) {
      back.addEventListener("click", function () {
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
        });
      });
    }

    var faqItems = Array.prototype.slice.call(document.querySelectorAll(".nw-faq-item"));
    faqItems.forEach(function (item) {
      item.addEventListener("toggle", function () {
        if (!item.open) return;
        faqItems.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      });
    });

    var revealSelector = [
      ".nw-features-heading",
      ".nw-workflow-line",
      ".nw-feature-card",
      ".nw-more-features",
      ".nw-migration-copy",
      ".nw-migration-data",
      ".nw-migration-steps span",
      ".nw-security-grid",
      ".nw-about-panel",
      ".nw-pricing-heading",
      ".nw-plan-showcase",
      ".nw-faq-heading",
      ".nw-faq-item",
      ".nw-faq-card",
      ".nw-download-copy",
      ".nw-download-form-card",
      ".nw-footer__top",
      ".nw-footer__bottom"
    ].join(",");

    var revealItems = Array.prototype.slice.call(document.querySelectorAll(revealSelector));
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!("IntersectionObserver" in window) || reduceMotion) {
      revealItems.forEach(function (item) {
        item.classList.add("nw-reveal", "is-visible");
      });
      return;
    }

    revealItems.forEach(function (item, index) {
      item.classList.add("nw-reveal");
      item.style.setProperty("--nw-reveal-delay", (index % 3) * 60 + "ms");
    });

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -32px 0px"
    });

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  });
})();
