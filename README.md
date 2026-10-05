# Portfolio: Raywel Francis Martin

**Version 2.2** · [Patch notes](docs/patch-notes/v2.2.md) · [Release history](docs/patch-notes/README.md)

Source for <a href="https://matimbu.github.io/portfolio/" target="_blank">matimbu.github.io/portfolio</a>.
A single-page site in plain HTML, CSS and JavaScript, with no framework and no build step.
Glass panels over soft colour glows, light and dark themes, and case studies for each project.

## Sections

- **Hero**: who I am, what I build, and screenshots of real work
- **About**: background as a BSIT student at STI College Malolos, plus my stack. Core: C#, .NET, WinForms, Java, HTML/CSS/JS, Node.js, SQL/SQLite, Bootstrap. Familiar with: Next.js, Socket.IO, PostgreSQL, Git, Unity 3D, SAP S/4HANA, Figma
- **Work**, newest first: CampusQue (in development), [Motorparts Inventory](https://github.com/Matimbu/motorparts-inventory), [Off the Clock](https://github.com/Matimbu/raywelfrancismartin), Malolos Rush (group capstone), [The Hive Kiosk](https://github.com/Matimbu/kiosk-TheHive) (group project, kiosk by me), and the Cheesy Potato Balls poster. Each opens a case study.
- **Certifications**: AI Career Readiness (ASEAN Foundation), SAP S/4HANA, Oracle Academy Java Fundamentals
- **Affiliations**: STI College Malolos, SAP University Alliances, Oracle Academy
- **Contact**: email, LinkedIn, GitHub, Instagram, Discord, my <a href="https://matimbu.github.io/raywelfrancismartin/" target="_blank">personal site</a>, and a message form

## Running it locally

Open `index.html` directly, or serve the folder so paths behave like the live site:

```bash
py -3 -m http.server 5510
```

Then open http://localhost:5510.

## Setup steps

- **Message form.** Done: it sends through Formspree, using the form ID in `FORMSPREE_ID` (section 7 of `main.js`). To change where messages go, edit the form in your Formspree dashboard.
- **Visitor stats.** Add a site in your GoatCounter dashboard, put its name in the commented-out script at the bottom of `index.html`, then remove the comment markers.
- **Résumé.** Edit `docs/resume/resume.html`, then print it to `resume.pdf` in this folder (A4, no headers and footers). To add a photo, put it in `docs/resume/` and uncomment the `<img>` in the header.
- **After editing** `style.css` or `main.js`, bump the `?v=` number where `index.html` loads them, so returning visitors don't get an old cached copy.

## Structure

```
index.html                           The whole page, including the case-study dialogs
style.css                            Design tokens, glass, layout and motion, in numbered sections
main.js                              Theme switch, opening, reveals, case studies, contact form
404.html                             The "page not found" page GitHub Pages shows
resume.pdf                           One-page résumé (source: docs/resume/resume.html)
images/                              Screenshots, logos and the link preview image (og-image.png)
certificate_ai-career-readiness.png  ASEAN Foundation AI Career Readiness
certificate_java.pdf                 Oracle Academy Java Fundamentals
certificate_sap.pdf                  SAP S/4HANA certification
```

My personal site loads `images/kiosk/01-welcome.png` to `06-receipt.png` and
`images/CHEESY POTATO BALLS.png` straight from here, and links to `#featured`.
Don't move or rename those.
