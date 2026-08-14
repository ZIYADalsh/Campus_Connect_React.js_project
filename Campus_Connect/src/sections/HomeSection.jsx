/**
 * HomeSection.jsx
 * ---------------------------------------------
 * What this component does
 * - Renders the top "Hero / Slideshow" area using images from home.json.
 * - Shows 3 highlighted events pulled from events.json:
 *   • If there are upcoming/ongoing events → pick the earliest 3.
 *   • Otherwise → fall back to the 3 most recent past events.
 * - Each event card displays a small digital countdown (DD:HH:MM:SS) to the start date.
 *
 * Data contracts (expected JSON shape)
 * - home.json
 *   {
 *     "hero": {
 *       "title": string,
 *       "subtitle": string,
 *       "image": string,               // used if slider is empty
 *       "cta": { "label": string, "target": string },
 *       "secondaryCta": { "label": string, "target": string }
 *     },
 *     "slider": string[]               // optional: array of image URLs for slideshow
 *   }
 *
 * - events.json (array)
 *   [
 *     {
 *       "id": string,
 *       "title": string,
 *       "description": string,
 *       "date": ISOString,             // start date-time
 *       "endDate": ISOString?,         // optional end date-time
 *       "image": string?,              // optional image URL
 *       ...
 *     }
 *   ]
 *
 * Accessibility
 * - The hero background is marked as role="img" with aria-label=heroTitle.
 * - Headings use a logical structure; “UPCOMING EVENTS” is the section title.
 *
 * Notes
 * - Slideshow auto-advances every 5s (if there is more than one slide).
 * - Countdown ticks every second; the event selection is recomputed once per hour.
 */

import { useEffect, useMemo, useState } from "react";
import "../styles/HomeSection.css";
import events from "../data/events.json";
import home from "../data/home.json";

