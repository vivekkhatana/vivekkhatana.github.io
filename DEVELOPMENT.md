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

## Research media infrastructure

Existing portraits remain at `images/profile.jpeg` and `images/bio.jpeg`.
Keep future research figures and video posters under `images/research/<project>/`.
Small, web-ready video clips and caption tracks can live under
`media/research/<project>/`. Create these directories only when approved files
are supplied; the current website still uses its labeled development placeholders.

`media/research-manifest.json` is the asset planning inventory. It is not fetched
by the homepage and does not create media requests. Every asset URL starts as
`null`; fill a field only after the file exists or an external URL is verified.
The card's `data-media-project` value matches its manifest key.

| Project key | Required approved media |
| --- | --- |
| `covariance-steering` | Control-architecture figure or covariance-steering demonstration |
| `small-body-planning` | Small-body geometry/keep-out figure or simulation clip |
| `mean-field-control` | Network/controller diagram or illustrative animation |
| `virtual-power-plants` | Control architecture or inverter/microgrid demonstration, with the related publication identified |
| `directed-optimization` | Directed-graph or convergence figure with assumptions and labeled axes |
| `microgrid-risk-sharing` | Connectivity/storage-planning figure with its paper and assumptions identified |
| `verifier-multi-llm` | Geometric-verifier architecture or approved CARLA/Crazyflie demonstration |
| `aerial-refueling` | Estimator/control framework or approved FlightGear/JSBSim docking simulation |
| `online-model-updates` | Online model-update/control architecture or power-distribution simulation figure |
| `distributed-dc-optimization` | DDC-Consensus diagram or regularized least-squares convergence figure |

Private prototype material remains in the separate review package outside this
checkout. Newly authorized gallery descriptions use only the supplied public
papers; their disclosure does not authorize copying private drafts, manuscript
submission details, or prototype pages into the website.
Do not add private titles, assets, or paths to tracked files before disclosure is
approved.

### Adding a static figure

Replace the card's `.project-media-placeholder` with a native figure. The paths
below are examples of future filenames, not currently available assets. Use the
actual dimensions, meaningful alt text, and a source/credit when needed.

```html
<figure class="project-media">
  <img data-research-figure
       src="images/research/covariance-steering/figure.webp"
       width="1280" height="720" loading="lazy" decoding="async"
       alt="Describe the actual diagram, variables, and relationships shown.">
  <figcaption>Approved explanation and source for this figure.</figcaption>
</figure>
```

The enhancement preserves native image behavior, applies lazy loading, and shows
a text fallback if an image fails. It does not generate research descriptions.

### Adding MP4/WebM video

Use native controls and `preload="none"` in the HTML itself. Supply whichever
formats actually exist; using both lets the browser choose a supported source.
Use MP4/H.264 for broad compatibility and optionally WebM/VP8 or VP9. Encoding
support depends on the browser and device; test the actual files before release.

```html
<figure class="project-media">
  <video data-research-video controls playsinline preload="none"
         width="1280" height="720"
         poster="images/research/covariance-steering/poster.webp"
         data-poster-alt="Describe the actual poster frame."
         aria-label="Describe the specific research demonstration."
         aria-describedby="covariance-demo-caption">
    <source src="media/research/covariance-steering/demo.webm" type="video/webm">
    <source src="media/research/covariance-steering/demo.mp4" type="video/mp4">
    <track kind="captions" srclang="en" label="English" default
           src="media/research/covariance-steering/captions.en.vtt">
    Your browser does not support inline video. Use the video link below.
  </video>
  <p class="project-media-fallback" data-media-fallback hidden>
    This video could not be played. Use the video link below or the related
    project resources.
  </p>
  <p><a href="media/research/covariance-steering/demo.mp4">Open video file</a></p>
  <figcaption id="covariance-demo-caption">
    Approved explanation of the demonstration, its conditions, and limitations.
  </figcaption>
</figure>
```

Use caption tracks for speech or meaningful audio and provide a descriptive
caption/transcript for visual information that is not otherwise explained.
Omit absent sources, poster, or caption-track URLs entirely; never use empty
`src`/`href` values. If only one format exists, link that actual file below the
player. Keep important resource links outside the video element so they remain
available with JavaScript disabled or unsupported codecs.

An optional external video link is an ordinary anchor with `data-external-video`,
a verified `href`, and meaningful link text. Use `target="_blank" rel="noopener"`
if opening another tab. Do not insert an embed or fetch a remote player just to
display the link. Keep this link outside the hidden error-message container so
it is available without JavaScript too. The error handler can focus this
recovery link if the player had keyboard focus when it failed.

