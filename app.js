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

  var qtyPicker = document.getElementById("qty-picker");
  var qtyOptions = document.getElementById("qty-options");

  function selectedCake() {
    return form.querySelector('input[name="cake"]:checked');
  }

  function selectedQty() {
    return form.querySelector('input[name="qty"]:checked');
  }

  // data-options="6 galletas:75|12 galletas:145" → [{label, price}, …]
  function parseOptions(input) {
    return input.dataset.options.split("|").map(function (pair) {
      var parts = pair.split(":");
      return { label: parts[0], price: parts[1] };
    });
  }

  // Cada producto tiene sus propias cantidades; con una sola opción no
  // hace falta preguntar y escondemos el selector.
  function renderQty() {
    var options = parseOptions(selectedCake());
    qtyOptions.textContent = "";
    options.forEach(function (opt, i) {
      var label = document.createElement("label");
      label.className = "picker__opt";
      var input = document.createElement("input");
      input.type = "radio";
      input.name = "qty";
      input.value = opt.label;
      input.dataset.price = opt.price;
      input.checked = i === 0;
      var face = document.createElement("span");
      face.className = "picker__face";
      face.textContent = opt.label + " · $" + opt.price;
      label.appendChild(input);
      label.appendChild(face);
      qtyOptions.appendChild(label);
    });
    qtyPicker.hidden = options.length < 2;
  }

  form.addEventListener("change", function (event) {
    if (event.target.name === "cake") renderQty();
  });
  renderQty();

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
    var qty = selectedQty();
    var name = form.elements.name.value.trim();
    var zone = form.elements.zone.value.trim();
    var phone = form.elements.phone.value.trim();

    var body = [
      "¡Hola Three Penguin Bakery!",
      "",
      "Quiero pedir " + cake.value + ": " + qty.value + " ($" + qty.dataset.price + ").",
      "",
      "Nombre: " + name,
      "Fecha que lo necesito: " + formatDate(dateInput.value),
      "Colonia en Puerto Vallarta: " + zone,
      "Teléfono/WhatsApp: " + phone,
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
