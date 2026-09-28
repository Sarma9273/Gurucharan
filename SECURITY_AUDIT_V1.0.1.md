# Security Audit — GURU CHARAN Portfolio

## Scope

Repository: `Sarma9273/Gurucharan`

Review type: defensive red-team code audit and blue-team patching.

Focus:
- public GitHub Pages frontend;
- contact/message flow;
- Google Apps Script backend;
- Live Learning Journal;
- deployment and dependency hygiene.

This review is code-level. It is not a claim of a full external penetration test because the deployed backend URL was not available in the repository and a live authenticated browser test was not performed.

## Findings

### High — Arbitrary Drive document access in article reader

**Before:** `read?id=<Google Drive file ID>` passed the supplied ID directly to `DriveApp.getFileById()`.

**Risk:** If the web app executes as the owner, an attacker could attempt to retrieve other Google Docs that the script owner can access.

**Patch:** Article rendering now verifies that the requested file is a Google Doc located directly inside the configured public Blogs folder.

### High — Contact endpoint was not connected

**Before:** `src/config.ts` contained a placeholder Apps Script URL.

**Impact:** The form could not reach the backend from the deployed portfolio.

**Patch:** The endpoint is now supplied through the free GitHub Actions repository variable `VITE_PORTFOLIO_API_URL`.

### Medium — False contact-success state

**Before:** The frontend displayed success after a fixed timer without receiving backend confirmation.

**Patch:** The frontend now waits for an explicit backend `postMessage` acknowledgement and shows an error on timeout or backend failure.

### Medium — Contact abuse resistance

**Before:** Per-email cooldown existed, but no global submission throttle existed.

**Patch:** Added a short global cooldown in addition to the per-email cooldown and retained input length validation and the honeypot.

### Low — Diagnostics exposed destination email

**Before:** The diagnostics response included the contact destination.

**Patch:** Destination address was removed from public diagnostics.

## Additional review

- React source contains no `dangerouslySetInnerHTML` usage.
- Article rendering uses server-side HTML escaping for document content.
- External links opened in new tabs now use `noopener noreferrer` where patched.
- GitHub Pages uses a project-specific Vite base path: `/Gurucharan/`.
- Deployment now uses `npm ci` for lockfile-driven installs.
- A free GitHub Actions security workflow performs TypeScript checking, production dependency auditing, and a production build.
- No application secret or OAuth token is required in the frontend.
- The Apps Script `/exec` URL is treated as configuration rather than a secret.

## Residual risks / manual validation

1. Deploy the Apps Script as a web app and set `VITE_PORTFOLIO_API_URL`.
2. Submit a real test message and verify receipt in the configured mailbox.
3. Verify that a valid article loads.
4. Verify that a random Drive document ID returns `Article not found`.
5. Verify repeated contact submissions are throttled.
6. Run the deployed site through browser developer tools and confirm there are no console errors, failed asset requests, or browser-policy issues.

## Zero-budget architecture

- Frontend: GitHub repository + GitHub Pages.
- CI/CD: GitHub Actions.
- Backend: Google Apps Script.
- Content: Google Drive / Docs through Apps Script.
- Contact delivery: Apps Script Mail service.
- No paid server, database, hosting plan, or commercial email API is required.

## Baseline

The original v1.0.0 baseline remains frozen.

Hardening work is isolated on the `security/hardening-v1.0.1` branch until the patched build and backend deployment are validated.