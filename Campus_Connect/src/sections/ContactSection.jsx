import "../styles/ContactSection.css";
import contacts from "../data/contacts.json";

function isFaculty(c) {
  const t = (c.type || "").toLowerCase();
  const r = (c.role || "").toLowerCase();
  return t === "faculty" || /faculty|prof|lectur|دكتور|عضو هيئة/i.test(r);
}
function isStudent(c) {
  const t = (c.type || "").toLowerCase();
  const r = (c.role || "").toLowerCase();
  return t === "student" || /student|coordinator|منسق|طلاب/i.test(r);
}

export default function ContactSection() {
  const faculty = contacts.filter(isFaculty);
  const students = contacts.filter(isStudent);
  const others = contacts.filter(c => !isFaculty(c) && !isStudent(c));

  const Card = ({ c }) => (
    <div className="contact-card" role="listitem">
      <h3 className="c-name">{c.name}</h3>
      <p className="c-meta">{c.role} — {c.department}</p>
      {c.phone && (
        <p className="c-line">
          <span>📞</span>
          <a className="c-link" href={`tel:${c.phone}`}>{c.phone}</a>
        </p>
      )}
      {c.email && (
        <p className="c-line">
          <span>✉️</span>
          <a className="c-link" href={`mailto:${c.email}`}>{c.email}</a>
        </p>
      )}
    </div>
  );

  return (
    <section id="ContactSection" className="section container" aria-labelledby="contact-title">
      <h2 id="contact-title" className="section-title">Contact</h2>

      {faculty.length > 0 && (
        <>
          <h3 className="group-title">Faculty Coordinators</h3>
          <div className="contacts" role="list">
            {faculty.map((c, i) => <Card key={`f-${i}`} c={c} />)}
          </div>
        </>
      )}

      {students.length > 0 && (
        <>
          <h3 className="group-title">Student Coordinators</h3>
          <div className="contacts" role="list">
            {students.map((c, i) => <Card key={`s-${i}`} c={c} />)}
          </div>
        </>
      )}

      {others.length > 0 && (
        <>
          <h3 className="group-title">Others</h3>
          <div className="contacts" role="list">
            {others.map((c, i) => <Card key={`o-${i}`} c={c} />)}
          </div>
        </>
      )}

      {/* خريطة الكلية (Responsive 16:9) */}
      <div className="map-embed" aria-label="College Location">
        <iframe
          title="College Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d240.4565993717272!2d44.16991895121018!3d15.359927566104858!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1603dd2a9de43825%3A0x5c18f8e38a8b8579!2sAl-Nasser%20University%20Facculty%20of%20Engineering%20and%20Computer%20science!5e0!3m2!1sar!2s!4v1757460394000!5m2!1sar!2s"
          loading="lazy"
          allowFullScreen
        />
      </div>
    </section>
  );
}
