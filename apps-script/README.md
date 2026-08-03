# Fresh Apps Script backend

`PortfolioBackend.gs` is the complete independent backend for this repository.

It creates a new Drive CMS and provides:

- Google Doc blog feed
- JSON and JSONP output
- Custom article reader
- Automatic metadata for future blogs
- Hourly Drive scanner
- Contact-form email delivery
- Rate limiting and spam honeypot
- Health and diagnostic endpoints
- Optional starter content

Use only this new Apps Script project. It does not need any old folder ID or old deployment URL.

First-time order:

```text
setupPortfolioSystem()
installPortfolioAutomation()
seedStarterContent()       optional
Deploy as Web App
```

See `docs/02_APPS_SCRIPT_SETUP.md` for the complete procedure.
