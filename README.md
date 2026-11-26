# Coffee Joint on Napier — deployment files

## Folder layout

- `index.html` — homepage and page shell; keep this at the published site root.
- `assets/css/site.css` — site styles.
- `assets/js/site.js` — page rendering and interactions.
- `assets/videos/espresso-machine-making-coffee.mp4` — muted, looping hero background video.
- `assets/images/coffee-joint-white-transparent.png` — transparent white hero mark made from the original logo image.
- `assets/images/partners/` — the partner logos and supplied product photos for the Partners page.
- `robots.txt` and `llms.txt` — crawler guidance and a plain-text site summary.
- `.nojekyll` — tells GitHub Pages to serve the static files directly.

The site includes a separate Partners page at `?page=partners`, with links to MILKLAB and The Bean Cartel’s official information.

## Publish on GitHub Pages

Upload the contents of this folder to a repository, then enable Pages for the `main` branch and the repository root. Relative asset paths also work when GitHub Pages publishes under a repository subpath.

## Publish on Hostinger

Create a custom HTML/PHP website and upload the contents of this folder into the website's public root (usually `public_html`). Keep the `assets` folder beside `index.html`.

