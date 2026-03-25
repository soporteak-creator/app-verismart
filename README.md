# VeriSmart Pitch Deck — Veritas.cl

Sitio estático multi-presentación. Listo para deploy en Vercel sin ningún build step.

## Estructura

```
/
├── index.html                          # Landing con cards de presentaciones
├── vercel.json                         # Rewrites para URLs limpias
├── shared/
│   ├── css/base.css                    # Design tokens + reset + componentes base
│   └── js/core.js                      # Counters, video autoplay, progress bar
├── brands/
│   └── verismart/
│       ├── index.html                  # Presentación completa (7 secciones)
│       ├── css/theme.css               # Identidad visual Veritas (navy + amber)
│       └── js/main.js                  # GSAP animations + Chart.js + data binding
└── data/
    └── verismart.json                  # Todos los datos/métricas de la presentación
```

## Deploy en Vercel

```bash
# Opción 1: CLI
npx vercel --prod

# Opción 2: Drag & drop
# Sube esta carpeta en vercel.com/new
```

No hay `npm install`, no hay build step. Vercel sirve los archivos estáticos directamente.

## Agregar una nueva presentación

1. Duplica la carpeta `brands/verismart/` → `brands/mi-marca/`
2. Crea `data/mi-marca.json` con los datos
3. Edita `brands/mi-marca/css/theme.css` — solo cambia las variables CSS en `:root`
4. Agrega una card en `index.html`
5. Agrega el rewrite en `vercel.json`

## Stack

- HTML + CSS + JavaScript vanilla (ES Modules)
- GSAP 3.12 + ScrollTrigger (CDN)
- Chart.js 4.4 (CDN)
- Google Fonts: Fraunces (display) + DM Sans (body) + DM Mono
- No npm, no bundler, no framework
