CampusConnect – College Event Management Website

Project Overview:
CampusConnect is a responsive Single Page Application (SPA) created to manage and display college events in an organized and user-friendly way.
It provides students, faculty, and event organizers with a centralized hub to:
- View upcoming, current, and past events.
- Search, filter, and sort events by date, name, or category.
- Explore detailed event information with schedules, organizers, and Google Maps.
- Browse galleries categorized by year and type.
- Submit feedback through a UI-only form.
- Bookmark events and gallery items using LocalStorage.

Technologies Used:
- HTML5 → Semantic and accessible structure
- CSS3 → Responsive layouts with Flexbox, Grid, and variables
- ReactJS → Component-based SPA architecture
- JSON → Local storage of event, gallery, and contact data
- Google Maps Embed → Location visualization

Installation & Setup:
Requirements:
- Node.js (v16+)
- npm (v8+)
- Modern browser (Chrome, Firefox, Edge)

Steps:
1. Clone the repository:
   git clone https://github.com/your-username/CampusConnect.git
   cd CampusConnect

2. Install dependencies:
   npm install

3. Run the development server:
   npm run dev

4. Open in browser:
   http://localhost:5173/

5. For production build:
   npm run build
   npm run preview

Test Cases Summary:
- Search displays correct events
- Filters show events by category
- Sorting works by date/name/category
- Bookmark adds events to Favorites
- Feedback form validates inputs
- Gallery opens in lightbox with navigation

Deliverables:
- Source code (HTML5, CSS3, ReactJS)
- JSON files (events.json, gallery.json, contacts.json)
- Final Report (Word/PDF)
- Demo Video (MP4)
- ZIP package (assets, code, data, documentation)

Assumptions & Limitations:
- Frontend-only, no backend
- Feedback form is UI-only (no submission)
- Data from static JSON files
- Bookmarks stored locally in browser

References:
- ReactJS Documentation: https://reactjs.org/
- W3C HTML5 & CSS3 Standards: https://www.w3.org/
- WCAG 2.1 Accessibility Guidelines: https://www.w3.org/WAI/standards-guidelines/wcag/
- Google Fonts: https://fonts.google.com/
- Material Icons: https://fonts.google.com/icons
	