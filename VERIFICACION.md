# Verificación — Fase 3 (13/11/2026, revisada tras el cambio a iconos a color)

Entorno: Chromium headless (Playwright) sobre `python3 -m http.server`, sin caché, sin red externa. Herramientas: `html-validate` 10.x, Lighthouse 13.x.

## 1. HTML

```
$ npx html-validate index.html
(sin errores ni avisos)
```
Correcciones aplicadas durante la verificación: `DOCTYPE` en mayúsculas, `<title>` reducido a 68 caracteres, espacios no separables en el teléfono.

## 2. Lighthouse

| Preset | Performance | Accesibilidad | Buenas prácticas | SEO | FCP | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|---|
| Móvil (Moto G Power, 4G lento) | **100** | **100** | **100** | **100** | 1,2 s | 1,2 s | 0 | 50 ms |
| Escritorio | **100** | **100** | **100** | **100** | 0,4 s | 0,4 s | 0 | 0 ms |

Informes completos: `lh-mobile.json` y `lh-desktop.json` (fuera del repo, en el paquete de entrega).

## 3. Peso de la página de inicio

| Fichero | Bytes |
|---|---|
| `index.html` (incluye sprite de 18 iconos a color, monograma y 2 diagramas SVG) | 102 000 |
| `assets/fonts/inter-latin-wght.woff2` | 48 256 |
| `assets/fonts/jetbrains-mono-latin-wght.woff2` | 40 404 |
| `assets/css/styles.css` | 20 906 |
| `assets/js/main.js` | 1 887 |
| **Total transferido en la home** | **≈ 208 KB** (presupuesto: < 400 KB) |

Sin peticiones a terceros. `og.png` (59 KB) solo lo descargan las redes sociales.

## 4. Responsive y layout

| Ancho | Resultado |
|---|---|
| 320 px | `scrollWidth == innerWidth` (sin scroll horizontal). Diagrama en variante vertical. Botones a ancho completo. |
| 360 px | Menú móvil: abre con el botón, cierra con `Esc` (foco vuelve al botón), al pulsar un enlace o fuera. |
| 640 px (equivale a zoom 200 % en 1280) | Sin scroll horizontal; una columna. |
| 768 px | Sin scroll horizontal tras ocultar el nombre de la marca en la nav (768–1023 px). Diagrama ancho. Competencias a 2 columnas. |
| 1024 px | Hero 5/7 columnas, tarjetas 2 columnas, competencias 3 columnas. |
| 1280 px | Capturas finales en ambos temas. |

## 5. Accesibilidad

- Orden de tabulación: `Ir al contenido` → marca → Perfil → Proyectos → Competencias → Experiencia → … (comprobado con `Tab`).
- Anillo de foco visible (2 px ámbar + offset) en todos los elementos interactivos; *skip-link* aparece al recibir foco.
- `prefers-reduced-motion: reduce`: etiquetas `Pending` con `opacity: 0` y `animation: none` desde el primer frame; nodos en `Ready`.
- Jerarquía de encabezados: `h1 · h2 h2 h3×4 · h2 · h2 h3×3 · h2 · h2`, sin saltos.
- Landmarks: `header`, `nav[aria-label]`, `main`, `section[aria-labelledby]`, `footer`.
- Diagramas: `role="img"` con `<title>` y `<desc>`; cada nodo en `<g role="group" aria-label>`. Iconos decorativos con `aria-hidden`.
- Botón de tema: `aria-label` dinámico ("Cambiar a tema claro/oscuro"); preferencia persistida y respetada tras recargar.
- Contraste: todos los tokens de texto ≥ 5,1:1 en claro y ≥ 7,7:1 en oscuro (tabla en README §2).
- Iconos de marca a color: comprobados visualmente en ambos temas; en oscuro, Ansible, GitHub, Helm, AWS y Red Hat usan su variante inversa oficial. Son decorativos (`aria-hidden`) y siempre van acompañados del nombre en texto.
- Sin JavaScript: navegación visible, `<details>` nativos, diagrama en `Ready`, tema según sistema; el botón de tema se oculta.

## 6. SEO y datos estructurados

- `<title>` 68 caracteres, `meta description`, `canonical`, Open Graph (`og.png` 1200×630 generada), Twitter Card, `theme-color` por tema, `manifest`, favicons SVG/PNG.
- JSON-LD `Person` válido (parsea; `knowsAbout` 64 entradas tomadas del CV; `sameAs` GitHub, Docker Hub, LinkedIn). No se ha ejecutado el validador de Google (sin acceso de red desde el entorno); pendiente de pasar en <https://validator.schema.org/> tras publicar.
- `sitemap.xml`, `robots.txt`, `llms.txt`, `/cv.md` y `/cv.pdf` enlazados desde el pie.

## 7. Contenido

- 45 anclas internas; 0 rotas.
- `cv.md` es una copia byte a byte de `cv-devops.md` v2.
- 9 placeholders `{{ANCLA_*}}` visibles con la marca "ancla pendiente" (3 repos no verificados × 3 enlaces); listados en README §8.
- Ningún texto fuera del CV salvo microcopy de interfaz: "Ir al contenido", "Menú", "Ver proyectos", "Descargar CV (PDF)", "GitHub", "Documentación del proyecto", "Ver repositorio →", "Servicio →", "Chart de Helm →", "Cambiar a tema claro/oscuro", etiquetas de la línea de tiempo (derivadas del párrafo del perfil) y la barra de estado.

## 8. Impresión

`@media print`: nav, botones, paneles y barra de estado ocultos; diagrama ancho estático; URLs externas impresas entre paréntesis. 8 páginas A4.

## 9. Pendiente (no verificable desde este entorno)

- Existencia y README de `terraform-k8s-cluster`, `helm-api-config-store`, `podman-micro-services`.
- Renombrado de `ansible-wordpress` → `ansible-lamp-rhel9`.
- Validación de JSON-LD y OG en herramientas externas tras publicar.
