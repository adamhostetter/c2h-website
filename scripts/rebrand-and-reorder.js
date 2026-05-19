// One-shot: reorder service nav/footer lists AND swap Lawrenceville→Atlanta
// across all service pages + shared templates.
//
// Run: node scripts/rebrand-and-reorder.js

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

// New canonical service order: HVAC, Planned, Emergency, Projects, Electrical, Plumbing, Controls
const NEW_NAV_DROPDOWN = `            <a class="site-nav__dropdown-link" href="hvac.html">HVAC Services</a>
            <a class="site-nav__dropdown-link" href="planned-maintenance.html">Planned Maintenance</a>
            <a class="site-nav__dropdown-link" href="emergency.html">Emergency Services</a>
            <a class="site-nav__dropdown-link" href="project-support.html">Project Support</a>
            <a class="site-nav__dropdown-link" href="electrical.html">Electrical</a>
            <a class="site-nav__dropdown-link" href="plumbing.html">Plumbing</a>
            <a class="site-nav__dropdown-link" href="building-controls.html">Building Controls</a>`;

const OLD_NAV_DROPDOWN = `            <a class="site-nav__dropdown-link" href="hvac.html">HVAC Services</a>
            <a class="site-nav__dropdown-link" href="building-controls.html">Building Controls</a>
            <a class="site-nav__dropdown-link" href="electrical.html">Electrical</a>
            <a class="site-nav__dropdown-link" href="plumbing.html">Plumbing</a>
            <a class="site-nav__dropdown-link" href="planned-maintenance.html">Planned Maintenance</a>
            <a class="site-nav__dropdown-link" href="emergency.html">Emergency Services</a>
            <a class="site-nav__dropdown-link" href="project-support.html">Project Support</a>`;

const NEW_FOOTER_SERVICES = `            <li><a href="hvac.html">HVAC Services</a></li>
            <li><a href="planned-maintenance.html">Planned Maintenance</a></li>
            <li><a href="emergency.html">Emergency Services</a></li>
            <li><a href="project-support.html">Project Support</a></li>
            <li><a href="electrical.html">Electrical</a></li>
            <li><a href="plumbing.html">Plumbing</a></li>
            <li><a href="building-controls.html">Building Controls</a></li>`;

const OLD_FOOTER_SERVICES = `            <li><a href="hvac.html">HVAC Services</a></li>
            <li><a href="building-controls.html">Building Controls</a></li>
            <li><a href="electrical.html">Electrical</a></li>
            <li><a href="plumbing.html">Plumbing</a></li>
            <li><a href="planned-maintenance.html">Planned Maintenance</a></li>
            <li><a href="emergency.html">Emergency Services</a></li>
            <li><a href="project-support.html">Project Support</a></li>`;

// Lawrenceville → Atlanta swaps (marketing only — address fields stay)
const LAWRENCEVILLE_SWAPS = [
  // Branch nav dropdown link (the one pointing to ../index.html / index.html)
  {
    from: `<a class="site-nav__dropdown-link" href="../index.html">Lawrenceville</a>`,
    to: `<a class="site-nav__dropdown-link" href="../index.html">Atlanta</a>`,
  },
  {
    from: `<a class="site-nav__dropdown-link" href="index.html">Lawrenceville</a>`,
    to: `<a class="site-nav__dropdown-link" href="index.html">Atlanta</a>`,
  },
  // Location picker (service pages)
  {
    from: `<span class="location-picker__city">Lawrenceville</span>`,
    to: `<span class="location-picker__city">Atlanta</span>`,
  },
  // Footer "Locations" list
  {
    from: `<li><a href="../index.html">Lawrenceville</a></li>`,
    to: `<li><a href="../index.html">Atlanta</a></li>`,
  },
];

const TARGETS = [
  "services/hvac.html",
  "services/building-controls.html",
  "services/electrical.html",
  "services/plumbing.html",
  "services/planned-maintenance.html",
  "services/emergency.html",
  "services/project-support.html",
  "shared/templates/service.html",
  "shared/templates/branch.html",
];

for (const rel of TARGETS) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) {
    console.warn(`  · missing: ${rel}`);
    continue;
  }
  let html = fs.readFileSync(file, "utf8");
  const before = html;
  const changes = [];

  if (html.includes(OLD_NAV_DROPDOWN)) {
    html = html.replace(OLD_NAV_DROPDOWN, NEW_NAV_DROPDOWN);
    changes.push("nav reordered");
  }
  if (html.includes(OLD_FOOTER_SERVICES)) {
    html = html.replace(OLD_FOOTER_SERVICES, NEW_FOOTER_SERVICES);
    changes.push("footer reordered");
  }
  for (const { from, to } of LAWRENCEVILLE_SWAPS) {
    if (html.includes(from)) {
      html = html.replaceAll(from, to);
      changes.push(`swap: ${from.slice(0, 60)}...`);
    }
  }

  if (html !== before) {
    fs.writeFileSync(file, html, "utf8");
    console.log(`✓ ${rel.padEnd(45)} (${changes.length} change${changes.length === 1 ? "" : "s"})`);
  } else {
    console.log(`  ${rel.padEnd(45)} already current`);
  }
}
