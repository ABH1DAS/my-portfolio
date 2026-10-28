# Abhijeet Das — Portfolio

A high-craft, editorial developer portfolio built with **Vite**, **Vanilla JavaScript (ES Modules)**, and **Plain CSS**, powered by local npm installations of **GSAP** (ScrollTrigger & Draggable) and **Lenis**.

---

## Architecture & Influences

- **[dakshgajjar.com](https://dakshgajjar.com)**: Continuous winding orange thread motif, big masked statement typography, and tactile stacked project cards.
- **[mikewilcockdesign.com](https://mikewilcockdesign.com)**: Infinite skills marquee, horizontal draggable `(Up close)` gallery, and an accessible `(Pause motion)` toggle.
- **Thread-Suspended Projects**: Project cards hang directly from a horizontal thread crossing the Projects section, swinging with scroll momentum (`transform-origin: top center; rotate: ±4.5°`) like physical cards caught in the wind.

---

## Directory & File Structure

```
.
├── index.html                           # Semantic shell & mount points
├── package.json                         # Dependencies & npm scripts
├── public/
│   ├── favicon.svg                      # Custom AD monogram
│   └── og-image.svg                     # Social share graphic
└── src/
    ├── main.js                          # Root application bootstrap
    ├── data/
    │   ├── site.js                      # Bio, marquee skills, framework, capabilities, about copy
    │   └── projects.js                  # 4 featured projects + 8 (Up close) gallery items
    ├── styles/
    │   ├── base.css                     # Design tokens, reset, accessible focus states
    │   ├── layout.css                   # Section paddings, grid layouts, mobile breakpoints
    │   ├── components.css               # Cards, marquee, suspension cables, form, gallery track
    │   └── animations.css               # Line masks, marquee keyframes, reduced-motion overrides
    ├── components/
    │   ├── nav.js                       # Brand logo, live status, links, (Pause motion) toggle
    │   ├── hero.js                      # Statement headline + infinite skills marquee
    │   ├── framework.js                 # 01 IDEA → 02 BUILD → 03 SHIP philosophy row
    │   ├── capabilities.js              # 3-column expertise grid (Web, IoT, AI)
    │   ├── projects.js                  # Pinned scroll-swap list with thread-hung swinging cards
    │   ├── gallery.js                   # Draggable "(Up close)" 8-card interactive strip
    │   ├── about.js                     # Word-by-word reveal + tech matrix
    │   ├── contact.js                   # Form with honeypot spam guard & direct channels
    │   └── footer.js                    # Copyright, live IST time ticker, back to top
    └── animations/
        ├── motionPreference.js          # Shared state for prefers-reduced-motion + localStorage toggle
        ├── smoothScroll.js              # Lenis smooth scroll engine synced with GSAP ticker
        ├── thread.js                    # Continuous SVG thread: hero loop, cross-suspension, contact knot
        └── reveals.js                   # Line-by-line heading masks & fade-ups
```

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### Production Build
```bash
npm run build
```
Generates optimized static assets in `/dist`.

### Preview Production Build
```bash
npm run preview
```

---

## How to Edit Content

All text, project details, and links live strictly in `/src/data/`. Components only render this data.

1. **Personal Info, Marquee Skills & Capabilities**:
   Edit [`src/data/site.js`](./src/data/site.js). Look for `TODO:` comments to customize your email, social profile links, bio, and marquee skills.
2. **Projects & Up Close Gallery**:
   Edit [`src/data/projects.js`](./src/data/projects.js). Add project descriptions, tags, case study links, and gallery cards.

---

## Accessibility & Motion Controls

- **`(Pause motion)` Nav Toggle**: Halts marquee animations, disables Lenis smooth scrolling, stops GSAP scrub, and stores user preference in `localStorage`.
- **`prefers-reduced-motion`**: Fully supported via media queries and JavaScript listeners, instantly presenting all cards and text in a readable static state.
- **Skip Link**: `<a href="#main-content">` ensures full keyboard navigation compliance.

---

## Deployment

Deployable as a static site to any platform:
- **Vercel**: Connect repository, framework preset: `Vite`, build command: `npm run build`, output: `dist`.
- **Netlify**: Build command: `npm run build`, publish directory: `dist`.
- **GitHub Pages**: Build with `npm run build` and deploy the `/dist` directory.
