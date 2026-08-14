/**
 * CalendarSection.jsx
 * -------------------------------------------------
 * Purpose
 * - Show a month-by-month calendar view of events from events.json.
 * - Groups events by "Month Year" label and lists cards for each month.
 * - Each card shows: title, date, department, and category.
 * - "Details" button deep-links to the event in EventsSection via URL hash.
 *
 * Data (events.json)
 * - Assumes each event has: id, title, date, department, category (and maybe endDate, image...).
 *
 * Behavior
 * - Groups by new Date(ev.date) → toLocaleString({ month:'long', year:'numeric' }).
 * - Sorts events within each month by ascending start date.
 * - Clicking "Details" smooth-scrolls to #events and triggers the modal in EventsSection.
 *
 * Accessibility
 * - Section labeled by <h2 id="calendar-title">.
 * - Month headings are <h3>.
 */

import "../styles/EventsSection.css"; // reusing the same card/grid styles
import events from "../data/events.json";

export default function CalendarSection() {
  // Group events by localized "Month Year" label
  const byMonth = events.reduce((acc, ev) => {
    const label = new Date(ev.date).toLocaleString(undefined, {
      month: "long",
      year: "numeric",
    });
    (acc[label] ||= []).push(ev);
    return acc;
  }, {});

  return (
    <div className="section container" aria-labelledby="calendar-title">
      <h2 id="calendar-title" className="section-title">Event Calendar</h2>

      {Object.entries(byMonth).map(([month, list]) => (
        <div key={month} style={{ marginBottom: 14 }}>
          <h3 style={{ margin: "6px 0 10px" }}>{month}</h3>

          <div className="events-grid">
            {list
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map((ev) => (
                <article className="event-card" key={ev.id}>
                  <h3>{ev.title}</h3>

                  <p className="muted">
                    {new Date(ev.date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    })}
                  </p>

                  <p className="muted">
                    {(ev.department || "Dept")}{ev.category ? " · " : ""}{ev.category || ""}
                  </p>

                  {/* Deep-link to Events section + open the matching modal via hash */}
                  <a
                    className="btn"
                    href={`#event-${ev.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .querySelector("#events")
                        ?.scrollIntoView({ behavior: "smooth" });
                      window.location.hash = `event-${ev.id}`;
                      // fire hashchange so EventsSection modal logic reacts immediately
                      window.dispatchEvent(new HashChangeEvent("hashchange"));
                    }}
                  >
                    Details
                  </a>
                </article>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
