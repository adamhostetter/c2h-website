# C2H Website

Standalone website for **C2H**, a FirstCall company (Greater Atlanta — Lawrenceville HQ + Buford).

Built from the same template pipeline as `STR Mechanical/` (sibling folder) — the two repos are independent but share design DNA: same Columbus-aligned color palette, same build script, same handlebars-subset templates.

---

## Structure

```
C2H/
├── index.html               ← Lawrenceville HQ landing
├── buford.html              ← Buford (formerly Timco) page
├── services/
│   ├── hvac.html
│   ├── building-controls.html
│   ├── electrical.html        (fresh content — Greater Atlanta electrical scope)
│   ├── plumbing.html          (fresh content — commercial plumbing scope)
│   ├── planned-maintenance.html
│   ├── emergency.html
│   └── project-support.html
├── config.json              ← Lawrenceville config (build target: index.html)
├── branches/buford/config.json
├── services/<slug>/config.json
├── shared/
│   ├── css/                 ← tokens + base + components + branch + service
│   ├── js/site.js           ← nav dropdowns, header scroll, hero video, parallax
│   ├── templates/
│   │   ├── branch.html      ← per-location page template
│   │   └── service.html     ← per-service page template
│   ├── partials/industries-grid--main.html
│   └── img/
│       ├── logos/c2h-hero.svg   ← white wordmark, inlined into header + footer
│       ├── videos/c2h-hero.mp4  ← 9.4 MB drone flyover (both locations use it)
│       └── photos/c2h/          ← photo-strip placeholders (REPLACE before launch)
├── scripts/
│   ├── build-branches.js    ← hydrates any template + config → fully-inlined HTML
│   ├── dev-server.js
│   └── wire-forms.js
└── _worker.js               ← Cloudflare Worker for contact form (NOT used by GitHub Pages)
```

## Build

```bash
# Lawrenceville (root config → index.html)
node scripts/build-branches.js

# Buford
node scripts/build-branches.js --config branches/buford/config.json --out buford.html

# Any service page
node scripts/build-branches.js \
  --template shared/templates/service.html \
  --css "tokens.css,base.css,components.css,service.css" \
  --config services/<slug>/config.json \
  --out services/<slug>.html
```

Every build inlines CSS, the `c2h-hero.svg` logo, `site.js`, and per-service icons into the output HTML so each page renders standalone.

## Design tokens

Cream-and-navy palette (Columbus reference): page `#FCFBF7`, text `#1A2331`, accent blue `#00558C`, primary green `#1A4120`, dark header `rgba(15, 40, 20, 0.92)`. Identical to STR Mechanical so the FirstCall family of sites stays visually coherent.

---

## Pre-launch action items

### 🚨 Blockers (must fix before public/demo deploy)

- [ ] **Email addresses** — both location configs use `info@c2h.com` as a placeholder. The real C2H site lists `ryan.smith@firstcallmechanical.com` (Lawrenceville) and Timco's site lists `mike@timcoair.com` (Buford). Confirm a real general-dispatch email or replace.
- [ ] **Hero video size** — `c2h-hero.mp4` is 9.4 MB at 1440p/24fps. Acceptable for demo; compress to ~3-5 MB at 720p before public launch.
- [ ] **Photo strip** — the 3 photos (`lift.jpg`, `drone-aerial.jpg`, `jobsite.jpg`) are reused from STR's generic mechanical-work pool. Replace with C2H-specific production photos.

### ⚠️ GitHub Pages deploy (if using)

- [ ] All internal links are **relative** (matches STR's fix from when project-page deployment broke absolute paths). Should deploy cleanly to `<user>.github.io/c2h-website/` without rewrites.
- [ ] `.gitignore` excludes `reference/`, `node_modules/`, `dist/`, OS junk — same as STR.
- [ ] `_worker.js` won't run on GitHub Pages (Cloudflare Workers only). Form is decorative on a Pages deploy until you wire Formspree/Netlify Forms or move to Cloudflare Pages.

### ✏️ Content review

- [ ] **Service copy review** — service bodies on the 5 shared services are general commercial-mechanical content (inherited from STR). Confirm tone/accuracy for C2H specifically.
- [ ] **Electrical + Plumbing capability scope** — I wrote those two fresh based on standard commercial-mechanical patterns. Confirm with C2H what's actually performed in-house vs subcontracted, and which sub-services are accurate (EV charging? Generators? Backflow testing?).
- [ ] **Buford "formerly Timco"** — the heroParagraph for buford.html mentions "formerly Timco Heating & Air" as a transition cue. Confirm this is the public-facing position vs. quietly retiring the Timco brand.
- [ ] **Tagline** — using "Durable Partnerships" (from c2h.com). Confirm this is current.
- [ ] **GA state licenses** — `stateLicenses: []` on both location configs. Confirm whether GA HVAC/electrical/plumbing license disclosures are required on the site.

### 🎨 Polish

- [ ] **Comment cleanup in shared CSS/JS** — `tokens.css`, `branch.css`, `service.css`, `site.js` retain comments like `/* STR Design Tokens */` and `/* STR Locations grid */` from when they were copied. Invisible to end users but should be genericized.
- [ ] **C2H-branded favicon** — currently uses `firstcall-group-favicon.svg`. Make a C2H favicon.
- [ ] **Privacy + Terms pages** — currently `href="#"` placeholders.
- [ ] **Real LinkedIn URL for C2H** — footer links to `linkedin.com/company/firstcall-mechanical/` (inherited). If C2H has its own LinkedIn presence, swap.

### 📦 When ready to push to GitHub

Same flow as STR:

```powershell
cd C2H
git init
git add .
git commit -m "Initial commit: C2H multi-location site (2 locations + 7 services)"
# Create the repo at https://github.com/new (Owner: adamhostetter, Name: c2h-website)
git remote add origin https://github.com/adamhostetter/c2h-website.git
git branch -M main
git push -u origin main
```

Then GitHub Pages: Settings → Pages → Deploy from branch `main` / root.