### Playback and fallbacks

`scripts/research-media.js` enhances only marked media inside Selected Research
Projects. It also initializes marked media inserted later into that section.

- Every video starts click-to-play, with controls, inline playback and no autoplay.
  The script never calls `play()` or `load()` and does not fetch the manifest.
- `preload="none"` avoids eager video loading in supporting browsers; it is a
  browser hint, not an absolute network guarantee. Posters may load separately.
- For an appropriate short, silent preview, add `muted data-preview` to the
  native video. It still requires a click to start. JavaScript enables muted
  looping only when reduced motion and data-saving preferences allow it.
  Do not add a static `loop` or `autoplay` attribute.
- Reduced-motion or data-saving changes pause previews and disable looping.
  They do not prevent a visitor from deliberately playing an ordinary video.
- IntersectionObserver pauses off-screen videos when available. Filtering a
  card out, removing it, or hiding the document also pauses playback. Returning
  to view does not restart it. Without IntersectionObserver, hidden-card and
  document-visibility pausing still work.
- Failed video sources reveal a text fallback. A supplied poster becomes an
  image fallback; `data-poster-alt` supplies its description. A failed poster is
  removed rather than displaying a broken-image icon. External/file links remain.
- Native controls, poster, figure, and links remain usable without JavaScript;
  enhanced pausing and error recovery then depend on browser behavior.
- Existing responsive media styles keep intrinsic image/video aspect ratios and
  never crop research figures. For a card without media, omit the media element
  and add `project-card--text-only` to the card.

### File-size and release checks

Keep raw recordings, private drafts, and large originals outside Git. Prefer a
short compressed clip and small poster; use an approved external video link for
large recordings. Inspect byte size and visual legibility before staging. Do not
download unrelated images or commit test fixtures. No media binaries are added
by this infrastructure change.

For each supplied asset, verify disclosure/credit, file existence and MIME type,
alt text/caption, source fallback, actual playback, keyboard controls, filtering
and off-screen pausing, reduced-motion behavior, and desktop/mobile dimensions.
Check DevTools Network after a fresh homepage load to ensure unplayed research
videos are not eagerly transferred. Then update the planning manifest to match
the approved HTML; it is documentation, not an automatic renderer.

## Standalone research project pages

`projects/template.html` is a generic, unlinked scaffold, not a published research
claim. Preview it at <http://127.0.0.1:8000/projects/template.html>. Its `noindex`
directive discourages indexing; it does not provide privacy. Keep private drafts
outside this checkout and outside the server's document root. The named prototype
is kept separately for private review and must not be copied into the website
until disclosure is explicitly approved.

The homepage and project pages share `styles/site.css`, extracted unchanged from
the homepage's inline stylesheet. `styles/project-page.css` adds only rules scoped
to standalone pages. Keep shared typography, palette, sidebar, and spacing in the
shared stylesheet; do not duplicate those rules in individual project pages.

After approval, copy the template to an appropriate filename in `projects/`.
Replace the title, description, visible heading, overview, author/collaborator
credits, and venue/status with verified information. The `data-field` attributes
identify editable content for maintainers; there is no renderer or build step.
Explicitly distinguish accepted/published papers, workshop papers, preprints, and
under-review manuscripts. Do not infer acceptance from a conference year.

The template includes motivation, mathematical/algorithmic contribution,
architecture, separate quantitative and qualitative results, publications, and
code/supplement/poster/slide resources. Keep pending material as clearly identified
development placeholders during review; omit unavailable material on an approved
public page. Never fill gaps with invented results, equations, collaborator roles,
or placeholder URLs. Plain HTML `var`, `sub`, `sup`, native MathML, or `pre`/`code`
can express approved mathematics/algorithms without a library. Use
`project-page-math` for a scrollable formula block, and `project-page-table-wrap`
around a `project-page-table` with a caption and scoped column/row headings for
verified tabular results. Explain assumptions, baselines, units, and limitations.

For media, replace a placeholder with the figure/video markup documented above.
Keep media within `#selected-projects` so shared responsive styles and
`scripts/research-media.js` work on both kinds of page. Use a unique descriptive
accessible label on every player and meaningful alt text/captions on figures;
the standalone page does not inherit a gallery card title. Keep optional resource
links outside the player and omit missing URLs. No research assets are bundled
with this template.

Use relative paths (`../styles/`, `../scripts/`, `../images/`, and
`../index.html#selected-projects`) so nested pages work on GitHub Pages and the
local server. Add a gallery link only after the project and page are approved.
Test keyboard skip/navigation/back links, all local assets, media fallbacks,
small screens, reduced motion, and readability without JavaScript. Do not create
the remaining project pages before prototype approval.

