# Work With Roi Website

A static, GitHub Pages-ready website for **Work With Roi**, positioned as a Real Estate Marketing & Digital Operations Specialist serving busy U.S. real estate professionals.

The repository uses plain HTML, CSS, and vanilla JavaScript. There is no framework, package manager, or build step.

## Project structure

```text
work-with-roi/
├── index.html
├── services.html
├── portfolio.html
├── about.html
├── contact.html
├── 404.html
├── .nojekyll
├── robots.txt
├── sitemap.xml
├── site.webmanifest
├── favicon.svg
├── README.md
└── assets/
    ├── css/
    │   └── main.css
    ├── js/
    │   └── main.js
    ├── images/
    │   └── original SVG placeholder artwork
    └── icons/
        └── favicon.svg
```

## Preview locally

The pages can be opened directly from your file manager, but a small local server is preferred because it behaves more like GitHub Pages.

If Python is installed:

```bash
cd work-with-roi
python -m http.server 8000
```

Then open `http://localhost:8000/`.

## Upload to GitHub

1. Create a new GitHub repository, for example `work-with-roi`.
2. Upload the contents of this folder to the repository root.
3. Commit the files to the `main` branch.
4. Keep `.nojekyll` in the repository root.

All internal links and assets use relative paths, so the site works when published from a repository subdirectory such as `username.github.io/work-with-roi/`.

## Enable GitHub Pages

1. Open the repository on GitHub.
2. Go to **Settings > Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Choose the `main` branch and `/ (root)` folder.
5. Save.
6. GitHub will display the public Pages URL once deployment is complete.

## Update text

Each page is a standalone HTML file:

- Home: `index.html`
- Services: `services.html`
- Portfolio: `portfolio.html`
- About: `about.html`
- Contact: `contact.html`

Shared visual styles live in `assets/css/main.css`.

## Replace images

The current visual assets in `assets/images/` are original SVG placeholders created for this build. They deliberately do not copy third-party photos from the visual mockups.

You can replace an SVG with an approved JPG, PNG, WebP, or SVG file. For the easiest swap, keep the filename the same or update the matching `src` attribute in the relevant HTML file.

Recommended replacement priorities:

1. Professional portrait for the About page
2. Home hero workspace image
3. Complete Listing Launch portfolio assets
4. Realtor Social Media System assets
5. Real Estate Newsletter assets
6. Additional capability visuals
7. Final About page lifestyle/workspace images

Keep the original aspect ratio when possible so layouts remain stable.

## Change brand colors and typography

Open `assets/css/main.css` and edit the CSS custom properties at the top of the file under `:root`.

Important tokens include:

- `--navy-950`
- `--orange`
- `--cream`
- `--warm`
- `--serif`
- `--sans`
- `--container`

The current typography uses Libre Baskerville for editorial headings and Inter for supporting text.

## Change pricing

Visible prices are written in `services.html`, `index.html`, and `contact.html`.

Interactive package-builder prices are stored in the `data-price` attributes of each checkbox.

The JavaScript calculator uses a reference conversion rate of **1 USD (approximately ₱62.69 PHP)**, set in `assets/js/main.js` as:

```js
const PHP_PER_USD = 62.685;
```

Update this value whenever you want the displayed PHP estimates to use a newer reference rate. The current reference rate was retrieved on September 30, 2026.

## Quote form endpoint

GitHub Pages cannot process server-side form submissions by itself.

The form is fully structured and validates required fields in the browser, but delivery is intentionally disabled until an external endpoint is connected.

Open:

```text
assets/js/main.js
```

Find:

```js
const FORM_ENDPOINT = '';
```

Add the HTTPS endpoint supplied by Formspree, Web3Forms, or another service. Do not place private API secrets in a public GitHub Pages repository.

When the endpoint is blank, the site prevents submission and displays a clear setup message rather than pretending a request was sent.

## Social and contact links

The footer and Contact page currently contain placeholders for Email, LinkedIn, and Instagram. Replace those placeholders with your approved public links before launch.

## Sitemap and robots.txt

Before public launch, replace `YOUR-USERNAME` inside:

- `sitemap.xml`
- `robots.txt`

with the actual GitHub username or replace those URLs with your custom domain.

## Custom domain

After you own a domain:

1. Open **Settings > Pages** in GitHub.
2. Enter the custom domain.
3. Configure the DNS records requested by GitHub with your domain provider.
4. Enable **Enforce HTTPS** after the certificate is ready.
5. Update the URLs in `sitemap.xml` and `robots.txt`.
6. Replace relative canonical placeholders with final absolute production URLs if desired.

## Accessibility and responsive behavior

The site includes:

- semantic headings and sections
- labeled form fields
- required-field validation
- keyboard-accessible navigation
- visible focus states
- mobile navigation with `aria-expanded`
- reduced-motion support
- responsive grids and typography
- layouts for desktop, tablet, and mobile

## Before production launch

Replace the remaining placeholder visuals and direct-contact links, connect the form endpoint, update the sitemap domain, review final copy and pricing, and test the deployed GitHub Pages URL on real desktop and mobile devices.
