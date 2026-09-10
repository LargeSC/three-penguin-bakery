// Armador de pedidos: construye un mailto con los datos del formulario.
// Nada se envía solo — abrimos el cliente de correo y el cliente decide.

(function () {
  "use strict";

  var form = document.getElementById("order-form");
  if (!form) return;

  var status = document.getElementById("order-status");
  var dateInput = document.getElementById("tpb-date");
  var email = form.dataset.email || "threepenguinbakery@gmail.com";

  // "Avísanos 2 días antes": no dejamos elegir una fecha más cercana.
  var earliest = new Date();
  earliest.setDate(earliest.getDate() + 2);
  dateInput.min = earliest.toISOString().slice(0, 10);

  function selectedCake() {
    return form.querySelector('input[name="cake"]:checked');
  }

  function formatDate(value) {
    if (!value) return "";
    var parts = value.split("-");
    var d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return d.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!form.reportValidity()) return;

    var cake = selectedCake();
    var name = form.elements.name.value.trim();
    var zone = form.elements.zone.value.trim();

    var body = [
      "¡Hola Three Penguin Bakery!",
      "",
      "Quiero pedir un " + cake.value + " ($" + cake.dataset.price + ").",
      "",
      "Nombre: " + name,
      "Fecha que lo necesito: " + formatDate(dateInput.value),
      "Colonia en Puerto Vallarta: " + zone,
      "Teléfono/WhatsApp: ",
      "",
      "Gracias!"
    ].join("\n");

    window.location.href =
      "mailto:" + email +
      "?subject=" + encodeURIComponent("Pedido: " + cake.value) +
      "&body=" + encodeURIComponent(body);

    status.textContent = "Abrimos tu correo con el pedido de " + cake.value + " ✉️";
  });
})();
