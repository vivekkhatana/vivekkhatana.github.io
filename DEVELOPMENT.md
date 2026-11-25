# Local development and preview

This is a static HTML website. Python 3 is the only tool needed to preview it;
there is no dependency installation or build step.

## Start the preview

From the repository checkout:

```sh
cd /Users/vivek/Desktop/Personal/Website/website-repository
git branch --show-current
git status --short
python3 -m http.server 8000 --bind 127.0.0.1
```

Confirm the branch is `website-redesign` and inspect any existing changes before
editing. Open <http://127.0.0.1:8000/> in a browser. Keep the server terminal open;
press Ctrl+C in that terminal to stop it. Refresh the browser after edits. Use a
hard refresh if an old image or stylesheet remains cached.

If port 8000 is already occupied, use 8001 in both the command and URL. Serve the
repository root, where `index.html` and `images/` live, rather than its parent
directory or the older loose HTML copy. The server binds only to this computer.

In a restricted agent environment, starting the server and accessing localhost
may require permission. Neither command publishes the site. Python's server does
not implement hosting-specific `_headers` behavior. Google Fonts and external
document links require an internet connection.

## Baseline verification — November 25, 2026

Website source baseline: `a9ba6728003388e8bbc1f30d842881e450e26018`.
Tested with installed headless Chrome 158 through its DevTools Protocol, using
Python's standard library. No browser-automation packages were installed.

- The homepage loads locally with the correct title and a complete document load.
- All three image elements display successfully: landing and sidebar portraits
  use `images/profile.jpeg`; the biography uses `images/bio.jpeg`. Both source
  images decode at 4096 by 4096 pixels.
- All fragment-link destinations exist, with no duplicate IDs. Section navigation
  uses native browser anchors and smooth scrolling. All eleven unique targets
  were clicked and reached after the animation settled; Contact reaches the
  document's maximum scroll position. Active sidebar highlighting is not
  implemented by the incomplete script described below.
- Desktop uses the existing sticky sidebar and two-column card grids. At widths
  of 680 pixels and below, the sidebar becomes a compact row, its navigation is
  hidden, the biography image stacks, and card grids become single-column.
- No horizontal document overflow was observed at viewport widths of 390, 680,
  681, 768, 860, or 1440 pixels. These checks establish a baseline; they do not
  constitute exhaustive device or cross-browser testing.
- The existing Google Drive CV viewer responds successfully and identifies
  `CV_Vivek_Khatana.pdf`, without an access-request page. The viewer was checked;
  the CV download action was not independently verified.
- The existing IIT Roorkee seminar PDF downloads successfully: HTTP 200,
  `application/pdf`, 490891 bytes, and a valid PDF signature.
- No PDFs or other downloadable document files are stored in this repository.
  Talks & Slides entries are currently text rather than download links.

### Existing failures, preserved for subsequent work

- Clicking **Speaker bio** raises `ReferenceError: toggleSpeakerBio is not defined`;
  the content remains hidden and `aria-expanded` stays `false`. The HTML ends
  inside an unclosed inline script, after `document.querySelectorAl`.
- The referenced `/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js`
  returns HTTP 404 locally. The current email links already use `mailto:`.
- Chrome also requests the absent `/favicon.ico`, producing a minor HTTP 404.

The console-error and interaction checks therefore do not pass cleanly. These
are pre-existing source issues; this workflow setup does not repair them or
change the design.

### Baseline artifacts

The local, untracked comparison artifacts are outside the checkout at:

```text
../preview-baseline-nov-2026/
  desktop-landing.png
  desktop-bio.png
  desktop-research.png
  desktop-publications.png
  mobile-landing.png
  mobile-bio.png
  mobile-research.png
  mobile-publications.png
  audit.json
  navigation-settled.json
```

Desktop screenshots use a 1440 by 1000 viewport; mobile screenshots use 390 by
844, with device scale factor 1. Each captures the viewport at the start of the
named section, rather than the full section. The audit records image loading,
layout metrics, link inventory, and browser errors. Initial Python document
requests encountered a local certificate-store problem; subsequent system curl
checks verified the CV viewer and seminar PDF without disabling TLS verification.

These artifacts are local comparison files, not deployed assets or tracked
repository files. Preserve them when moving this checkout.

## Checks for subsequent changes

1. Stay on `website-redesign` and follow `AGENTS.md`.
2. Preview the affected section and check image loading and link destinations.
3. Compare desktop and mobile views against the baseline screenshots, including
   widths immediately above and below the 680-pixel breakpoint.
4. Check the browser console and relevant interactive controls. Distinguish new
   regressions from the recorded baseline failures.
5. Run `git diff --check`, inspect the diff, and make a focused commit. Report
   changes, verification results, and the commit hash. Deployment and merges into
   `main` require explicit approval.
