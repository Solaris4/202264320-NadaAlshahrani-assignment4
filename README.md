# Nada Alshahrani – Personal Portfolio Website (Assignment 4)

A modern, responsive personal portfolio website with advanced features, API integration, state management, and a Substack reading sidebar — built as part of the Web Engineering & Development course at King Fahad University of Petroleum and Minerals.

This is the final version, building on Assignments 1–3 with an innovative new feature and a fully polished, production-ready presentation.

---

## 🌟 Project Overview

This portfolio showcases my skills, projects, and experience as a Software Engineering student. Assignment 4 is the final, polished version featuring:

- All features from Assignments 1–3
- A new **Substack Tech Reading Sidebar** (Assignment 4 innovation)
- Live deployment
- Professional video presentation

---

## ✨ New Feature in Assignment 4

### 📰 Substack Tech Reading Sidebar
A fixed sidebar on the left edge of the page that surfaces the latest articles from 5 curated tech writers:

- **Gary Marcus** – AI Skepticism & Research
- **Tate Jarrow** – Tech & Culture
- **Doks** – Tech Writing
- **Montajat Newsletter** – Saudi Tech Careers
- **The Pragmatic Engineer** – Software Engineering Deep Dives

**How it works:**
- Click the "📰 Tech Reads" tab on the left edge to open the panel
- Switch between writers using the tab bar at the top
- Articles are fetched live from each writer's RSS feed via rss2json
- Lazy-loaded (only fetches when first opened) and cached (no re-fetching on tab switch)
- Graceful error handling with Retry button if a feed is unavailable
- Closes via ✕ button, overlay click, or Escape key

---

## ✨ Features from Assignments 1–3

### 🔹 GitHub API Integration
- Fetches live public repositories from the GitHub REST API
- Search, sort, error handling with Retry button

### 🔹 Complex Logic – Filter + Sort
- Projects: filter by category AND sort by name/date
- GitHub repos: search by name/description/language AND sort

### 🔹 State Management
- Visitor name saved to `localStorage` with welcome banner
- Dark/light theme persisted across sessions
- Session timer displayed in the navbar

### 🔹 Performance
- Debounced input/scroll events
- `IntersectionObserver` with `unobserve` for fade-in animations
- CSS hardware-accelerated animations

### 🔹 Enhanced Contact Form
- Inline per-field validation, character counter, subject dropdown

---

## 🛠️ Technologies Used

| Technology | Use |
|------------|-----|
| HTML5 | Semantic structure, ARIA attributes |
| CSS3 | Variables, Grid, Flexbox, animations, responsive design |
| JavaScript (ES6+) | Async/await, DOM APIs, localStorage |
| GitHub REST API v3 | Live repository data |
| rss2json API | RSS-to-JSON conversion for Substack feeds |

---

## 📁 Project Structure

```
id-name-assignment4/
├── README.md
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── assets/
│   └── images/
├── docs/
│   ├── ai-usage-report.md
│   └── technical-documentation.md
├── presentation/
│   ├── slides.pdf
│   └── demo-video.mp4
└── .gitignore
```

---

## 🚀 How to Run the Project

### Option 1: Open directly
1. Download or clone the repository
2. Open `index.html` in your browser (Chrome or Firefox recommended)

### Option 2: Local server (recommended)
```bash
# Python 3
python -m http.server 8000
# Then visit: http://localhost:8000

# Node.js
npx serve .
```

### Note on APIs
- **GitHub section:** fetches from `https://api.github.com` — no key needed, rate limit is 60 req/hour
- **Substack sidebar:** fetches from `https://api.rss2json.com` — free tier, no key needed

---

## 🤖 AI Usage Summary

Claude AI was used in Assignment 4 to:
- Design and build the Substack RSS sidebar feature (HTML, CSS, JS)
- Suggest the rss2json proxy approach to solve CORS issues with RSS feeds
- Help structure the lazy-loading and caching pattern for article fetching
- Review and update documentation

All AI-generated suggestions were reviewed, tested, and modified to fit the project. See `docs/ai-usage-report.md` for full details.

---

## 📊 Assignment Requirements Coverage

| Requirement | Implementation |
|---|---|
| Complete Application | Full portfolio with all sections, responsive, deployed |
| Professional Quality | Clean code, error handling, cross-browser compatible |
| Innovation | Substack RSS reading sidebar with 5 curated tech writers |
| Presentation | 5–7 min video in `/presentation/` |
| AI Integration | Claude AI – documented in docs/ai-usage-report.md |
| Code Quality | Sectioned comments, descriptive names, no unused code |
| Documentation | README, technical-documentation.md, ai-usage-report.md |

---

## 📱 Responsive Design

- Mobile-first with breakpoints at 968px, 768px, 480px
- Sidebar adapts: 340px on desktop, 300px on tablet, full-width on mobile

---

## 👩‍💻 Author

**Nada Alshahrani**
Software Engineering Student, KFUPM

---

✨ *Built with code, curiosity, and continuous learning.*
