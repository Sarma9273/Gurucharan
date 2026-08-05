# 20-minute setup

## 1. Preview the visual experience

```powershell
npm install
npm run dev
```

Open `http://localhost:5173/Gurucharan/`.

## 2. Create the fresh backend

- Open script.google.com
- New project: `Gurucharan Portfolio Backend`
- Replace `Code.gs` with `apps-script/PortfolioBackend.gs`
- Run `setupPortfolioSystem()`
- Run `installPortfolioAutomation()`
- Deploy → New deployment → Web app
- Execute as Me; access Anyone
- Copy the `/exec` URL

## 3. Connect it

Open `src/config.ts` and paste the `/exec` URL.

## 4. Publish

- Create GitHub repository: `Gurucharan`
- Commit all files
- Push `main`
- Settings → Pages → GitHub Actions
