# Developer portfolio

A one-page, static portfolio designed for GitHub Pages. It uses plain HTML, CSS and JavaScript with no build step.

## Personalize before publishing

Your name, title, and email are already set. The page features 32 projects you supplied, with details from your CV and project spreadsheet. The All collection loads nine projects at a time. Projects can appear in more than one category without being duplicated in the gallery. Check each caption against your exact role before publishing. Project previews are saved locally in `assets/projects/`, so the published site does not rely on the project websites to load its images.

The circular hero uses an enhanced, web-optimized version of your supplied portrait. The CV itself is not included in the public site; its relevant experience is summarized on the page.

## Preview locally

From this folder, run `python -m http.server 8000`, then open `http://localhost:8000`.

## Publish with GitHub Pages

Put the contents of this folder at the root of a GitHub repository. In the repository's **Settings → Pages**, select **Deploy from a branch**, then choose the branch and `/ (root)` folder. A repository named `<username>.github.io` publishes at `https://<username>.github.io/`; a project repository publishes at `https://<username>.github.io/<repository>/`.

GitHub Pages supports multiple HTML pages. This portfolio is intentionally one page.
