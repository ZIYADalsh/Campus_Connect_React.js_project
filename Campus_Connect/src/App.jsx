import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CalendarSection from "./sections/CalendarSection";
import RegistrationSection from "./sections/RegistrationSection";
import HomeSection from "./sections/HomeSection";
import AboutSection from "./sections/AboutSection";
import EventsSection from "./sections/EventsSection";
import GallerySection from "./sections/GallerySection";
import FeedbackSection from "./sections/FeedbackSection";
import ContactSection from "./sections/ContactSection";
import Notify from "./components/Notify"; 

import "./styles/responsive.css";

export default function App() {
  return (
    <>
      <Navbar />
        <Notify />  
      <main>
        <section id="home"><HomeSection /></section>
        <section id="about"><AboutSection /></section>
        <section id="events"><EventsSection /></section>
        <section id="gallery"><GallerySection /></section>
        <section id="feedback"><FeedbackSection /></section>
        <section id="contact"><ContactSection /></section>
        <section id="calendar"><CalendarSection /></section>
<section id="registration"><RegistrationSection /></section>

      </main>
      <Footer />
       
    </>
  );
}
