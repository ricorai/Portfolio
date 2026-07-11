# Session Log — Digital Portfolio

> This file persists with the project, so it survives folder renames and workspace changes.
> Use it to track decisions, prompts, commands, and context across sessions.

---

## Project Overview

- **Project**: Personal Portfolio Website for Ric Ryan E. Mahusay
- **Stack**: Vanilla HTML/CSS/JS (no framework), Lenis smooth scroll, Inter font
- **Design Inspiration**: Apple / Stripe / Linear / Framer / Notion
- **Tools**: Playwright (analyzer.js) for design intelligence reports

## Key Files

| File | Purpose |
|------|---------|
| `index.html` | Main portfolio page |
| `style.css` | Stylesheet (CSS custom properties, responsive) |
| `script.js` | Particles, typing effect, modals, Lenis scroll |
| `analyzer.js` | Playwright-based site analyzer → `output/` |
| `Resume/index.html` | Standalone resume page |

## Session Notes

### 2026-07-11
- Workspace folder was renamed, causing previous VS Code chat session to be lost.
- Created `docs/session-log.md` to persist session context within the project itself.
- Added Certificates section to `Resume/index.html`:
  - CGP Certificate (`CGP Certificate.jfif` → converted to `.jpg`)
  - CamScanner certificate (`CamScanner 7-11-26 08.31_1.jpeg`)
- Converted `.jfif` to `.jpg` for better browser compatibility.
- Committed: `5c7171d` — "Add certificates section to resume, convert JFIF to JPG, add session log"

---

## Running the Analyzer

```bash
node analyzer.js https://example.com
```

Output goes to `output/`:
- `screenshots/` — full-page captures
- `html/page.html` — rendered DOM
- `metadata.json` — machine-readable analysis
- `report.md` — human-readable report

---

## Useful Commands

```bash
# Install dependencies
npm install

# Run analyzer
node analyzer.js <url>
```
