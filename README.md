# enaide.github.io

Sitio web personal de Enaide Corrales Fernández, Ingeniero DevOps. Estático, sin framework, sin dependencias externas en tiempo de ejecución, publicado en GitHub Pages.

- Producción: <https://enaide.github.io/>
- Fuente de contenido: [`cv.md`](cv.md) (el sitio reproduce literalmente este fichero; el PDF es [`cv.pdf`](cv.pdf))

---

## 1. Concepto y decisiones de diseño

**Concepto: "Infraestructura visible".** El sitio se presenta como se construyen los sistemas que describe: declarativo, verificable y documentado. Cada elemento visual explica algo real del CV; no hay decoración.

| Decisión | Motivo | Alternativa descartada |
|---|---|---|
| HTML + CSS + JS *vanilla*, sin *build* | El repositorio se sirve tal cual desde la rama; nada que compilar, nada que romper | Astro / Eleventy: añadían una cadena de build para una sola página |
| Todo el contenido en el HTML, no inyectado por JS | Rastreadores y agentes de IA leen el contenido sin ejecutar scripts; sin JS el sitio se lee y navega completo | SPA o contenido cargado desde `cv.md` en cliente |
| Fuentes *self-hosted* (woff2, subset latino) | Cero peticiones a terceros, sin *tracking*, carga predecible | Google Fonts |
| Iconos como *sprite* SVG inline, `fill: currentColor` | Un solo documento, sin peticiones extra, se adaptan a los dos temas | PNG / *icon fonts* |
| Diagrama del clúster como SVG inline en dos variantes (ancha ≥ 640 px, vertical < 640 px) | Legible a 320 px sin escalar texto por debajo de ~10 px; animación en CSS sin JS | Un solo SVG escalado (texto ilegible en móvil) o imagen raster |
| Tema oscuro por defecto, claro por `prefers-color-scheme` o botón | Mismos nombres de token en ambos temas; preferencia guardada en `localStorage` dentro de `try/catch` | Solo tema oscuro |
| Panel "Documentación del proyecto" enlaza a las secciones del README de cada repo | Cero duplicación, cero desincronización; demuestra que la documentación existe | Copiar el texto de los READMEs en el sitio |
| Sin GitHub Actions | Decisión del autor; despliegue desde rama. Por eso el sitio **no** menciona Actions | Workflow con validación + Lighthouse CI + `deploy-pages` |
| Sin analítica, sin cookies, sin formularios | Sitio estático; contacto por `mailto:`, `tel:` y enlaces | Formulario con servicio de terceros |

### Piezas distintivas

1. **Monograma "EC"** (`#i-monogram` en el sprite; `assets/img/monograma.svg` como fichero): construido con el mismo vocabulario del diagrama (trazos rectos y nodos). También es favicon e imagen Open Graph.
2. **Hero-diagrama** de `terraform-k8s-cluster`: VPC, control-plane + 2 workers EC2 Spot, S3, SSM Parameter Store, `/healthz`, validación final. Los nodos pasan de `Pending` a `Ready` en 0,4 / 1,0 / 1,3 s; con `prefers-reduced-motion` aparecen ya en `Ready`.
3. **Tarjetas-manifiesto** por proyecto: nombre real del repositorio en mono, eyebrow, bullets literales, chips de tecnologías (texto real), `<details>` con enlaces a la documentación y acción "Ver repositorio".
4. **Línea de tiempo** 2011–2018 / 2018–2025 / 2025–hoy, vertical en móvil y horizontal desde 768 px.
5. **Barra de estado** en el pie: `site: static · host: GitHub Pages · updated: AAAA-MM-DD · src: cv.md · pdf: cv.pdf`.

---

## 2. Tokens

### Color (ratios de contraste WCAG calculados)

