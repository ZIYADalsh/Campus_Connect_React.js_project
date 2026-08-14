import { useEffect, useRef, useState } from "react";
import "../styles/Notify.css";

export default function Notify() {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [type, setType] = useState("success"); // success | info | error
  const timer = useRef(null);

  useEffect(() => {
    const onNotify = (e) => {
      const { message, kind = "success", duration = 4000 } = e.detail || {};
      setMsg(message || "");
      setType(kind);
      setOpen(true);

      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setOpen(false), duration);
      // اختياري: تمرير التركيز لإتاحة القراءة بقارئ الشاشة
      setTimeout(() => {
        document.querySelector(".notify")?.focus();
      }, 30);
    };

    const onEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("cc:notify", onNotify);
    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("cc:notify", onNotify);
      window.removeEventListener("keydown", onEsc);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return (
    <div
      className={`notify ${open ? "show" : ""} ${type}`}
      role="status"
      aria-live="polite"
      tabIndex={-1}
    >
      <div className="notify-inner">
        <span className="notify-ic" aria-hidden="true">
          {type === "success" ? "✅" : type === "error" ? "⚠️" : "ℹ️"}
        </span>
        <span className="notify-msg">{msg}</span>
        <button className="notify-close" aria-label="Close" onClick={() => setOpen(false)}>
          ×
        </button>
      </div>
    </div>
  );
}
