# Guru Charan — Security Intelligence Universe

An original cinematic portfolio built with React, TypeScript, Vite, React Three Fiber, Three.js and GSAP.

## Experience

- Cinematic system boot sequence
- Interactive WebGL security-intelligence core
- Pointer-reactive 3D scene
- Scroll-driven career story
- Pinned horizontal project worlds
- Interactive RA-XSOC architecture explorer
- 3D technology universe
- Live Google Drive learning journal
- Fresh Apps Script contact and publishing backend
- GitHub Pages deployment

The site is inspired by the ambition of immersive creative portfolios, but its composition, 3D system, visual identity, motion language and content are original.

## Quick start

```powershell
npm ci
npm run dev
```

Open:

```text
http://localhost:5173/Gurucharan/
```

## GitHub Pages

The repository deploys from `main` through GitHub Actions. Keep the repository variable `VITE_PORTFOLIO_API_URL` configured with the public Apps Script `/exec` URL when the live journal and contact backend are enabled.

If that variable is absent or malformed, the frontend disables the live backend and falls back safely.

Expected site:

```text
https://sarma9273.github.io/Gurucharan/
```

## Security baseline

- Content Security Policy is defined in `index.html`.
- Article HTML is allowlisted and sanitized before React renders it.
- Google Drive article IDs are restricted to tabs in the configured master document.
- Contact input is length-limited, validated, honeypot-protected and rate-limited.
- CI runs TypeScript checks, production builds and high-severity dependency audits.
- CodeQL and dependency-review workflows provide additional GitHub-side analysis.
- GitHub Actions use least-privilege job permissions and full commit-SHA pinning.

Do not commit credentials, tokens, private keys or local environment files. Use GitHub Actions variables/secrets and Apps Script project configuration for runtime configuration.

For vulnerability reports, use the repository's `SECURITY.md` process.
