# 03 — Connect the backend and test the website

## Connect the new endpoint

Open:

```text
assets/js/config.js
```

Replace:

```js
window.GC_CONFIG = {
  portfolioApiUrl: 'PASTE_NEW_GOOGLE_APPS_SCRIPT_EXEC_URL_HERE'
};
```

with the new Web App URL:

```js
window.GC_CONFIG = {
  portfolioApiUrl: 'https://script.google.com/macros/s/DEPLOYMENT_ID/exec'
};
```

Save.

## Local test

Run:

```powershell
python -m http.server 8080
```

Test these pages:

```text
http://localhost:8080/
http://localhost:8080/projects.html
http://localhost:8080/blogs.html
http://localhost:8080/experience.html
http://localhost:8080/resume.html
http://localhost:8080/contact.html
```

## Required checks

### Cinematic experience

- Loader completes and Skip works.
- Canvas Security Intelligence Core follows pointer movement.
- Theme control works.
- Mobile navigation works.
- Reduced-motion setting does not block content.

### Projects

- Horizontal rail scrolls or swipes.
- Project links open `project.html?slug=...`.
- Architecture explorer changes content.
- Technology universe changes categories.

### Blogs

- Status says live Drive entries were synchronised.
- Domain filter works.
- Article opens in the Apps Script reader.
- Local fallback cards appear when the endpoint is intentionally removed.

### Contact

- Complete all fields and send a test.
- Check Gmail Inbox, Spam and All Mail.
- Confirm Reply-To is the sender address.
- Wait at least 60 seconds before repeating the same test.

## Publish

Commit the endpoint change and push to `main`. GitHub Actions will deploy the static files directly.
