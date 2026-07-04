# Saksham Mittal — Portfolio

Personal portfolio of Saksham Mittal — software engineer and full-stack developer.

- **`index.html`** — main page: hero, résumé viewer, about, skills, experience, education, projects, honors, and contact.
- **`projects.dc.html`** — all projects in a grid.
- **`coursework.dc.html`** — full B.Tech. coursework, semester by semester.
- **`support.js`** — the dc-runtime that renders the `<x-dc>` templates with React (generated file; do not edit by hand).
- **`assets/`** — images and skill icons.
- **`Saksham-Mittal-Resume.pdf`** — current résumé, embedded on the main page.

## Running locally

The pages fetch sibling templates and the résumé PDF, so serve the directory over HTTP rather than opening the files directly:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Notes

- Pages are rendered client-side by `support.js` (React 18 from unpkg, pinned with SRI hashes). JavaScript is required.
- The dark/light theme toggle persists the choice in `localStorage` under `sm-theme`.

## Contact

- Email: sakshammital@gmail.com
- GitHub: [mittal-saksham](https://github.com/mittal-saksham)
- LinkedIn: [in/mittal-saksham](https://www.linkedin.com/in/mittal-saksham/)
