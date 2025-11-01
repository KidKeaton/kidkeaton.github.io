# Repository Guidelines

## Project Structure & Module Organization
This GitHub Pages site lives in the repository root. `index.html` contains both layout markup and inline styles; update sections such as `.hero`, `.section`, or `.card` in place to keep the design cohesive. The `CNAME` file must retain the production domain, so update it only when DNS changes are deliberate.

## Build, Test, and Development Commands
No build step is required. Run `python3 -m http.server 8000` from the repository root to preview the site locally at `http://localhost:8000`. If you prefer Node tooling, `npx serve .` provides the same outcome. Stop the server before committing to avoid leaving background processes running.

## Coding Style & Naming Conventions
Use four-space indentation for both HTML and embedded CSS to match the existing document. Keep class names descriptive and lower-kebab-case (e.g., `.social-links`, `.card`). Extend color or spacing tokens through the `:root` CSS variables instead of hard-coding new values, and group related rules to preserve the current visual rhythm.

## Testing Guidelines
Before pushing, open the page in at least one Chromium-based browser and Safari or Firefox, confirming that layout grids and hover states behave as expected down to 320px width. For performance and accessibility spot checks, run Lighthouse via browser DevTools and address any major regressions. Document noteworthy manual test steps in the pull request.

## Commit & Pull Request Guidelines
Follow the existing history by using short, imperative commit subjects (e.g., “Update hero copy”, “Refine card spacing”). Squash minor fixes before opening a pull request. PRs should include a concise summary, screenshots or screen recordings of visible changes, and links to filed issues when relevant. Call out any content or DNS updates that require coordination before deployment.

## Deployment & Configuration
Merging to the default branch deploys automatically through GitHub Pages. After modifying `CNAME`, confirm that the domain DNS points to GitHub Pages and revalidate HTTPS in the repository settings. If a deployment introduces regressions, roll back by restoring the previous `index.html` version and redeploying through a revert commit.