| Token | Oscuro | sobre `bg` / `surface` | Claro | sobre `bg` / `surface` | Uso |
|---|---|---|---|---|---|
| `--bg` | `#0B1220` | — | `#F7F9FC` | — | fondo |
| `--surface` | `#121B2E` | — | `#FFFFFF` | — | tarjetas, nav |
| `--surface-2` | `#182440` | — | `#EEF2F7` | — | chips, `code` |
| `--border` | `#263347` | decorativo | `#D7DEE8` | decorativo | separadores |
| `--text` | `#E6EBF2` | 15,6 / 14,4 | `#141A26` | 16,5 / 17,4 | texto |
| `--muted` | `#A3AFC0` | 8,4 / 7,7 | `#4F5B6B` | 6,6 / 6,9 | metadatos |
| `--accent` | `#F2B544` | 10,2 / 9,4 | `#9A5B00` | 5,1 / 5,4 | acción, foco, monograma |
| `--accent-ink` | `#0B1220` | 10,2 sobre accent | `#FFFFFF` | 5,4 sobre accent | texto del botón primario |
| `--ready` | `#3DDC97` | 10,6 / 9,7 | `#0E7A4A` | 5,1 / 5,4 | estado Ready, "actualidad" |
| `--link` | `#8FC1FF` | 10,0 / 9,2 | `#0B5CAD` | 6,3 / 6,7 | enlaces |

Mínimos: 4,5:1 texto, 3:1 componentes interactivos. Solo tres colores con significado (acento, ready, link).

### Tipografía y espaciado

- Inter (variable, 100–900) para interfaz; JetBrains Mono (variable, 100–800) para repos, comandos, metadatos. Ambas en `assets/fonts/` con licencia OFL.
- Escala modular 1,25 fluida con `clamp()`: `--fs-sm` 14–15 px · `--fs-0` 16–17 px · `--fs-1` 18–21 px · `--fs-2` 22–28 px · `--fs-3` 32–52 px.
- Espaciado en escala de 4 px (`--s-1` … `--s-24`). Contenedor 1160 px. Breakpoints: 480 · 640 · 768 · 1024.
- Movimiento: 150 / 250 ms, nunca > 300 ms; todo anulable con `prefers-reduced-motion`.

---

## 3. Estructura

```
.
├── index.html                  página única; sprite de iconos y diagramas SVG inline
├── assets/
│   ├── css/styles.css          tokens · base · layout · componentes · diagrama · print
│   ├── js/main.js              tema y menú móvil (< 3 KB); el sitio funciona sin él
│   ├── fonts/                  Inter y JetBrains Mono (woff2) + licencias
│   └── img/
│       ├── diagrama-ancho.svg      fuente del diagrama ≥ 640 px (copia inline en index.html)
│       ├── diagrama-vertical.svg   fuente del diagrama < 640 px (copia inline en index.html)
│       ├── monograma.svg           monograma con colores fijos (para uso externo)
│       ├── og.svg · og.png         imagen Open Graph 1200 × 630
│       ├── icons/*.svg             iconos originales (Simple Icons CC0, Devicon MIT) + avisos de marca
├── cv.md                       copia literal del CV (fuente de verdad del contenido)
├── cv.pdf                      versión PDF del mismo CV
├── favicon.svg · favicon.png · apple-touch-icon.png · icon-512.png
├── site.webmanifest · robots.txt · sitemap.xml · llms.txt
├── .nojekyll                   GitHub Pages sirve los ficheros tal cual
├── scripts/stamp.sh            escribe la fecha en la barra de estado y en sitemap.xml
└── README.md
```

---

## 4. Cómo editar el contenido

