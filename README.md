# Saksham Mittal — Portfolio

Personal portfolio of Saksham Mittal — software engineer and full-stack developer.

Plain, static HTML/CSS/JS. No build step, no framework, no runtime CDN
dependency — every page renders instantly and works with JavaScript disabled.

## Structure

- **`index.html`** — main page: hero, résumé, about, skills, experience, education, projects, honors, contact.
- **`projects.html`** — all projects in a grid.
- **`coursework.html`** — full B.Tech. coursework, semester by semester.
- **`site.css`** — shared theme tokens (dark/light on `<html>`), reveal + hover styles.
- **`site.js`** — vanilla JS: theme toggle, mobile nav, scroll-spy, ambient glows, drag carousels, copy-to-clipboard. Each feature no-ops on pages that lack its elements.
- **`assets/`** — images, skill icons, and `resume-preview.png` (first page of the résumé).
- **`Saksham-Mittal-Resume.pdf`** — current résumé (previewed as an image on the main page, downloadable).

## Running locally

Serve the directory over HTTP (relative asset paths):

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

Opening `index.html` directly via `file://` also works, since there's no
runtime fetching.

## Notes

- Theme choice is remembered in `localStorage` (`sm-theme`) and applied before
  first paint by a tiny inline script, so navigating between pages never flashes.
- Fonts load from Google Fonts; everything else is local.
- The résumé preview image is regenerated from the PDF with
  [`pypdfium2`](https://pypi.org/project/pypdfium2/) + Pillow when the résumé
  changes (grayscale, 16-color, ~130 KB).

## Contact

- Email: sakshammital@gmail.com
- GitHub: [mittal-saksham](https://github.com/mittal-saksham)
- LinkedIn: [in/mittal-saksham](https://www.linkedin.com/in/mittal-saksham/)
