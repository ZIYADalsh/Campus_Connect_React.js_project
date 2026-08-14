import { useEffect, useMemo, useState } from "react";
import "../styles/EventsSection.css";
import events from "../data/events.json";
import EventModal from "../components/EventModal";
import { getBookmarks, toggleBookmark, isBookmarked } from "../utils/sessionBookmarks";

const PAGE_SIZE = 3;

/**
 * EventsSection
 * ------------------------------------------------------------
 * Purpose
 * - Show a filterable, searchable list of events from events.json.
 * - Supports: text search, category filter, sort order (Upcoming/Past),
 *   NEW date filter (All / Upcoming / Past / Custom range), pagination,
 *   image thumbnails, modal via hash, and session bookmarks.
 *
 * Data (events.json)
 * [
 *   {
 *     "id": string,
 *     "title": string,
 *     "description": string,
 *     "date": ISOString,        // start datetime
 *     "endDate"?: ISOString,    // optional end datetime
 *     "venue"?: string,
 *     "department"?: string,
 *     "category"?: string,      // e.g. Technical/Cultural/Sports
 *     "image"?: string,         // public/relative URL
 *     "organizer"?: string
 *   }
 * ]
 *
 * Key behaviors
 * - Text search over title/description/venue/category.
 * - Category dropdown (values derived from data).
 * - Sort (ordering only):
 *     'upcoming' → earliest first; 'past' → newest past first.
 * - Date filter:
 *     'all'      → no time filter;
 *     'upcoming' → start>=now OR end>=now (ongoing included);
 *     'past'     → end<now (if no endDate, uses start);
 *     'range'    → event window [start..end] INTERSECTS selected [from..to].
 *       (from 00:00, to 23:59:59 for inclusiveness)
 * - Pagination: page size = 3; resets on any filter/search change.
 * - Modal deep-link: #event-<id> opens details (and closes on hash clear).
 * - Bookmarks: toggle per event using sessionBookmarks util.
 *
 * Accessibility
 * - Section labeled by <h2 id="events-title">.
 * - Controls have aria-labels; modal opens from keyboard.
 *
 * Customize
 * - Change PAGE_SIZE.
 * - Add more filters (department, organizer).
 * - Replace sessionBookmarks storage with localStorage if needed.
 */

