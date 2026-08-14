/**
 * AboutSection.jsx
 * -------------------------------------------------
 * What this component does
 * - Renders the “About Us” area as three parts:
 *   1) Hero banner (title + subtitle)
 *   2) Summary grid: Institution info + Highlights
 *   3) Annual Events (3 colored cards) + Organizing Bodies
 *   4) Bottom call-to-action (visual only; button disabled)
 *
 * Data (inline constants in this component)
 * - institution: { name, affiliation, location, established }
 * - highlights:  [{ text }]
 * - annualEvents: [
 *     { key, title, icon, color, items: [{ name, month }] },
 *   ]
 * - bodies:       [{ icon, label }]
 *
 * Accessibility
 * - Main wrapper has id="about" for in-page navigation.
 * - Headings follow a simple hierarchy (h2 > h3 > h4).
 *
 * How to customize
 * - Move the inline data to a JSON file later if needed.
 * - Colors/skins are handled in AboutSection.css (already in your project).
 * - The “Contact Us” button at the bottom is intentionally disabled (visual only).
 */

import "../styles/AboutSection.css";

export default function AboutSection() {
  // ---------- Institution info (static for now) ----------
  const institution = {
    name: "XYZ College of Engineering",
    affiliation: "ABC University",
    location: "Mumbai, Maharashtra",
    established: "1985",
  };

  // ---------- Highlights (short facts) ----------
  // NOTE: You currently render <span className="ic">{h.icon}</span> below,
  // but highlights[] doesn’t include an `icon`. Keep the <span> for layout
  // or add icons here later if you want.
  const highlights = [
    { text: "NAAC A+ Accredited" },
    { text: "5000+ Students" },
    { text: "95% Placement Rate" },
    { text: "Modern Labs & Facilities" },
  ];

  // ---------- Annual events (by tracks) ----------
  // color keys (tech|cultural|sports) map to CSS accents in AboutSection.css
  const annualEvents = [
    {
      key: "tech",
      title: "Technical",
      icon: "💻",
      color: "tech",
      items: [
        { name: "TechFest", month: "Feb" },
        { name: "Code Marathon", month: "Sep" },
        { name: "Robotics Championship", month: "Nov" },
      ],
    },
    {
      key: "cultural",
      title: "Cultural",
      icon: "🎭",
      color: "cultural",
      items: [
        { name: "Annual Day", month: "Dec" },
        { name: "Music Night", month: "Mar" },
        { name: "Dance Competition", month: "Oct" },
      ],
    },
    {
      key: "sports",
      title: "Sports & Activities",
      icon: "🏃‍♂️",
      color: "sports",
      items: [
        { name: "Sports Meet", month: "Jan" },
        { name: "Blood Donation", month: "Jun/Dec" },
        { name: "Alumni Meet", month: "Aug" },
      ],
    },
  ];

  // ---------- Organizing bodies (departments/clubs/councils) ----------
  const bodies = [
    { icon: "🎨", label: "Cultural Committee" },
    { icon: "⚽", label: "Sports Committee" },
    { icon: "💡", label: "Technical Society" },
    { icon: "📚", label: "Acadmic " }, // NOTE: consider spelling "Academic"
  ];

  return (
    <div id="about" className="about-wrap section container" aria-labelledby="about-title">
      {/* ===== Hero banner ===== */}
      <div className="about-hero" role="img" aria-label="About the college">
        <div className="container">
          <h2 id="about-title" className="about-title">About XYZ College of Engineering</h2>
          <p className="about-subtitle">Excellence in Education Since 1985</p>
        </div>
      </div>

      {/* ===== Summary grid: institution + highlights ===== */}
      <section className="container section about-summary" aria-label="College summary">
        {/* Institution */}
        <div className="summary-col">
          <h3 className="summary-heading">Our Institution</h3>
          <ul className="kv">
            <li><span className="k">Name:</span> <span className="v">{institution.name}</span></li>
            <li><span className="k">Affiliation:</span> <span className="v">{institution.affiliation}</span></li>
            <li><span className="k">Location:</span> <span className="v">{institution.location}</span></li>
            <li><span className="k">Established:</span> <span className="v">{institution.established}</span></li>
          </ul>
        </div>

        {/* Highlights */}
        <div className="summary-col">
          <h3 className="summary-heading">Highlights</h3>
          <ul className="highlights">
            {highlights.map((h) => (
              <li key={h.text}>
                {/* Keep this <span> if your CSS relies on it for spacing; add emoji/icon later if needed */}
                <span className="ic" aria-hidden="true"></span>
                {h.text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== Annual Events (three cards) ===== */}
      <section className="container section" aria-label="Annual events">
        <h3 className="sec-heading">Annual Events</h3>
        <div className="ae-grid">
          {annualEvents.map((block) => (
            <article className={`ae-card ${block.color}`} key={block.key}>
              <div className="ae-head">
                <span className="ae-ic" aria-hidden="true">{block.icon}</span>
                <span className={`ae-title ${block.color}`}>{block.title}</span>
              </div>

              <ul className="ae-list">
                {block.items.map((it) => (
                  <li key={it.name}>
                    {it.name}
                    <span className="month-pill" aria-label={`Month: ${it.month}`}>{it.month}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* ===== Organizing Bodies ===== */}
      <section className="container section" aria-label="Organizing bodies">
        <h3 className="sec-heading">Organizing Bodies</h3>
        <div className="bodies">
          {bodies.map((b) => (
            <div className="body-card" key={b.label}>
              <div className="body-ic" aria-hidden="true">{b.icon}</div>
              <div className="body-txt">{b.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Bottom CTA (visual only) ===== */}
      <div className="about-cta" aria-label="Get in touch">
        <div className="container cta-inner">
          <p className="cta-title">Join Our Community of Excellence</p>
          <div className="cta-actions">
            {/* Disabled on purpose — design-only CTA */}
            <a className="btn outline disabled" href="#ContactSection" aria-disabled="true" tabIndex={-1}>
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
