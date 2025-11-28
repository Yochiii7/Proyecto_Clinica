# proyecto_clinica

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
## Nuevos endpoints (reportes)

Se añadieron dos endpoints en la API de citas:

- GET /api/citas/reporte/por-fechas?fecha_desde=YYYY-MM-DD&fecha_hasta=YYYY-MM-DD
  - Devuelve la lista de citas cuya fecha está entre fecha_desde y fecha_hasta (inclusive)
  Nota: por defecto este endpoint filtra por la **fecha de registro** (`fecha_creacion`) — la UI del reporte también filtra únicamente por fecha de registro.

  Opcionalmente puedes pedir que filtre por la fecha de la consulta (campo `fecha`) añadiendo el parámetro query `filter_by=fecha`.
  - Parámetros válidos: `filter_by=fecha_creacion` (por defecto) o `filter_by=fecha`.

- GET /api/citas/reporte/ranking-pacientes
  - Devuelve un ranking de pacientes con el total de citas por paciente (orden descendente)

- GET /api/citas/reporte/ranking-especialidades
  - Devuelve un ranking de especialidades por número de solicitudes (orden descendente)

Puedes probarlos con los scripts incluidos en el directorio `scripts/`:

```sh
# Ejecutar reporte por fechas (últimos 30 días)
node scripts/test-reporte-fechas.js

# Ejecutar ranking de pacientes
node scripts/test-ranking-pacientes.js

# Ejecutar ranking de especialidades
node scripts/test-ranking-especialidades.js
```
