from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path
import json
import re
import sys

ROOT = Path(__file__).resolve().parents[1]

REQUIRED = [
    "index.html",
    "projects.html",
    "project.html",
    "blogs.html",
    "experience.html",
    "resume.html",
    "contact.html",
    "404.html",
    "assets/css/styles.css",
    "assets/js/config.js",
    "assets/js/data.js",
    "assets/js/main.js",
    "assets/js/security-core.js",
    "assets/js/live-blogs.js",
    "assets/js/contact.js",
    "assets/js/project.js",
    "apps-script/PortfolioBackend.gs",
    ".github/workflows/deploy.yml",
]

class ReferenceParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.references: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        for key, value in attrs:
            if key in {"href", "src"} and value:
                self.references.append(value)


def main() -> int:
    errors: list[str] = []

    for relative in REQUIRED:
        if not (ROOT / relative).exists():
            errors.append(f"Missing required file: {relative}")

    for html_file in ROOT.glob("*.html"):
        parser = ReferenceParser()
        parser.feed(html_file.read_text(encoding="utf-8"))
        for reference in parser.references:
            if reference.startswith(("http://", "https://", "mailto:", "#", "javascript:")):
                continue
            path_only = reference.split("?", 1)[0].split("#", 1)[0]
            if not path_only:
                continue
            candidate = (html_file.parent / path_only).resolve()
            if not candidate.exists():
                errors.append(f"{html_file.name}: broken local reference {reference}")

    manifest = ROOT / "site.webmanifest"
    try:
        json.loads(manifest.read_text(encoding="utf-8"))
    except Exception as exc:
        errors.append(f"Invalid site.webmanifest: {exc}")

    config = (ROOT / "assets/js/config.js").read_text(encoding="utf-8")
    if "portfolioApiUrl" not in config:
        errors.append("assets/js/config.js has no portfolioApiUrl")

    workflow = (ROOT / ".github/workflows/deploy.yml").read_text(encoding="utf-8")
    for token in ("actions/configure-pages@v5", "actions/upload-pages-artifact@v4", "actions/deploy-pages@v4"):
        if token not in workflow:
            errors.append(f"Deployment workflow missing {token}")

    css = (ROOT / "assets/css/styles.css").read_text(encoding="utf-8")
    if "prefers-reduced-motion" not in css:
        errors.append("Reduced-motion accessibility rule is missing")

    data = (ROOT / "assets/js/data.js").read_text(encoding="utf-8")
    for slug in (
        "ra-xsoc-security-copilot",
        "cybergpt-v1",
        "practical-soc-home-lab",
        "sahaaya360",
        "osprey-mppt-research",
        "portfolio-platform",
    ):
        if slug not in data:
            errors.append(f"Project data missing slug: {slug}")

    if errors:
        print("Repository verification FAILED")
        for error in errors:
            print(f"- {error}")
        return 1

    print("Repository verification PASSED")
    print("- Required files present")
    print("- Local HTML references resolved")
    print("- Manifest JSON valid")
    print("- GitHub Pages workflow present")
    print("- Accessibility and project-data checks passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
