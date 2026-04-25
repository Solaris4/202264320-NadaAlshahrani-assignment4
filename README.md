# Nada Alshahrani – Personal Portfolio Website (Assignment 4)

A modern, responsive personal portfolio website with advanced features, API integration, state management, and a Tech Reads sidebar — built as part of the Web Engineering & Development course at King Fahad University of Petroleum and Minerals.

This is the final version, building on Assignments 1–3 with an innovative new feature and a fully polished, production-ready presentation.

---

## 🌟 Project Overview

This portfolio showcases my skills, projects, and experience as a Software Engineering student. Assignment 4 is the final, polished version featuring:

- All features from Assignments 1–3
- A new **Tech Reads Sidebar** (Assignment 4 innovation)
- Live deployment on GitHub Pages
- Professional video presentation

---

## ✨ New Feature in Assignment 4

### 📰 Tech Reads Sidebar
A permanently visible sidebar on the left side of the page displaying curated articles from 5 tech writers the portfolio owner follows:

- **Gary Marcus** – AI Skepticism & Research
- **Tate Jarrow** – Tech & Culture
- **Doks** – Tech Writing
- **Montajat Newsletter** – Saudi Tech Careers
- **The Pragmatic Engineer** – Software Engineering Deep Dives

**How it works:**
- Sidebar is always visible on the left — no click needed
- All 5 writers and their articles are shown together in one scrollable panel
- Each article links directly to the writer's Substack page
- Automatically hidden on mobile screens (< 900px) to preserve usability

**Technical note:** Articles are curated and hardcoded. Live RSS fetching via three different proxy approaches (rss2json, allorigins, direct fetch) was investigated but proved unreliable due to CORS restrictions on Substack feeds from statically-hosted sites. The hardcoded approach ensures the feature always works reliably. See `docs/ai-usage-report.md` for the full investigation.

---

## ✨ Features from Assignments 1–3

### 🔹 GitHub API Integration
- Fetches live public repositories from the GitHub REST API
- Search by name/description/language, sort by updated/stars/name
- Error handling with specific messages (404, 403, network) and Retry button

### 🔹 Complex Logic – Filter + Sort
- Projects: filter by category AND sort by name/date in sequence
- GitHub repos: debounced search AND sort combined

### 🔹 State Management
- Visitor name saved to `localStorage` with personalised welcome banner
- Dark/light theme persisted across sessions via `localStorage`
- Session timer displayed in the navbar (resets on refresh — session-scoped)

### 🔹 Performance
- Debounced input events (300ms) on repo search
- `IntersectionObserver` with `unobserve` for fade-in animations
- CSS hardware-accelerated animations (transform + opacity only)

### 🔹 Enhanced Contact Form
- Inline per-field validation with specific error messages
- Character counter with colour warning near limit
- Subject dropdown, `novalidate` with full JS validation control

---

## 🛠️ Technologies Used

| Technology | Use |
|------------|-----|
| HTML5 | Semantic structure, ARIA attributes |
| CSS3 | Variables, Grid, Flexbox, animations, responsive design |
| JavaScript (ES6+) | Async/await, DOM APIs, localStorage, IntersectionObserver |
| GitHub REST API v3 | Live repository data |

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

### Option 2: Local server (recommended — avoids CORS on some browsers)
```bash
# Python 3
python -m http.server 8000
# Then visit: http://localhost:8000

# Node.js
npx serve .
```

### 🌐 Live Deployment
The site is deployed on GitHub Pages:
**https://solaris4.github.io/202264320-NadaAlshahrani-assignment4/**

### 🎬 Video Presentation
**https://youtu.be/kP3pJYcPrMI**

### Note on APIs
- **GitHub section:** fetches from `https://api.github.com` — no key needed, rate limit is 60 req/hour per IP
- **Tech Reads sidebar:** hardcoded articles with links to each writer's Substack — no API needed

---

## 🤖 AI Usage Summary

Claude AI was used in Assignment 4 to:
- Design and build the Tech Reads sidebar (HTML, CSS, JS)
- Investigate RSS proxy approaches and diagnose CORS failures
- Recommend the hardcoded fallback as a reliable alternative for static hosting
- Guide the GitHub Pages deployment process
- Reorganise the project into the required subfolder structure
- Update all documentation to reflect Assignment 4 changes

All AI-generated suggestions were reviewed, tested, and modified to fit the project. See `docs/ai-usage-report.md` for full details.

---

## 📊 Assignment Requirements Coverage

| Requirement | Implementation |
|---|---|
| Complete Application | Full portfolio with all sections, responsive, deployed on GitHub Pages |
| Professional Quality | Clean code, error handling, cross-browser compatible |
| Innovation | Tech Reads sidebar with 5 curated writers, always visible |
| Presentation | 5–7 min video in `/presentation/` |
| AI Integration | Claude AI – documented in `docs/ai-usage-report.md` |
| Code Quality | Sectioned comments, descriptive names, no unused code |
| Documentation | README, technical-documentation.md, ai-usage-report.md |

---

## 📱 Responsive Design

- Sidebar hidden on screens < 900px; body padding removed automatically
- Main content breakpoints at 968px, 768px, 480px
- GitHub grid uses `auto-fill` + `minmax` — reflows from 3 → 2 → 1 column naturally

---

## 👩‍💻 Author

**Nada Alshahrani**  
Software Engineering Student, KFUPM

---

✨ *Built with code, curiosity, and continuous learning.*
