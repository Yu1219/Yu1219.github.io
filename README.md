# Yu Sakurai — Research Portfolio

Public research and pharmaceutical R&D portfolio for Yu Sakurai, PhD.

Website: https://yu1219.github.io/

The site covers targeted lipid nanoparticles, RNA delivery, ophthalmic formulation development, manufacturing technology and external technology assessment. It includes research case studies, a publication list and a downloadable CV.

## Hosting

This is a static website. GitHub Pages publishes the `main` branch from `/ (root)`. No build step or package installation is required; `.nojekyll` disables Jekyll processing.

For a local preview, run `python -m http.server 8000` in this folder and open `http://localhost:8000/`.

## Contents

- `index.html`: rendered profile and publication fallback for readers without JavaScript.
- `app.js` and `content/*.json`: interactive research themes, career and publication browsing.
- CSS files and `assets/`: presentation and images.
- `cv/CV.pdf`: two-page recruiter CV.
- `robots.txt`, `sitemap.xml` and page metadata: public discoverability.

Keep the rendered HTML and JSON content consistent when updating the profile. Publication identifiers, dates and attribution should remain source-based.

## Published research figures

The research cases include three original graphical abstracts with short explanations, source-paper links and full citations. Images open at full resolution and retain their original proportions. Figure sources, reuse terms and file hashes are recorded in [RESEARCH_FIGURE_SOURCES.md](RESEARCH_FIGURE_SOURCES.md).

Edit figure metadata in `content/projects.json` and patent titles and publication numbers in `content/patents.json`. Patent entries show only the published title and publication number; inventor and applicant names are excluded from the published data. After updating research or patent content or the renderer in `app.js`, run `node scripts/render-research.cjs` to refresh the matching static HTML. This script needs only Node.js; no package installation is required. It updates only the research and patent sections, preserving the profile and complete publication fallback.

Prepared from the portfolio revision published on 25 September 2026. Private working notes and original source documents are not included.