1. Cambia primero `cv.md`: es la fuente de verdad y debe seguir siendo idéntico a lo que muestra el sitio.
2. Replica el cambio en `index.html` en la sección correspondiente (`#perfil`, `#proyectos`, `#competencias`, `#experiencia`, `#formacion`, `#contacto`). Las tecnologías de cada proyecto son `<li>` dentro de `<ul class="chips">`.
3. Si cambia el PDF, sustituye `cv.pdf`.
4. **Diagrama:** edita `assets/img/diagrama-ancho.svg` o `diagrama-vertical.svg` y vuelve a pegar su contenido (sin el atributo `xmlns`) en el `<figure class="hero__figure">` de `index.html`.
5. **Iconos:** añade el SVG original en `assets/img/icons/`, crea un `<symbol id="i-nombre" viewBox="…">` en el sprite al inicio de `<body>` (sin atributos `fill`) y úsalo con `<svg class="icon"><use href="#i-nombre"/></svg>`. Solo iconos de tecnologías, desde librerías con licencia; nunca redibujados.
6. Ejecuta `./scripts/stamp.sh` antes de hacer commit para actualizar la fecha.

### Enlaces de documentación por proyecto

Los enlaces del panel "Documentación del proyecto" apuntan a anclas del README de cada repositorio (regla de GitHub: minúsculas, acentos conservados, espacios → guiones). Si un README no tiene una sección, elimina ese enlace; no inventes anclas.

---

## 5. Cómo publicar

1. Repositorio `enaide/enaide.github.io`, rama `main`, estos ficheros en la raíz.
2. Settings → Pages → *Build and deployment* → Source: **Deploy from a branch** → `main` / `/ (root)`.
3. Tras cada cambio: `./scripts/stamp.sh && git add -A && git commit -m "…" && git push`.
4. Comprobar `https://enaide.github.io/`, `/cv.md`, `/cv.pdf`, `/sitemap.xml`.

Pruebas locales: `python3 -m http.server 8000` y abrir `http://localhost:8000/`.

---

## 6. Verificación realizada (13/11/2026)

Ver `VERIFICACION.md` para la evidencia completa (validador HTML, Lighthouse móvil y escritorio, capturas, accesibilidad, JSON-LD, peso).

---

## 7. Limitaciones conocidas

- **Sin CI:** nada valida el HTML ni mide Lighthouse en cada push. Un workflow mínimo (html-validate + Lighthouse CI + `deploy-pages`) resolvería esto; se descartó por decisión del autor.
- **Fecha manual:** `updated:` depende de ejecutar `scripts/stamp.sh` antes del commit.
- **Diagrama duplicado:** las dos variantes del SVG viven inline en `index.html` y como ficheros fuente en `assets/img/`; hay que mantenerlos sincronizados a mano.
- **Texto del diagrama vertical:** las etiquetas secundarias quedan en ~10 px efectivos a 320 px (las principales ≥ 12 px).
- **Una sola lengua** (español); sin versión en inglés.
- **Sin métricas de tráfico** por diseño.

## 8. Pendiente de completar

| Qué | Dónde | Estado |
|---|---|---|
| Anclas del README de `terraform-k8s-cluster` | `index.html`, tarjeta 1, `href="…#{{ANCLA_*}}"` + `<mark class="todo">` | pendiente de leer el README |
| Anclas del README de `helm-api-config-store` | tarjeta 3, segundo bloque | pendiente |
| Anclas del README de `podman-micro-services` | tarjeta 4 | pendiente |
| Renombrar `ansible-wordpress` → `ansible-lamp-rhel9` en GitHub | el sitio enlaza a la URL actual, que seguirá funcionando por la redirección de GitHub | pendiente (decisión D4) |
| Cifrar `vars/secrets.yml` con Ansible Vault en ese repo | repo externo; el CV ya dice "preparados para Ansible Vault" | opcional |
| Fechas de los proyectos | no se muestran (decisión D10) | sin cambios |

---

## Licencias

- Código del sitio: MIT.
- Contenido (textos del CV): © Enaide Corrales Fernández.
- Inter y JetBrains Mono: SIL Open Font License 1.1 (`assets/fonts/LICENSE-*.txt`).
- Iconos: Simple Icons (CC0 1.0) y Devicon (MIT). Las marcas pertenecen a sus titulares; se usan solo para identificar tecnologías (`assets/img/icons/DISCLAIMER-SimpleIcons.md`).
