(function () {
  "use strict";

  function init() {
    var form = document.getElementById("review_form");
    if (!form) return;

    var button = document.getElementById("enviar_mensaje");
    var label = button ? button.querySelector("span") : null;
    var status = document.getElementById("contact_status");

    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      if (button) {
        button.disabled = true;
        button.setAttribute("aria-busy", "true");
      }
      if (label) label.textContent = "Enviando…";
      if (status) {
        status.textContent = "";
        status.className = "nw-contact-status";
      }

      try {
        var response = await fetch("https://formspree.io/f/maeyyloe", {
          method: "POST",
          body: new FormData(form),
          headers: {
            "Accept": "application/json"
          }
        });

        if (!response.ok) {
          var data = null;
          try {
            data = await response.json();
          } catch (_) {}

          var message = "Formspree ha rechazado el envío.";
          if (data && Array.isArray(data.errors) && data.errors.length) {
            message = data.errors.map(function (e) {
              return e.message || "Error de Formspree";
            }).join(" ");
          }
          throw new Error(message);
        }

        window.location.href = "gracias.html";
      } catch (error) {
        if (status) {
          status.className = "nw-contact-status is-error";
          status.setAttribute("role", "alert");
          status.textContent =
            "No hemos podido enviar el mensaje. " +
            (error && error.message ? error.message : "Inténtalo de nuevo.");
        }

        if (button) {
          button.disabled = false;
          button.removeAttribute("aria-busy");
        }
        if (label) label.textContent = "Enviar mensaje";
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();