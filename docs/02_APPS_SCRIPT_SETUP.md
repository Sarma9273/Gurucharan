# 02 — Create the new Apps Script backend

This setup creates a completely new Drive CMS and deployment. Do not reuse the old script project, old folder ID or old `/exec` URL.

## Create a new Apps Script project

1. Open Google Apps Script.
2. Create a **New project**.
3. Name it:

```text
Gurucharan Portfolio Backend
```

4. Delete the sample code in `Code.gs`.
5. Open `apps-script/PortfolioBackend.gs` from this repository.
6. Copy all of it into `Code.gs`.
7. Save.

## Create the Drive CMS

Select and run:

```javascript
setupPortfolioSystem()
```

Approve the requested Drive and document permissions.

The function creates:

```text
My Drive/
└── Gurucharan Portfolio CMS/
    ├── Blogs/
    │   └── 00_Blog_Template/
    ├── Media/
    ├── Archive/
    └── README - Portfolio CMS.txt
```

The execution log returns the new root and Blogs folder URLs.

## Install future-blog automation

Run once:

```javascript
installPortfolioAutomation()
```

This installs one hourly trigger and performs an immediate metadata scan.

Verify:

```javascript
checkPortfolioSystem()
```

Expected essentials:

```text
automationInstalled: true
automationTriggerCount: 1
```

## Optional starter articles

Run:

```javascript
seedStarterContent()
```

This creates two starter Google Docs in the new CMS:

- Portfolio V1 to V2 learning reflection
- RA-XSOC/CyberGPT engineering journal

They may be edited or removed later.

## Deploy as a Web App

1. Click **Deploy → New deployment**.
2. Type: **Web app**.
3. Description:

```text
Gurucharan Portfolio Backend V1
```

4. Execute as: **Me**.
5. Who has access: **Anyone**.
6. Deploy and approve permissions.
7. Copy the URL ending in `/exec`.

## Test the fresh deployment

Open:

```text
YOUR_EXEC_URL?action=health
```

Expected:

```json
{"ok":true,"service":"Guru Charan — Security Intelligence Journey"}
```

Open:

```text
YOUR_EXEC_URL?action=blogs&refresh=1
```

Expected:

```json
{"ok":true,"blogs":[...]}
```

## Updating the script later

Use:

```text
Deploy → Manage deployments → Edit → New version → Deploy
```

This keeps the same public `/exec` URL.
