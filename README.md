# Saksham Mittal — Portfolio

Personal portfolio of Saksham Mittal - software engineer and full-stack developer.
Deployed at [sakshammittal.vercel.app](https://sakshammittal.vercel.app).

## Structure

- **`index.html`** — main page: hero, résumé, about, skills, experience, education, projects, honors, contact.
- **`projects.html`** — all projects in a grid.
- **`coursework.html`** — full B.Tech. coursework, semester by semester.
- **`site.css`** — shared theme tokens (dark/light on `<html>`), reveal + hover styles.
- **`site.js`** — vanilla JS: theme toggle, mobile nav, scroll-spy, ambient glows, drag carousels, copy-to-clipboard. Each feature no-ops on pages that lack its elements.
- **`assets/`** — images, skill icons, and `resume-preview.png` (first page of the résumé).
- **`Saksham_Resume.pdf`** — current résumé (previewed as an image on the main page, downloadable).

## Local preview

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

## Deploy

Pushed to Vercel from this repo (static, no build step).

## Contact

- Email: sakshammital@gmail.com
- GitHub: [mittal-saksham](https://github.com/mittal-saksham)
- LinkedIn: [in/mittal-saksham](https://www.linkedin.com/in/mittal-saksham/)
