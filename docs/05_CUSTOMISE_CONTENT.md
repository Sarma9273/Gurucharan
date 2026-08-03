# 05 — Customise portfolio content

## Profile and data

Edit:

```text
assets/js/data.js
```

This file contains:

- Projects
- Journey stages
- Focus areas
- Architecture explorer data
- Technology categories
- Local fallback blogs

## Homepage copy

Edit `index.html` for:

- Hero statement
- Education and current-role signals
- Journey narrative
- Section introductions
- Contact call to action

## Project details

Each project in `assets/js/data.js` has a unique `slug`. The same data powers:

```text
projects.html
project.html?slug=...
```

Add `repositoryUrl`, `demoUrl` or `reportUrl` fields later and extend `project.js` when real links are available. Do not publish fake demos.

## Resume

Place the final PDF at:

```text
assets/resume/Guru_Charan_Mavuduru_Resume.pdf
```

Then add a download button in `resume.html`.

## Visual system

Edit:

```text
assets/css/styles.css
```

The main tokens are at the beginning of the file:

- Background
- Panels
- Text
- Cyan security signal
- Amber action signal
- Violet AI signal

## Interactive core

Edit:

```text
assets/js/security-core.js
```

The effect is a custom canvas implementation. It does not use or copy a third-party avatar or 3D model.
