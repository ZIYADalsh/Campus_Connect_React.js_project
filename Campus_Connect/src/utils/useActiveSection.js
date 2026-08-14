 import { useEffect, useState } from "react";

export default function useActiveSection(ids, { rootMargin = "-68px 0px -50% 0px", threshold = 0.2 } = {}) {
  const [activeId, setActiveId] = useState(ids?.[0] || null);

  useEffect(() => {
    const sections = ids
      .map(id => document.getElementById(id))
      .filter(Boolean);
    if (!sections.length) return;

    const observer = new IntersectionObserver((entries) => {
      // نختار أكبر نسبة ظهور
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) setActiveId(visible.target.id);
    }, { root: null, rootMargin, threshold });

    sections.forEach(sec => observer.observe(sec));
    return () => observer.disconnect();
  }, [ids, rootMargin, threshold]);

  return activeId;
}
