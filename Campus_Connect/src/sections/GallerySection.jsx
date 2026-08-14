/**
 * GallerySection.jsx
 * ------------------
 * Purpose:
 *   Displays a filterable media gallery for CampusConnect.
 *   Users can filter images by Year and Category, or deep-link to a specific
 *   event’s media via the URL hash:  #gallery?event=<eventId>
 *
 * Data source:
 *   - /data/gallery.json
 *     Each item is expected to have (at least):
 *       {
 *         id: string | number,
 *         src: string,           // image path (prefer assets under /public/images/..)
 *         alt?: string,          // accessible alt text (fallback to category)
 *         year: number,          // e.g., 2025
 *         category: string,      // e.g., "Technical" | "Cultural" | "Sports"
 *         eventId?: string       // to link images to a specific event
 *       }
 *
 * Key features:
 *   • Derives available Years and Categories dynamically from the dataset.
 *   • Allows filtering by Year and Category (client-side).
 *   • Supports deep-link filtering by event: #gallery?event=<id>
 *     - When event filter is active, dropdowns are disabled to avoid conflicts.
 *   • Responsive grid layout (styled in /styles/GallerySection.css).
 *
 * Accessibility:
 *   • Uses <figure>/<figcaption> semantics for images.
 *   • Adds aria-labelledby to bind section title to content region.
 *
 * Notes:
 *   - No behavioral changes were made; only documentation/comments were added.
 *   - Keep the section id as "gallery" to preserve in-page navigation.
 */

import { useEffect, useMemo, useState } from "react";
import "../styles/GallerySection.css";
import gallery from "../data/gallery.json";

export default function GallerySection() {
  /**
   * Build the "Year" filter list from data:
   *  - Use a Set to deduplicate
   *  - Sort descending (latest first)
   *  - Prefix with "All"
   */
  const years = useMemo(() => {
    const ys = Array.from(new Set(gallery.map(g => g.year))).sort((a,b)=>b-a);
    return ["All", ...ys];
  }, []);

  /**
   * Build the "Category" filter list from data:
   *  - Use a Set to deduplicate
   *  - Alphabetical sort
   *  - Prefix with "All"
   */
  const categories = useMemo(() => {
    const cs = Array.from(new Set(gallery.map(g => g.category))).sort();
    return ["All", ...cs];
  }, []);

  // Controlled filter states
  const [year, setYear] = useState("All");
  const [category, setCategory] = useState("All");

  /**
   * Deep link event filter (optional):
   *   If URL hash matches "#gallery?event=<id>", only items whose eventId
   *   equals <id> will be shown. While eventFilter is active, dropdowns are disabled.
   */
  const [eventFilter, setEventFilter] = useState(null);

  // Parse hash on mount and when hash changes:
  useEffect(() => {
    const parseHash = () => {
      const h = window.location.hash || "";
      if (h.startsWith("#gallery")) {
        const q = h.split("?")[1] || "";
        const params = new URLSearchParams(q);
        const ev = params.get("event");
        setEventFilter(ev || null);
      } else {
        setEventFilter(null);
      }
    };
    parseHash();
    window.addEventListener("hashchange", parseHash);
    return () => window.removeEventListener("hashchange", parseHash);
  }, []);

  /**
   * Compute the filtered list:
   *  - If eventFilter exists, return only items matching eventId
   *  - Otherwise filter by selected Year and Category
   */
  const filtered = useMemo(() => {
    let list = gallery;
    if (eventFilter) {
      return list.filter(g => g.eventId === eventFilter);
    }
    return list.filter(g => {
      const okYear = year === "All" || String(g.year) === String(year);
      const okCat  = category === "All" || g.category === category;
      return okYear && okCat;
    });
  }, [year, category, eventFilter]);

  return (
    <section id="gallery" className="section container" aria-labelledby="gallery-title">
      <h2 id="gallery-title" className="section-title">Gallery</h2>

      {/* Filters bar (disabled when event deep-link is active) */}
      <div className="filters-bar gallery-filters">
        <div className="f-label">Filter by Year:</div>
        <select className="select" value={year} onChange={(e)=>setYear(e.target.value)} disabled={!!eventFilter}>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>

        <div className="f-label">Filter by Category:</div>
        <select className="select" value={category} onChange={(e)=>setCategory(e.target.value)} disabled={!!eventFilter}>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Context note when filtered by eventId via hash */}
      {eventFilter && (
        <p className="muted" style={{marginTop:-8, marginBottom:12}}>
          Showing photos for event <strong>{eventFilter}</strong>. Change filters to browse all.
        </p>
      )}

      {/* Content: empty state vs. grid */}
      {filtered.length === 0 ? (
        <p className="muted">No images match your filters.</p>
      ) : (
        <div className="g-grid">
          {filtered.map(item => (
            <figure className="g-item" key={item.id}>
              {/* Image (lazy-loaded) with accessible alt text (fallback to category) */}
              <img src={item.src} alt={item.alt || item.category} loading="lazy" decoding="async" />
              <figcaption className="g-cap">
                <span className="g-cat">{item.category}</span>
                <span className="g-year">{item.year}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
