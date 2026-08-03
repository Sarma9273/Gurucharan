# 06 — Delete the old repositories and Apps Script safely

Do this only after the new site passes production tests.

## Production checklist

- New `Gurucharan` repository exists.
- GitHub Actions build and deploy jobs are green.
- `https://sarma9273.github.io/Gurucharan/` loads.
- New `/exec?action=health` works.
- Live Drive blogs load.
- A Drive article opens.
- Contact test reaches Gmail.
- Mobile navigation and project pages work.

## Back up the old systems

For each old repository:

```text
Code → Download ZIP
```

For the old Apps Script project:

- Copy its code into a local text file or download it through the project editor.
- Record old Drive folder locations if needed.

## Delete old repositories

Open each old repository:

```text
Settings → General → Danger Zone → Delete this repository
```

## Delete the old Apps Script project

Open the old project and move it to Trash from the Apps Script project dashboard.

## Remove old Drive CMS folders

Only after confirming the new CMS has all required content, archive or delete the old portfolio folders from Drive.

The new system does not reference old repository files, old Apps Script properties, old folder IDs or old deployment URLs.
