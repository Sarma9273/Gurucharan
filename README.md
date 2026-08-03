# Gurucharan — Security Intelligence Journey

A clean, independent and cinematic personal portfolio for **Guru Charan Mavuduru**.

This repository does **not** depend on the previous `Sarma9273.github.io` source repository, Astro, npm, React, GSAP, Three.js or any private service. It is a no-build static website designed for dependable GitHub Pages deployment.

## Live address

After the public GitHub repository is created with the exact name `Gurucharan`, the expected project-site URL is:

```text
https://sarma9273.github.io/Gurucharan/
```

The username in the URL is the GitHub account namespace. The website source itself lives only in the new `Gurucharan` repository.

## Included experience

- Cinematic boot sequence with Skip control
- Original interactive canvas-based Security Intelligence Core
- Responsive dark-first visual system and optional calm light theme
- Scroll-based journey storytelling
- Interactive AI Security, SOC and Applied AI focus selector
- Horizontal flagship-project showcase
- RA-XSOC/CyberGPT architecture explorer
- Purposeful technology universe
- Live Google Drive learning journal
- Automatic metadata creation for future Google Docs
- Custom Apps Script blog reader
- Contact form delivered to Gmail through a new Apps Script backend
- Local fallback articles when the backend is unavailable
- Responsive navigation, reduced-motion support and keyboard accessibility
- GitHub Actions deployment with no package installation or build step

## Originality

The public MoncyDev portfolio was used only as an interaction-quality reference. This project does not copy its 3D avatar, layout, source components, assets, colour system, typography composition or motion sequence. The implementation uses an original AI-security command-centre concept and a lightweight canvas engine written specifically for this portfolio.

## Repository structure

```text
Gurucharan/
├── .github/workflows/deploy.yml
├── apps-script/
│   ├── PortfolioBackend.gs
│   └── README.md
├── assets/
│   ├── css/styles.css
│   ├── images/
│   ├── js/
│   └── resume/
├── docs/
├── tools/verify_repository.py
├── index.html
├── projects.html
├── project.html
├── blogs.html
├── experience.html
├── resume.html
├── contact.html
└── 404.html
```

## First-time setup

Follow these guides in order:

1. [`docs/01_CREATE_REPOSITORY.md`](docs/01_CREATE_REPOSITORY.md)
2. [`docs/02_APPS_SCRIPT_SETUP.md`](docs/02_APPS_SCRIPT_SETUP.md)
3. [`docs/03_CONNECT_AND_TEST.md`](docs/03_CONNECT_AND_TEST.md)
4. [`docs/04_DRIVE_CONTENT_WORKFLOW.md`](docs/04_DRIVE_CONTENT_WORKFLOW.md)

## Local preview

No Node.js or npm is required.

From the repository root:

```powershell
python -m http.server 8080
```

Open:

```text
http://localhost:8080/
```

Stop the server with `Ctrl + C`.

## Repository verification

```powershell
python tools/verify_repository.py
```

## Important configuration

After deploying the new Apps Script backend, open:

```text
assets/js/config.js
```

Replace the placeholder with the public Web App URL ending in `/exec`:

```js
window.GC_CONFIG = {
  portfolioApiUrl: 'https://script.google.com/macros/s/DEPLOYMENT_ID/exec'
};
```

## Resume

Replace the placeholder with the final resume PDF:

```text
assets/resume/Guru_Charan_Mavuduru_Resume.pdf
```

Then add or update the download link in `resume.html`.