## Consolidated navigation and content

The homepage's six main sections are Bio, News, Awards, Research, Teaching &
Service, and Contact, in that order. Landing, desktop, and mobile navigation use
the same labels and destinations. Desktop Research has a separate native
disclosure beside its main anchor; the compact mobile Menu uses the same research
sub-navigation. Both remain manually usable without JavaScript.

Research subsections, in order: `#research-interests`, `#selected-projects`,
`#publications`, `#funding`, `#res-talks` (Talks & Presentations), and `#res-code`
(Research Software). Keep `#selected-projects` intact for filtering, media,
manifest keys and standalone project-page back links. The former `#honors` is an
alias at Awards; `#media` and `#resources` are aliases at Talks & Presentations.
Old URLs still reach meaningful destinations without redirects. Do not duplicate
IDs when adding further compatibility anchors.

`#teaching` now contains Teaching Experience (`#teaching-experience`), Research
Mentorship (`#research-mentorship`) and Professional Service (`#service`). Keep
teaching philosophy, courses, award/testimonials and mentoring/program records
with their corresponding subsection when updating content.

Keep exactly six most recent entries in News's first list; place all remaining
items in the native Show Older News disclosure, preserving chronological order
and the date precision actually known. Update its displayed count when adding or
moving an item. Speaker bio is also a native disclosure, replacing the inherited
broken toggle. Both controls work with keyboard and JavaScript disabled.

Talks & Presentations is one chronological list merging the former Media and
Talks & Slides records. It has 15 distinct entries after consolidation. Retain
separate talks at the same conference and separate years. Attach each valid
event, paper, recording, slide, poster or PDF link to its relevant entry; never
use a play button for an event page or a placeholder for an unavailable URL.
Software remains a separate list of six records (seven repository URLs).

`scripts/site-navigation.js` opens Research sub-navigation for subsection hashes,
including compatibility aliases and browser history, and opens ancestor native
disclosures when a fragment targets their content. It supplements native anchors
rather than intercepting navigation. Filtering and research media scripts retain
their existing scope. The obsolete unfinished speaker script is removed and the
document now has closing body/html tags; the pre-existing Cloudflare script URL
is retained and still requires separate review of its local 404.

Regression checks should compare external URL sets and academic content against
the preceding commit, verify all old fragments and project back links, exercise
native disclosures with/without JS and keyboard input, and check desktop/mobile
navigation plus every project filter. Publication lists remain fully visible.

## Research gallery categories and paper identities

The gallery has ten unique cards. Filters use the following keys and visible
labels, shared by each card's category tags:

- `all`: All.
- `robotics-autonomy`: Robotics and Autonomy.
- `control-stochastic-decision-making`: Control and Stochastic Decision-Making.
- `learning-data-driven-decision-making`: Learning and Data-Driven Decision-Making.
- `optimization`: Optimization.
- `energy-systems`: Energy Systems.

Assign multiple keys to one card's `data-categories`; never duplicate a card to
appear in multiple filters. The filter script reads the keys from the buttons,
uses sets for category membership, and derives accessible status text from the
visible label. Keep labels, tags and keys consistent when editing. Filters and
tags wrap at the existing font sizes; no JavaScript is required to read the cards.

New paper-to-card mappings:

- `verifier-multi-llm`: arXiv:2610.12761, an IROS 2026 Foundation Models in
  Multi-Robot Systems workshop paper. It is not the separate private prototype.
- `aerial-refueling`: arXiv:2610.07501, publicly listed as a preprint; no
  peer-reviewed venue is claimed. Its evaluation is simulation-based.
- `online-model-updates`: IEEE 10735270 / arXiv:2405.00637, Allerton 2024.
- `distributed-dc-optimization`: IEEE 10735298 / arXiv:2407.16728, Allerton 2024.
  DDC-Consensus is distinct from DC-DistADMM/GradConsensus in the existing
  `directed-optimization` card.
- IEEE 11312198 / arXiv:2509.04593 remains the existing `covariance-steering`
  card, now also assigned to Robotics and Autonomy.

Publisher-page access was restricted during review. The corresponding public
author manuscripts were read for abstract, methodology and contributions;
publisher-supplied Crossref records establish the three IEEE identifiers and
venues. Paper links point to accessible author PDFs, with separate publisher
links where applicable. New descriptions are 40–60 words and contain no invented
quantitative results. The media manifest includes all ten cards with null asset
paths until approved media arrives; PDFs used for review are not committed.
