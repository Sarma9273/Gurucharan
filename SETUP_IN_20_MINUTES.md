# 20-minute setup

## 1. Preview the visual experience

```powershell
npm ci
npm run dev
```

Open `http://localhost:5173/Gurucharan/`.

## 2. Create the free backend

The portfolio frontend remains on GitHub Pages. The optional zero-cost backend uses Google Apps Script for contact delivery and the Live Learning Journal.

- Open script.google.com.
- Create a project named `Gurucharan Portfolio Backend`.
- Replace `Code.gs` with `apps-script/PortfolioBackend.gs`.
- Run `setupPortfolioSystem()` once and authorize the requested Google services.
- Run `installPortfolioAutomation()` once.
- Deploy → New deployment → Web app.
- Execute as **Me**.
- Access: **Anyone** (anonymous web-app access is required for public portfolio visitors).
- Copy the deployed `/exec` URL.

Google documents that web apps can execute as the deploying user and that anonymous access is a supported web-app permission mode.

## 3. Connect it without putting a secret in source code

The Apps Script `/exec` URL is configured as a GitHub repository variable:

**GitHub → Settings → Secrets and variables → Actions → Variables → New repository variable**

- Name: `VITE_PORTFOLIO_API_URL`
- Value: your deployed Apps Script `/exec` URL`

Do **not** commit private API keys, OAuth tokens, or passwords to the repository.

If the variable is absent, the portfolio safely falls back to the direct email link instead of falsely claiming that the backend delivered the message.

## 4. Publish

Push to `main`. The Pages workflow builds `dist/` and deploys it to GitHub Pages.

The free security workflow also runs type-checking, production dependency auditing, and a production build on `main` and security branches.

## 5. Backend security notes

The Apps Script backend now:

- validates and length-limits contact input;
- rejects the honeypot field;
- rate-limits repeated submissions;
- confirms delivery to the frontend instead of relying on a client-side timer;
- prevents arbitrary Drive document IDs from being rendered as public articles;
- does not expose the destination email through diagnostics;
- keeps article content restricted to the configured Blogs folder.

For a public web app, deploy the script from the account that should receive the portfolio messages and keep its Google authorization under your control.