export default function HomeSection() {
  /* ------------------------------------------
   * HERO / SLIDESHOW CONTENT (with safe fallbacks)
   * ------------------------------------------ */
  const heroTitle = home?.hero?.title ?? "Welcome to CampusConnect";
  const heroSubtitle = home?.hero?.subtitle ?? "Your Gateway to Campus Events & Activities";
  const ctaLabel = home?.hero?.cta?.label ?? "Explore Events";
  const ctaTarget = home?.hero?.cta?.target ?? "#events";
  const secondaryCta = home?.hero?.secondaryCta ?? { label: "Learn More", target: "#about" };

  // If slider exists and has images → use it; else fall back to hero.image or a placeholder
  const slides =
    Array.isArray(home?.slider) && home.slider.length > 0
      ? home.slider
      : [home?.hero?.image ?? "https://picsum.photos/1600/900?blur=2"];

  // Current slide index
  const [slide, setSlide] = useState(0);

  // Auto-advance slides every 5s (only when there is more than one slide)
  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  // The image currently shown in the hero background
  const bgImage = slides[slide];

  /* ------------------------------------------
   * EVENT SELECTION (always show 3 cards)
   * - We classify events as "upcoming or ongoing" vs "past".
   * - We prefer the earliest upcoming/ongoing ones; if fewer than 3, we fill from recent past.
   * ------------------------------------------ */
  // Keep "now" as a timestamp and update it hourly (enough for picking upcoming vs past)
  const [nowTs, setNowTs] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNowTs(Date.now()), 60 * 60 * 1000); // every hour
    return () => clearInterval(t);
  }, []);

  // Helper: is this event upcoming or ongoing relative to nowTs?
  const isUpcomingOrOngoing = (ev) => {
    const start = new Date(ev.date).getTime();
    const end = ev.endDate ? new Date(ev.endDate).getTime() : start;
    return start >= nowTs || end >= nowTs;
  };

  // Sort upcoming/ongoing by soonest start
  const upcomingSorted = useMemo(
    () => [...events].filter(isUpcomingOrOngoing).sort((a, b) => new Date(a.date) - new Date(b.date)),
    [nowTs]
  );

  // Sort past by most recent first
  const pastSorted = useMemo(
    () => [...events].filter((e) => !isUpcomingOrOngoing(e)).sort((a, b) => new Date(b.date) - new Date(a.date)),
    [nowTs]
  );

  // Always take 3: prefer upcoming/ongoing, then fill with past
  const highlights = useMemo(
    () => [...upcomingSorted, ...pastSorted].slice(0, 3),
    [upcomingSorted, pastSorted]
  );

  // Display helper: 20 Jan 2025, etc.
  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });

  /* ------------------------------------------
   * PER-CARD DIGITAL COUNTDOWN (DD:HH:MM:SS)
   * - A separate 1-second ticker forces re-rendering of the countdown display.
   * - This does NOT re-run the event selection (that is hourly via nowTs).
   * ------------------------------------------ */
  const [, forceTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => forceTick((x) => x + 1), 1000); // re-render every second
    return () => clearInterval(t);
  }, []);

  // Calculate remaining time from "now" until the target ISO timestamp
  const calcRemaining = (toISO) => {
    const target = new Date(toISO).getTime();
    let ms = Math.max(0, target - Date.now());
    const sec = 1000,
      min = 60 * sec,
      hr = 60 * min,
      day = 24 * hr;
    const d = Math.floor(ms / day);
    ms -= d * day;
    const h = Math.floor(ms / hr);
    ms -= h * hr;
    const m = Math.floor(ms / min);
    ms -= m * min;
    const s = Math.floor(ms / sec);
    return { d, h, m, s };
  };

  // Format as DD:HH:MM:SS with zero-padding
  const fmtClock = (iso) => {
    const { d, h, m, s } = calcRemaining(iso);
    const dd = String(d).padStart(2, "0");
    const hh = String(h).padStart(2, "0");
    const mm = String(m).padStart(2, "0");
    const ss = String(s).padStart(2, "0");
    return `${dd}:${hh}:${mm}:${ss}`;
  };

  /* ------------------------------------------
   * RENDER
   * ------------------------------------------ */
  return (
    <div className="section container" aria-labelledby="home-title">
      {/* ===== HERO / SLIDESHOW ===== */}
      <div
        className="banner slideshow"
        style={{
          backgroundImage: `linear-gradient(to bottom right, rgba(39,70,144,.55), rgba(15,23,42,.55)), url("${bgImage}")`,
        }}
        role="img"
        aria-label={heroTitle}
      >
        <div className="hero-content">
          <h1>{heroTitle}</h1>
          {heroSubtitle && <p className="subtitle">{heroSubtitle}</p>}

          <div className="hero-actions">
            <a className="btn" href={ctaTarget}>{ctaLabel}</a>
            <a className="btn blue" href={secondaryCta.target}>{secondaryCta.label}</a>
          </div>
        </div>

        {/* Slide dots (shown only if more than one slide) */}
        {slides.length > 1 && (
          <div className="slide-dots" aria-label="Slide indicators">
            {slides.map((_, i) => (
              <button
                key={i}
                className={`dot ${i === slide ? "active" : ""}`}
                onClick={() => setSlide(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ===== UPCOMING EVENTS ===== */}
      <h2 id="home-title" className="section-title">UPCOMING EVENTS</h2>

      <div className="events-grid">
        {highlights.map((ev) => (
          <article className="event-card" key={ev.id}>
            {/* Thumb + mini countdown */}
            <div className="event-thumb-wrapper">
              <img
                className="event-thumb"
                src={ev.image || "/images/events/placeholder.jpg"}
                alt={ev.title}
                loading="lazy"
              />
              <span className="mini-count" aria-label="countdown">{fmtClock(ev.date)}</span>
            </div>

            {/* Basic details */}
            <h3>{ev.title}</h3>
            <p className="muted">{formatDate(ev.date)}</p>
            <p>{ev.description}</p>

            {/* Actions */}
            <div className="event-actions">
              <a className="btn" href={`#event-${ev.id}`}>
                Learn More
              </a>
              {/* Register button intentionally removed */}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
