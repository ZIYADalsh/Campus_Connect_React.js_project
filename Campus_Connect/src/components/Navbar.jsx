import "../styles/Navbar.css";
import useActiveSection from "../utils/useActiveSection";
import { useEffect, useState } from "react";
import logo from "../assets/campus-logo.png";





export default function Navbar() {
  const links = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About Us" },
    { href: "#events", label: "Event Details" },
     { href: "#gallery", label: "Gallery" },
    { href: "#registration", label: "Registration" },
     { href: "#feedback", label: "feedback" },
   { href: "#calendar", label: "Event Calendar" },
    { href: "#contact", label: "Contact Us" }
  ];

  const ids = links.map(l => l.href.slice(1));
  const activeId = useActiveSection(ids);

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const closeOnHash = () => setMenuOpen(false);
    window.addEventListener("hashchange", closeOnHash);
    return () => window.removeEventListener("hashchange", closeOnHash);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (!menuOpen) return;
      const nav = document.querySelector(".nav");
      if (nav && !nav.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuOpen]);

  return (
    <nav className="nav" role="navigation" aria-label="Main">
      <div className="nav-inner">
      
        <a className="nav-logo-wrap" href="#home" aria-label="CampusConnect Home">
          <img className="nav-logo" src={logo} alt="CampusConnect logo" />
        </a>

      
        <ul id="primary-menu" className={`nav-links ${menuOpen ? "open" : ""}`}>
          {links.map(l => (
            <li key={l.href}>
              <a
                className={activeId === l.href.slice(1) ? "active" : ""}
                href={l.href}
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

     
        <a href="#home" className="nav-brand-text" aria-label="CampusConnect">
          CampusConnect
        </a>

      
        <button
          className={`hamburger ${menuOpen ? "is-active" : ""}`}
          aria-label="Toggle navigation"
          aria-controls="primary-menu"
          aria-expanded={menuOpen ? "true" : "false"}
          onClick={() => setMenuOpen(v => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}
