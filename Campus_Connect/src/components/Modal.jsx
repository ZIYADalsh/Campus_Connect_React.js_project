import { useEffect, useRef } from "react";
import "../styles/Modal.css";

export default function Modal({ open, onClose, title, children }) {
  const dialogRef = useRef(null);

  // إغلاق بـ Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // تركيز أوّل عنصر قابل للتركيز عند الفتح
  useEffect(() => {
    if (open && dialogRef.current) {
      const focusable = dialogRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusable?.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="presentation" onClick={(e) => {
      if (e.target.classList.contains("modal-backdrop")) onClose?.();
    }}>
      <div
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        ref={dialogRef}
      >
        <div className="modal-header">
          <h3 id="modal-title">{title}</h3>
          <button className="modal-close" aria-label="Close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        <div className="modal-footer">
          <button className="btn outline" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
