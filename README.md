# Guru Charan — Security Intelligence Universe

An immersive personal engineering portfolio built with React, TypeScript, Vite, React Three Fiber, Three.js and GSAP.

## Current architecture

Gurucharan is the canonical portfolio UI. Its cinematic visual system is preserved while the GURUVERSE feature model supplies the information architecture and interaction layer.

### Experience layer
- Cinematic boot sequence
- Custom cursor and pointer interaction
- WebGL security-intelligence core
- Scroll-driven career story
- Pinned horizontal project worlds
- Recruiter / Engineer / Explore modes
- Command palette with search (Ctrl/⌘ K)

### Intelligence layer
- Contextual GURU-BOT
- Project-aware questions and answers
- Overview, architecture, workflow, stack, problem, solution and results intents

### Exploration layer
- Searchable project explorer
- Domain/category filtering
- Detailed project case-study modal
- GitHub and live-demo links where available
- Architecture and workflow evidence

### Professional layer
- About / identity
- Experience
- Research
- Resume
- Live Google Drive learning journal with local fallback
- Contact form with Apps Script backend fallback
- Responsive navigation and accessibility foundations
- SEO, canonical metadata, Open Graph/Twitter metadata and structured data

## Development

```bash
npm install
npm run dev
npm run check
npm run build
```

Local site:

```text
http://localhost:5173/Gurucharan/
```

Production site:

```text
https://sarma9273.github.io/Gurucharan/
```

## Backend

The optional Google Apps Script backend is in `apps-script/PortfolioBackend.gs`. Set the `/exec` endpoint in `src/config.ts` to enable the live contact and learning-journal integration.

## Deployment

GitHub Actions builds and deploys the Vite application to GitHub Pages whenever `main` changes.

## Canonical repository

```text
https://github.com/Sarma9273/Gurucharan
```

The repository is intended to be the single canonical personal portfolio. Other project repositories remain independent technical work and are not merged into this repository.