export default function EventsSection() {
  // Text search, category, sort order
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("upcoming"); // ordering, not filter

  // NEW: date filter
  const [timeFilter, setTimeFilter] = useState("all"); // 'all' | 'upcoming' | 'past' | 'range'
  const [from, setFrom] = useState(""); // yyyy-mm-dd
  const [to, setTo] = useState("");     // yyyy-mm-dd

  // Modal
  const [selected, setSelected] = useState(null);

  // Bookmarks (Session)
  const [bookmarks, setBookmarks] = useState(getBookmarks());

  // Pagination
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const canLoadMore = visibleCount < (useMemo(() => events.length, []) ? 999999 : 0); // dummy, overwritten later

  const resetPaging = () => setVisibleCount(PAGE_SIZE);

  // Open/close modal via hash
  useEffect(() => {
    const openFromHash = () => {
      const h = window.location.hash;
      if (h && h.startsWith("#event-")) {
        const id = h.replace("#event-", "");
        const ev = events.find((e) => e.id === id);
        setSelected(ev || null);
      } else {
        setSelected(null);
      }
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  const openDetails = (ev) => {
    window.location.hash = `event-${ev.id}`;
  };

  // Helpers
  const now = Date.now();
  const isUpcomingOrOngoing = (e) => {
    const start = new Date(e.date).getTime();
    const end = e.endDate ? new Date(e.endDate).getTime() : start;
    return start >= now || end >= now;
  };
  const isPast = (e) => {
    const end = e.endDate ? new Date(e.endDate).getTime() : new Date(e.date).getTime();
    return end < now;
  };

  const rangeIntersects = (e, fromStr, toStr) => {
    const start = new Date(e.date).getTime();
    const end = e.endDate ? new Date(e.endDate).getTime() : start;

    const fromTs = fromStr ? new Date(fromStr).setHours(0, 0, 0, 0) : -Infinity;
    const toTs = toStr ? new Date(toStr).setHours(23, 59, 59, 999) : Infinity;

    // intersection (event window overlaps selected window)
    return start <= toTs && end >= fromTs;
  };

  // Categories dropdown values from data
  const categories = useMemo(() => {
    const set = new Set(events.map((e) => e.category).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, []);

  // Filtering + sorting
  const filtered = useMemo(() => {
    let list = [...events];

    // Text search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q) ||
          e.venue?.toLowerCase().includes(q) ||
          e.category?.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (category !== "all") {
      list = list.filter(
        (e) => (e.category || "").toLowerCase() === category.toLowerCase()
      );
    }

    // NEW: time filter
    if (timeFilter === "upcoming") {
      list = list.filter(isUpcomingOrOngoing);
    } else if (timeFilter === "past") {
      list = list.filter(isPast);
    } else if (timeFilter === "range") {
      list = list.filter((e) => rangeIntersects(e, from, to));
    }
    // else 'all' → no time filter

    // sort (ordering only)
    if (sort === "upcoming") {
      list.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sort === "past") {
      list.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return list;
  }, [search, category, sort, timeFilter, from, to]);

  // Recompute paging & derived lists
  const showList = filtered.slice(0, visibleCount);
  const canLoadMoreReal = visibleCount < filtered.length;

  const onLoadMore = () => {
    setVisibleCount((v) => Math.min(v + PAGE_SIZE, filtered.length));
  };

  const fmtDate = (iso) =>
    new Date(iso).toLocaleDateString(undefined, {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });

  // Bookmark toggle
  const onToggleBookmark = (id) => {
    const updated = toggleBookmark(id);
    setBookmarks(new Set(updated));
  };

  return (
    <section id="events" className="section container" aria-labelledby="events-title">
      <h2 id="events-title" className="section-title">Events</h2>

      {/* Filters */}
      <div className="filters-bar">
        <input
          className="search"
          placeholder="Search events..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); resetPaging(); }}
          aria-label="Search events"
        />

        {/* NEW: time filter */}
        <select
          className="select date-mode"
          value={timeFilter}
          onChange={(e) => {
            const v = e.target.value;
            setTimeFilter(v);
            if (v !== "range") { setFrom(""); setTo(""); }
            resetPaging();
          }}
          aria-label="Date filter"
          title="Date filter"
        >
          <option value="all">All dates</option>
          <option value="upcoming">Upcoming only</option>
          <option value="past">Past only</option>
          <option value="range">Custom range</option>
        </select>

        {/* Show date inputs only for custom range */}
        {timeFilter === "range" && (
          <div className="date-range" role="group" aria-label="Select date range">
            <input
              type="date"
              className="input date-input"
              value={from}
              max={to || undefined}
              onChange={(e) => { setFrom(e.target.value); resetPaging(); }}
              aria-label="From date"
              placeholder="From"
            />
            <input
              type="date"
              className="input date-input"
              value={to}
              min={from || undefined}
              onChange={(e) => { setTo(e.target.value); resetPaging(); }}
              aria-label="To date"
              placeholder="To"
            />
            {(from || to) && (
              <button
                type="button"
                className="btn outline clear-date"
                onClick={() => { setFrom(""); setTo(""); resetPaging(); }}
                aria-label="Clear date range"
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* Existing sort (order) */}
        <select
          className="select"
          value={sort}
          onChange={(e) => { setSort(e.target.value); resetPaging(); }}
          aria-label="Sort order"
        >
          <option value="upcoming">Upcoming First</option>
          <option value="past">Past First</option>
        </select>

        {/* Category */}
        <select
          className="select"
          value={category}
          onChange={(e) => { setCategory(e.target.value); resetPaging(); }}
          aria-label="Category filter"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "All Categories" : c}
            </option>
          ))}
        </select>
      </div>

      {/* Cards grid */}
      <div className="events-grid">
        {showList.map((ev) => {
          const saved = bookmarks.has(ev.id) || isBookmarked(ev.id);
          return (
            <article className="event-card" key={ev.id} id={`event-${ev.id}`}>
              {ev.image && (
                <div className="event-thumb-wrapper">
                  <img className="event-thumb" src={ev.image} alt={ev.title} loading="lazy" />
                  <button
                    className={`bm-btn ${saved ? "active" : ""}`}
                    aria-label={saved ? "Remove bookmark" : "Add bookmark"}
                    title={saved ? "Remove bookmark" : "Add bookmark"}
                    onClick={() => onToggleBookmark(ev.id)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M6 2h12a1 1 0 0 1 1 1v18l-7-4-7 4V3a1 1 0 0 1 1-1z" fill="currentColor" />
                    </svg>
                  </button>
                </div>
              )}

              <div className="event-body">
                <div className="event-cat">{(ev.category || "").toLowerCase()}</div>
                <h3 className="event-title">{ev.title}</h3>

                <div className="event-meta">
                  <span>📅 {fmtDate(ev.date)}</span>
                  {ev.endDate && (
                    <span>
                      🕒{" "}
                      {new Date(ev.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}{" "}
                      -{" "}
                      {new Date(ev.endDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  )}
                  {ev.venue && <span>📍 {ev.venue}</span>}
                </div>

                {ev.description && <p className="event-desc">{ev.description}</p>}

                <div className="event-actions">
                  <button className="btn" onClick={() => openDetails(ev)}>
                    View Details
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Load more */}
      <div className="load-more">
        <button
          className="btn btn-load"
          onClick={onLoadMore}
          disabled={!canLoadMoreReal}
          aria-disabled={!canLoadMoreReal}
        >
          <span className="plus">+</span> Load More Events
        </button>
      </div>

      {/* Modal */}
      <EventModal event={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
