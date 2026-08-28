(function () {
  "use strict";

  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var form = document.getElementById("review_form");
    if (!form) return;

    form.noValidate = true;

    var button = document.getElementById("enviar_mensaje");
    var buttonLabel = button ? button.querySelector("span") : null;
    var buttonIcon = button ? button.querySelector("i") : null;
    var status = document.getElementById("contact_status");
    var subject = document.getElementById("asunto");

    var fields = [
      { input: document.getElementById("nombre"), message: "Introduce tu nombre y apellidos." },
      { input: document.getElementById("email"), message: "Introduce un correo electrónico válido." },
      { input: document.getElementById("telefono"), message: "Revisa el número de teléfono." },
      { input: subject, message: "Selecciona el motivo de tu consulta." },
      { input: document.getElementById("mensaje"), message: "Cuéntanos brevemente qué necesitas (al menos 10 caracteres)." }
    ].filter(function (field) { return field.input; });

    var consent = document.getElementById("privacidad");
    var consentError = document.getElementById("privacidad-error");

    function errorElement(input) {
      var describedBy = (input.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean);
      for (var i = 0; i < describedBy.length; i += 1) {
        var el = document.getElementById(describedBy[i]);
        if (el && el.classList.contains("nw-contact-field-error")) return el;
      }
      return null;
    }

    function setFieldError(field, message) {
      var input = field.input;
      var wrapper = input.closest("label");
      var error = errorElement(input);

      if (wrapper) wrapper.classList.toggle("has-error", Boolean(message));
      input.setAttribute("aria-invalid", message ? "true" : "false");
      if (error) error.textContent = message || "";
    }

    function validateField(field) {
      var input = field.input;
      var value = (input.value || "").trim();

      if (input.required && !value) {
        setFieldError(field, field.message);
        return false;
      }

      if (value && input.type === "email") {
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailPattern.test(value)) {
          setFieldError(field, field.message);
          return false;
        }
      }

      if (value && input.type === "tel") {
        var digits = value.replace(/\D/g, "");
        if (digits.length < 7 || digits.length > 15) {
          setFieldError(field, field.message);
          return false;
        }
      }

      if (value && input.minLength > 0 && value.length < input.minLength) {
        setFieldError(field, field.message);
        return false;
      }

      setFieldError(field, "");
      return true;
    }

    function validateConsent() {
      if (!consent) return true;
      var valid = consent.checked;
      var wrapper = consent.closest(".nw-contact-consent");
      if (wrapper) wrapper.classList.toggle("has-error", !valid);
      consent.setAttribute("aria-invalid", valid ? "false" : "true");
      if (consentError) {
        consentError.textContent = valid ? "" : "Debes aceptar la política de privacidad para enviar el mensaje.";
      }
      return valid;
    }

    function clearStatus() {
      if (!status) return;
      status.className = "nw-contact-status";
      status.textContent = "";
      status.setAttribute("role", "status");
    }

    function showError(message) {
      if (!status) return;
      status.className = "nw-contact-status is-error";
      status.setAttribute("role", "alert");
      status.textContent = message;
    }

    function setSubmitting(submitting) {
      if (!button) return;
      button.disabled = submitting;
      button.setAttribute("aria-busy", submitting ? "true" : "false");
      form.setAttribute("aria-busy", submitting ? "true" : "false");
      if (buttonLabel) buttonLabel.textContent = submitting ? "Enviando…" : "Enviar mensaje";
      if (buttonIcon) {
        buttonIcon.className = submitting ? "fa fa-spinner fa-spin" : "fa fa-paper-plane-o";
      }
    }

    function preselectSubject() {
      if (!subject) return;
      var params = new URLSearchParams(window.location.search);
      var query = params.get("motivo") || params.get("asunto");
      if (!query) return;

      var aliases = {
        prueba: "Prueba gratuita",
        migracion: "Migración",
        soporte: "Soporte",
        contratacion: "Contratación y facturación",
        consulta: "Otra consulta"
      };
      var raw = query.trim();
      var wanted = (aliases[raw.toLowerCase()] || raw).toLowerCase();

      Array.prototype.some.call(subject.options, function (option) {
        var matches = option.value.toLowerCase() === wanted ||
          option.textContent.trim().toLowerCase() === wanted;
        if (matches) subject.value = option.value;
        return matches;
      });
    }

    fields.forEach(function (field) {
      var eventName = field.input.tagName === "SELECT" ? "change" : "input";

      field.input.addEventListener("blur", function () {
        validateField(field);
      });

      field.input.addEventListener(eventName, function () {
        if (field.input.getAttribute("aria-invalid") === "true") {
          validateField(field);
        }
        clearStatus();
      });
    });

    if (consent) {
      consent.addEventListener("change", function () {
        validateConsent();
        clearStatus();
      });
    }

    preselectSubject();

    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      clearStatus();

      var valid = true;
      fields.forEach(function (field) {
        if (!validateField(field)) valid = false;
      });
      if (!validateConsent()) valid = false;

      if (!valid || !form.checkValidity()) {
        showError("Revisa los campos indicados antes de enviar el mensaje.");
        var firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var honeypot = document.getElementById("contact-company-web");
      if (honeypot && honeypot.value) return;

      setSubmitting(true);

      try {
        var response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { "Accept": "application/json" }
        });

        if (!response.ok) throw new Error("No se pudo enviar el mensaje.");
        window.location.assign("gracias.html");
      } catch (error) {
        showError("No hemos podido enviar el mensaje. Comprueba tu conexión o inténtalo de nuevo dentro de unos minutos.");
        setSubmitting(false);
      }
    });
  });
})();