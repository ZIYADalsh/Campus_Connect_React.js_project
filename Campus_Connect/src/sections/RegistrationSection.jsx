import { useEffect, useMemo, useState } from "react";
import "../styles/RegistrationSection.css";
import events from "../data/events.json";
import { notify } from "../utils/notify";

/**
 * RegistrationSection
 * - Simple client-side form (no backend).
 * - Populates Event dropdown from events.json (upcoming first, fallback to recent).
 * - Optional filter by Department (derived from events.json).
 * - Validates required fields and shows inline errors.
 * - On success: shows top notification (Notify component must be mounted in App).
 */

export default function RegistrationSection() {
  // ======== Form state ========
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); // optional
  const [department, setDepartment] = useState("all");
  const [eventId, setEventId] = useState("");
  const [notes, setNotes] = useState("");
  const [agree, setAgree] = useState(false);

  const [errors, setErrors] = useState({});

  // ======== Data helpers ========
  const now = Date.now();
  const isUpcomingOrOngoing = (e) => {
    const start = new Date(e.date).getTime();
    const end = e.endDate ? new Date(e.endDate).getTime() : start;
    return start >= now || end >= now;
  };

  const upcoming = useMemo(
    () => [...events].filter(isUpcomingOrOngoing).sort((a, b) => new Date(a.date) - new Date(b.date)),
    []
  );

  const recent = useMemo(
    () => [...events].filter((e) => !isUpcomingOrOngoing(e)).sort((a, b) => new Date(b.date) - new Date(a.date)),
    []
  );

  // departments from data
  const departments = useMemo(() => {
    const set = new Set(events.map((e) => e.department).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, []);

  // event options (prefer upcoming; fallback to recent)
  const allOptions = useMemo(() => (upcoming.length ? upcoming : recent), [upcoming, recent]);

  // filter by selected department
  const filteredOptions = useMemo(() => {
    if (department === "all") return allOptions;
    return allOptions.filter((e) => (e.department || "").toLowerCase() === department.toLowerCase());
  }, [department, allOptions]);

  // if selected event no longer in filtered list → clear it
  useEffect(() => {
    if (eventId && !filteredOptions.some((e) => e.id === eventId)) {
      setEventId("");
    }
  }, [filteredOptions, eventId]);

  // preselect event from hash like #register-evt-xyz
  useEffect(() => {
    const h = window.location.hash;
    if (h && h.startsWith("#register-")) {
      const id = h.replace("#register-", "");
      const exists = events.find((e) => e.id === id);
      if (exists) setEventId(exists.id);
    }
  }, []);

  const fmtDate = (iso) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });

  // ======== Validation ========
  const emailOk = (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());

  const validate = () => {
    const errs = {};
    if (fullName.trim().length < 2) errs.fullName = "Please enter your full name (min 2 characters).";
    if (!emailOk(email)) errs.email = "Please enter a valid email address.";
    if (!eventId) errs.eventId = "Please select an event.";
    if (!agree) errs.agree = "You must agree to the terms.";
    return errs;
    // department is optional (defaults to "all")
    // phone is optional
  };

  // ======== Submit ========
  const onSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      // focus first invalid field
      const firstKey = Object.keys(errs)[0];
      const el = document.querySelector(`[name="${firstKey}"]`);
      el?.focus();
      return;
    }

    // Simulate success (no backend)
    notify("Registration completed successfully!", "success", 4000);

    // Reset form
    setFullName("");
    setEmail("");
    setPhone("");
    setDepartment("all");
    setEventId("");
    setNotes("");
    setAgree(false);

    // Optional: scroll to top so the toast is immediately visible
    // window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="section container registration" aria-labelledby="reg-title">
      <h2 id="reg-title" className="section-title">Registration</h2>
      <p className="muted" style={{ marginTop: -6, marginBottom: 16 }}>
        Fill the form below to register for an event. Fields marked with <span aria-hidden="true">*</span> are required.
      </p>

      <form className="form reg-form" onSubmit={onSubmit} noValidate>
        {/* Row: name + email */}
        <div className="row-2">
          <div className={`field ${errors.fullName ? "invalid" : ""}`}>
            <label htmlFor="fullName">Full Name <span aria-hidden="true">*</span></label>
            <input
              id="fullName"
              name="fullName"
              className="input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              aria-invalid={!!errors.fullName}
              placeholder="e.g., Ahmed Ali"
            />
            {errors.fullName && <div className="error">{errors.fullName}</div>}
          </div>

          <div className={`field ${errors.email ? "invalid" : ""}`}>
            <label htmlFor="email">Email <span aria-hidden="true">*</span></label>
            <input
              id="email"
              name="email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!errors.email}
              placeholder="you@college.edu"
              autoComplete="email"
            />
            {errors.email && <div className="error">{errors.email}</div>}
          </div>
        </div>

        {/* Row: phone (optional) */}
        <div className="row-2">
          <div className="field">
            <label htmlFor="phone">Phone (optional)</label>
            <input
              id="phone"
              name="phone"
              className="input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+966 5x xxx xxxx"
              autoComplete="tel"
            />
          </div>

          <div className="field">
            <label htmlFor="department">Department</label>
            <select
              id="department"
              name="department"
              className="select"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d === "all" ? "All Departments" : d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Event select */}
        <div className={`field ${errors.eventId ? "invalid" : ""}`}>
          <label htmlFor="eventId">Event <span aria-hidden="true">*</span></label>
          <select
            id="eventId"
            name="eventId"
            className="select"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            aria-invalid={!!errors.eventId}
          >
            <option value="">Select an Event</option>
            {filteredOptions.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title} — {fmtDate(e.date)}
              </option>
            ))}
          </select>
          {errors.eventId && <div className="error">{errors.eventId}</div>}
        </div>

        {/* Notes */}
        <div className="field">
          <label htmlFor="notes">Notes (optional)</label>
          <textarea
            id="notes"
            name="notes"
            className="textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any special requests or questions?"
          />
        </div>

        {/* Agree */}
        <div className={`field-check ${errors.agree ? "invalid" : ""}`}>
          <label className="check">
            <input
              type="checkbox"
              name="agree"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              aria-invalid={!!errors.agree}
            />
            <span>I confirm the information provided is correct and I agree to be contacted via email.</span>
          </label>
          {errors.agree && <div className="error">{errors.agree}</div>}
        </div>

        {/* Submit */}
        <div className="actions">
          <button type="submit" className="btn">Submit Registration</button>
          <a
            className="btn outline"
            href="#events"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#events")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            View Events
          </a>
        </div>
      </form>
    </div>
  );
}
