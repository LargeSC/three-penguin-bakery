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
  var flavorPicker = document.getElementById("flavor-picker");
  var flavorOptions = document.getElementById("flavor-options");

  function selectedCake() {
    return form.querySelector('input[name="cake"]:checked');
  }

  function selectedQty() {
    return form.querySelector('input[name="qty"]:checked');
  }

  function selectedFlavor() {
    return form.querySelector('input[name="flavor"]:checked');
  }

  // data-options="6 galletas:75|12 galletas:145" → [{label, price}, …]
  function parseOptions(input) {
    return input.dataset.options.split("|").map(function (pair) {
      var parts = pair.split(":");
      return { label: parts[0], price: parts[1] };
    });
  }

  // data-flavors="Fresa|Chocolate|Caramelo" → ["Fresa", …]; sin atributo, [].
  function parseFlavors(input) {
    return input.dataset.flavors ? input.dataset.flavors.split("|") : [];
  }

  function makeRadio(name, value, text) {
    var label = document.createElement("label");
    label.className = "picker__opt";
    var input = document.createElement("input");
    input.type = "radio";
    input.name = name;
    input.value = value;
    var face = document.createElement("span");
    face.className = "picker__face";
    face.textContent = text;
    label.appendChild(input);
    label.appendChild(face);
    return label;
  }

  // Cada producto tiene sus propias cantidades; con una sola opción no
  // hace falta preguntar y escondemos el selector.
  function renderQty() {
    var options = parseOptions(selectedCake());
    qtyOptions.textContent = "";
    options.forEach(function (opt, i) {
      var label = makeRadio("qty", opt.label, opt.label + " · $" + opt.price);
      var input = label.firstChild;
      input.dataset.price = opt.price;
      input.checked = i === 0;
      qtyOptions.appendChild(label);
    });
    qtyPicker.hidden = options.length < 2;
  }

  // El sabor solo aplica a algunos productos. No viene preseleccionado:
  // queremos que el cliente lo elija, así que el primero lleva `required`.
  function renderFlavors() {
    var flavors = parseFlavors(selectedCake());
    flavorOptions.textContent = "";
    flavors.forEach(function (flavor, i) {
      var label = makeRadio("flavor", flavor, flavor);
      label.firstChild.required = i === 0;
      flavorOptions.appendChild(label);
    });
    flavorPicker.hidden = flavors.length === 0;
  }

  form.addEventListener("change", function (event) {
    if (event.target.name === "cake") {
      renderQty();
      renderFlavors();
    }
  });
  renderQty();
  renderFlavors();

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
    var flavor = selectedFlavor();
    var name = form.elements.name.value.trim();
    var zone = form.elements.zone.value.trim();
    var phone = form.elements.phone.value.trim();

    var body = [
      "¡Hola Three Penguin Bakery!",
      "",
      "Quiero pedir " + cake.value + ": " + qty.value + " ($" + qty.dataset.price + ")" +
        (flavor ? ", sabor " + flavor.value.toLowerCase() : "") + ".",
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
