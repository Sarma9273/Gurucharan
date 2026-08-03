# 01 — Create the new repository

## Before deleting anything

Keep the old repositories until the new website and backend pass all tests. After the new site is stable, download ZIP backups and then delete the old repositories and old Apps Script project.

## Create the repository

1. Sign in to GitHub.
2. Create a new **public** repository named exactly:

```text
Gurucharan
```

3. Do not initialise it with a README, `.gitignore` or licence.
4. Clone it using GitHub Desktop.
5. Copy everything inside this project package into the cloned local folder.
6. Do not put a second `Gurucharan` folder inside the cloned folder.

Correct:

```text
Gurucharan/
├── .git/
├── .github/
├── assets/
├── apps-script/
├── docs/
└── index.html
```

Incorrect:

```text
Gurucharan/
└── Gurucharan/
    └── index.html
```

## Preview locally

From the repository root:

```powershell
python -m http.server 8080
```

Open `http://localhost:8080/`.

## Validate

```powershell
python tools/verify_repository.py
```

## Commit and push

Suggested commit message:

```text
Initial independent cinematic portfolio release
```

Push to `main`.

## Enable Pages

Open:

```text
Repository → Settings → Pages → Source: GitHub Actions
```

Then open **Actions** and wait for both jobs to complete.

Expected live address:

```text
https://sarma9273.github.io/Gurucharan/
```
