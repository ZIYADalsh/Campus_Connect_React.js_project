export default function EventModal({ event, onClose }) {
  if (!event) return null;

  const close = () => {
    onClose?.();
    history.replaceState(null, "", " ");
  };

  // انتقال ناعم لقسم معيّن وتمرير id الحدث في الهاش كـ query
  const goToHash = (hash) => {
    close();
    setTimeout(() => {
      window.location.hash = hash;
      window.dispatchEvent(new HashChangeEvent("hashchange"));
      const id = hash.split("?")[0].replace("#", "");
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  const onRegister = () => goToHash(`registration?event=${event.id}`);
  const onParticipants = () => goToHash(`participants?event=${event.id}`);
  const onSeeMorePhotos = () => goToHash(`gallery?event=${event.id}`);

  return (
    <div className="modal-backdrop" onClick={close}>
      <div className="modal-card enhanced" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={close} aria-label="Close">×</button>

        {event.image && (
          <div className="modal-cover">
            <img src={event.image} alt={event.title} />
            <div className="modal-tag">{event.category}</div>
          </div>
        )}

        <div className="modal-body">
          <h3 className="modal-title">{event.title}</h3>

          <div className="modal-meta">
            <span>📅 {new Date(event.date).toLocaleDateString()}</span>
            {event.endDate && (
              <span>
                · 🕒 {new Date(event.date).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}
                {" – "}
                {new Date(event.endDate).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}
              </span>
            )}
            {event.venue && <span>· 📍 {event.venue}</span>}
            {event.department && <span>· 🏫 {event.department}</span>}
            {event.category && <span>· 🏷️ {event.category}</span>}
          </div>

          {event.description && <p className="modal-desc">{event.description}</p>}

          {/* سطر الانتقال للصور */}
          <p className="modal-linkline">
            If you want to see more photos,&nbsp;
            <button className="link-btn" onClick={onSeeMorePhotos}>
              click here →
            </button>
          </p>

          {/* أزرار الإجراءات */}
          <div className="modal-actions">
            <button className="btn primary" onClick={onRegister}>Register Now</button>
             <a
                className="btn"
                href={"#ContactSection"}
               
              >
               organizer
              </a>
          </div>
        </div>
      </div>
    </div>
  );
}
