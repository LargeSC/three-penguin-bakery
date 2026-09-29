# Three Penguin Bakery

Sitio estático de una sola página para Three Penguin Bakery (Puerto Vallarta, Jalisco).
Los pedidos se levantan por correo — no hay backend, carrito ni pasarela de pago.

Implementación de la pieza de Claude Design
[`Three Penguin Bakery.dc.html`](https://claude.ai/design/p/dc4abb60-d608-487e-aab2-c36c7886ee11?file=Three+Penguin+Bakery.dc.html).

## Estructura

```
index.html          Marcado de la página
styles.css          Estilos (tokens de color en :root)
app.js              Armador de pedidos → construye el mailto
assets/logo.jpeg    Pingüino pastelero (también sirve de favicon y og:image)
design/             Fuente original de Claude Design, tal cual se importó
```

`design/` es solo referencia. Ábrelo con un servidor local para ver el diseño original:
`support.js` es el runtime de Claude Design y carga React y Babel desde unpkg en
tiempo de ejecución. El sitio que se publica es el de la raíz, que no depende de nada de eso.

## Correr en local

```sh
python3 -m http.server 8000
# http://localhost:8000
```

Cualquier hosting estático sirve (Netlify, GitHub Pages, Cloudflare Pages): se sube la
raíz tal cual, sin build. `design/` se puede excluir del deploy.

## Cómo funciona el pedido

Cada tarjeta tiene un enlace `mailto:` con el asunto y el cuerpo ya escritos.
El formulario "Armar mi pedido" hace lo mismo pero con los datos que captura el cliente:
`app.js` arma el `mailto:` y abre el cliente de correo. **Nada se envía solo** — el
correo queda redactado y la persona lo revisa antes de mandarlo. Sin JavaScript el
formulario no arma el correo, pero los tres enlaces de las tarjetas siguen funcionando
(hay un `<noscript>` que lo explica).

El campo de fecha se limita a partir de hoy + 2 días, para que empate con el
"Avísanos 2 días antes" del menú.

## Qué falta / qué cambiar

- **Fotos de los productos.** Cacao Surprise ya tiene foto; las otras dos tarjetas traen
  un bloque de color a rayas como placeholder. Para poner la foto real, dentro del
  `<div class="cake__photo …">` sustituye el `<span class="cake__photo-note">` por
  `<img class="cake__photo-img" src="assets/….jpeg" alt="…">` (la clase ya está en el CSS,
  recorta a 4:3) y deja el `<span class="cake__tag">` donde está.
- **Precios y nombres** viven en tres lugares por pastel: el texto de la tarjeta, el
  `href` del `mailto:` de esa tarjeta y el `value`/`data-options` del radio en el
  formulario. Si cambia un precio, hay que tocar los tres.
- **Correo de contacto:** `threepenguinbakery@gmail.com` aparece en los `mailto:` de las
  tarjetas, en `data-email` del formulario y en el pie de página.

## Notas de implementación

- Los colores, tipografías, bordes de 3px y sombras duras salen tal cual del diseño;
  están como custom properties al inicio de `styles.css`.
- El selector de pastel se implementó con `input[type=radio]` en vez de botones (como
  en el diseño) para que funcione con teclado y lectores de pantalla; se ve igual.
- Se respeta `prefers-reduced-motion`: se ocultan las chispas que caen y se detiene el
  flotado del logo.
- Tipografías: Baloo 2 y Nunito desde Google Fonts.
