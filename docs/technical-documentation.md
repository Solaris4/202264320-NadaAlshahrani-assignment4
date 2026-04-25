# Technical Documentation – Assignment 4

## Nada Alshahrani – Personal Portfolio Website

**Version:** 4.0  
**Last Updated:** April 2025  
**Assignment:** 4  
**Developer:** Nada Alshahrani

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Architecture & Data Flow](#3-architecture--data-flow)
4. [File Structure](#4-file-structure)
5. [Feature Documentation](#5-feature-documentation)
   - 5.1 GitHub API Integration
   - 5.2 Complex Logic – Filter + Sort
   - 5.3 State Management
   - 5.4 Enhanced Form Validation
   - 5.5 Performance Optimisations
   - 5.6 Tech Reads Sidebar *(New – Assignment 4)*
6. [Responsive Design](#6-responsive-design)
7. [Browser Compatibility](#7-browser-compatibility)
8. [Accessibility](#8-accessibility)
9. [Known Limitations & Future Work](#9-known-limitations--future-work)

---

## 1. Project Overview

### Purpose
A professional portfolio website for Nada Alshahrani, Software Engineering student, demonstrating progressively advanced web development skills across four assignments. Assignment 4 is the final, polished version — it introduces a persistent Tech Reads sidebar showcasing curated articles from followed tech writers, deploys the site publicly on GitHub Pages, and delivers a complete video presentation.

### What Is New in Version 4
| Area | Assignment 3 | Assignment 4 |
|------|------|------|
| Innovation Feature | None | Tech Reads Sidebar (5 curated writers) |
| Layout | Single-column main content | Sidebar + main content side-by-side |
| Deployment | Local only | Live on GitHub Pages |
| Presentation | Not required | 5–7 min video presentation |
| File Structure | Flat root folder | Organised subfolders (css/, js/, docs/, assets/, presentation/) |
| Documentation | Assignment 3 docs | Updated for Assignment 4 throughout |

---

## 2. Technology Stack

### Frontend
- **HTML5** – Semantic structure, ARIA attributes, `novalidate` on form (JS handles validation)
- **CSS3** – CSS custom properties, Grid, Flexbox, `clamp()`, `@keyframes`, media queries
- **JavaScript ES2020** – `async/await`, optional chaining (`?.`), `nullish coalescing` (`??`), `IntersectionObserver`, `localStorage`

### External Services
- **GitHub REST API v3** – `https://api.github.com/users/{username}/repos`
  - No authentication required for public repositories
  - Rate limit: 60 requests/hour per IP (unauthenticated)
- **Google Fonts CDN** – Playfair Display, Work Sans

---

## 3. Architecture & Data Flow

### Component Tree
```
Portfolio Website (Assignment 4)
├── Tech Reads Sidebar          ← NEW – Assignment 4 Innovation Feature
│   ├── Sidebar Header
│   └── Writer Sections (x5)
│       ├── Writer Info Row
│       └── Article Cards (x2–3 per writer)
├── Navigation
│   ├── Nav Links
│   ├── Session Timer           ← State (setInterval counter)
│   └── Theme Toggle            ← State (localStorage theme)
├── Visitor Banner              ← State Management (localStorage name)
├── Hero
│   └── Visitor Name Input      ← State (read/write localStorage)
├── About
│   └── Skills Grid
├── GitHub Section              ← API Integration
│   ├── Search Input            ← Complex Logic (debounced filter)
│   ├── Sort Dropdown           ← Complex Logic (sort allRepos[])
│   ├── Loading Spinner
│   ├── Error + Retry
│   └── Repo Cards (dynamic)
├── Projects Section
│   ├── Filter Buttons          ← Complex Logic (category filter)
│   ├── Sort Dropdown           ← Complex Logic (multi-criteria sort)
│   └── Project Cards (static data)
├── Experience (Timeline)
├── Contact
│   ├── Contact Info
│   └── Enhanced Form           ← Complex Logic (multi-step validation)
└── Footer
```

### Tech Reads Sidebar Data Flow
```
Page Load
    │
    ▼
renderTechReads()
    │
    ▼
Iterate TECH_READS array (5 writers, hardcoded)
    │
    ▼
Build HTML: writer-info banner + article cards per writer
    │
    ▼
sidebarContent.innerHTML = html
    │
    ▼
Sidebar visible immediately — no fetch, no spinner, no CORS issues
```

### GitHub API Data Flow
```
fetchGitHubRepos()
       │
       ▼
  Show loading spinner
       │
       ▼
  fetch() GitHub API
       │
   ┌───┴────────────┐
 Error             200 OK
   │                 │
   ▼                 ▼
 Show error       allRepos = data
 + Retry btn          │
                      ▼
               renderRepos(allRepos)
                      │
          ┌───────────┴──────────────┐
     User searches              User sorts
          │                          │
          ▼                          ▼
   filterAndSortRepos()    filterAndSortRepos()
   (Step 1: filter)        (Step 1: filter)
   (Step 2: sort)          (Step 2: sort)
          │                          │
          └───────────┬──────────────┘
                      ▼
               renderRepos(filtered)
```

### State Management Flow
```
Page Load
    │
    ├─ localStorage.getItem('theme')
    │       └─ Apply .dark-theme if 'dark'
    │
    └─ localStorage.getItem('visitorName')
            ├─ Found → show welcome banner
            └─ Not found → show name input box
                    │
              User types name + clicks Hello!
                    │
              localStorage.setItem('visitorName', name)
                    │
              Show welcome banner
```

---

## 4. File Structure

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

## 5. Feature Documentation

---

### 5.1 GitHub API Integration

#### Endpoint
```
GET https://api.github.com/users/{username}/repos?per_page=30&sort=updated
```

#### Implementation
```javascript
async function fetchGitHubRepos() {
    githubLoading.style.display = 'flex';
    githubError.style.display   = 'none';
    githubGrid.style.display    = 'none';

    try {
        const response = await fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=30&sort=updated`,
            { headers: { 'Accept': 'application/vnd.github.v3+json' } }
        );

        if (!response.ok) {
            if (response.status === 404) throw new Error('GitHub user not found.');
            if (response.status === 403) throw new Error('API rate limit reached.');
            throw new Error(`GitHub API error (${response.status}).`);
        }

        allRepos = await response.json();
        githubLoading.style.display = 'none';
        githubGrid.style.display    = 'grid';
        renderRepos(allRepos);

    } catch (err) {
        githubLoading.style.display = 'none';
        githubError.style.display   = 'flex';
        githubErrMsg.textContent    = err.message;
    }
}
```

#### Error Handling
| HTTP Status | Displayed Message |
|---|---|
| 404 | "GitHub user not found. Please check the username in script.js." |
| 403 | "GitHub API rate limit reached. Try again in a few minutes." |
| Other | "GitHub API error (NNN). Please try again." |
| Network failure | "Could not load repositories. Please check your connection." |

#### Repo Card Fields Used
| API Field | Displayed As |
|---|---|
| `repo.name` | Clickable repo name → GitHub link |
| `repo.html_url` | href on repo name link |
| `repo.description` | Description paragraph |
| `repo.language` | Language tag with coloured dot |
| `repo.stargazers_count` | ⭐ count |
| `repo.forks_count` | 🍴 count |
| `repo.updated_at` | "Updated {date}" formatted string |
| `repo.fork` | "Fork" badge if true |
| `repo.archived` | "Archived" badge if true |

---

### 5.2 Complex Logic – Filter + Sort

#### Projects Grid
```javascript
function applyProjectFilterSort() {
    let visible = projectData.filter(p =>
        activeFilter === 'all' || p.category === activeFilter
    );

    const sortVal = projectSort?.value || 'default';
    if (sortVal === 'name-asc')  visible.sort((a, b) => a.name.localeCompare(b.name));
    if (sortVal === 'name-desc') visible.sort((a, b) => b.name.localeCompare(a.name));
    if (sortVal === 'date-new')  visible.sort((a, b) => b.date.localeCompare(a.date));
    if (sortVal === 'date-old')  visible.sort((a, b) => a.date.localeCompare(b.date));

    const visibleSet = new Set(visible.map(p => p.el));
    projectData.forEach(p => { p.el.style.display = visibleSet.has(p.el) ? '' : 'none'; });
    visible.forEach(p => projectsGrid.appendChild(p.el));

    emptyMessage.style.display = visible.length === 0 ? 'block' : 'none';
}
```

#### GitHub Repos
```javascript
function filterAndSortRepos() {
    const query  = repoSearch.value.toLowerCase().trim();
    const sortBy = repoSort.value;

    let filtered = allRepos.filter(repo => {
        const nameMatch = repo.name.toLowerCase().includes(query);
        const descMatch = (repo.description || '').toLowerCase().includes(query);
        const langMatch = (repo.language || '').toLowerCase().includes(query);
        return nameMatch || descMatch || langMatch;
    });

    filtered.sort((a, b) => {
        if (sortBy === 'stars') return b.stargazers_count - a.stargazers_count;
        if (sortBy === 'name')  return a.name.localeCompare(b.name);
        return new Date(b.updated_at) - new Date(a.updated_at);
    });

    renderRepos(filtered);
}
```

---

### 5.3 State Management

#### Visitor Name (localStorage – Persistent)
```javascript
localStorage.setItem('visitorName', name);
const savedName = localStorage.getItem('visitorName');
if (savedName) showVisitorBanner(savedName);
```

#### Theme Preference (localStorage – Persistent)
```javascript
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') body.classList.add('dark-theme');
```

#### Session Timer (setInterval – Session-only)
```javascript
let sessionSeconds = 0;
setInterval(() => {
    sessionSeconds++;
    const mins = Math.floor(sessionSeconds / 60);
    const secs = sessionSeconds % 60;
    timerDisplay.textContent = `${mins}:${String(secs).padStart(2, '0')}`;
}, 1000);
```

---

### 5.4 Enhanced Contact Form Validation

| Field | Rule | Error Message |
|---|---|---|
| Name | Required, min 2 chars | "Please enter your full name (at least 2 characters)." |
| Email | Required, regex test | "Please enter a valid email address." |
| Subject | Required (not empty option) | "Please select a subject for your message." |
| Message | Required, min 20 chars | "Your message must be at least 20 characters long." |

---

### 5.5 Performance Optimisations

#### Debouncing
```javascript
const debouncedSearch = debounce(filterAndSortRepos, 300);
repoSearch.addEventListener('input', debouncedSearch);
```

#### IntersectionObserver with `unobserve`
```javascript
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity   = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });
```

---

### 5.6 Tech Reads Sidebar *(New – Assignment 4)*

#### Overview
A permanently visible sidebar fixed to the left edge of the page. It displays curated articles from 5 tech writers that the portfolio owner follows. All content is hardcoded — this decision was made deliberately after investigating RSS/API approaches that proved unreliable due to CORS restrictions on Substack feeds.

#### Writers Featured
| Writer | Topic | URL |
|---|---|---|
| Gary Marcus | AI Skepticism | garymarcus.substack.com |
| Tate Jarrow | Tech & Culture | tatejarrow.substack.com |
| Doks | Tech Writing | doks.substack.com |
| Montajat Newsletter | Saudi Tech Careers | montajatnewsletter.substack.com |
| Pragmatic Engineer | Software Engineering | newsletter.pragmaticengineer.com |

#### Why Hardcoded Instead of Live RSS
During development, three RSS proxy approaches were attempted:

1. **rss2json.com** – blocked requests from GitHub Pages (CORS)
2. **allorigins.win** – successfully proxied the request, but Substack feeds returned 403 (feed restricted by Substack)
3. **Direct fetch** – blocked by browser CORS policy on both `file://` and `https://` origins

The decision to hardcode articles ensures the feature is always functional and never shows error states. Article links still point to the real Substack pages so visitors can read the full content.

#### Implementation
```javascript
const TECH_READS = [
    {
        writer:   'Gary Marcus',
        topic:    'AI Skepticism',
        url:      'https://garymarcus.substack.com',
        color:    '#73A5C6',
        articles: [ { title, excerpt, date, link }, ... ]
    },
    // ... 4 more writers
];

function renderTechReads() {
    const sidebarContent = document.getElementById('sidebarContent');
    let html = '';
    TECH_READS.forEach(writer => {
        const initials = writer.writer.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
        html += `<div class="writer-section">
            <div class="writer-info">...</div>
            <article class="article-card">...</article>
        </div>`;
    });
    sidebarContent.innerHTML = html;
}

renderTechReads(); // Called immediately on page load — no async needed
```

#### Layout
- **Width:** 260px fixed on the left
- **`body { padding-left: 260px }`** pushes all main content to the right
- **Hidden on screens < 900px** via `@media` query to preserve mobile usability

---

## 6. Responsive Design

| Breakpoint | Changes Applied |
|---|---|
| `< 968px` | About/Contact switch to single column |
| `< 900px` | Tech Reads sidebar hidden; body padding-left removed |
| `< 768px` | Font size reduced to 14px; nav wraps; timer hidden; API controls stack |
| `< 480px` | Hero buttons full-width; visitor input stacks; single-column GitHub grid |

---

## 7. Browser Compatibility

| Feature | Chrome 90+ | Firefox 88+ | Safari 14+ | Edge 90+ |
|---|---|---|---|---|
| `async/await` | ✅ | ✅ | ✅ | ✅ |
| `fetch()` API | ✅ | ✅ | ✅ | ✅ |
| CSS Grid | ✅ | ✅ | ✅ | ✅ |
| CSS Variables | ✅ | ✅ | ✅ | ✅ |
| `IntersectionObserver` | ✅ | ✅ | ✅ | ✅ |
| `localStorage` | ✅ | ✅ | ✅ | ✅ |
| Optional chaining (`?.`) | ✅ | ✅ | ✅ | ✅ |
| CSS `-webkit-line-clamp` | ✅ | ✅ | ✅ | ✅ |

---

## 8. Accessibility

| Feature | Implementation |
|---|---|
| Navigation landmark | `role="navigation"` + `aria-label` on `<nav>` |
| Sidebar landmark | `role="complementary"` + `aria-label` on `<aside>` |
| Screen-reader announcements | `aria-live="polite"` on loading/error regions and form status |
| Form error alerts | `role="alert"` on per-field error spans |
| Theme toggle | `aria-label="Toggle dark/light theme"` |
| Session timer | `aria-label="Time spent on page"` |
| Decorative SVGs | `aria-hidden="true"` |
| Section numbers | `aria-hidden="true"` (purely decorative) |
| Keyboard navigation | All interactive elements reachable via Tab in logical order |
| Article links | `target="_blank"` with `rel="noopener noreferrer"` for security |

---

## 9. Known Limitations & Future Work

### Known Limitations
- **GitHub API rate limit:** Unauthenticated requests are limited to 60/hour per IP. Exceeding this displays a 403 error with a Retry button.
- **No real form submission:** The contact form simulates a send. A backend service (e.g., EmailJS, Formspree) would be needed for production.
- **Tech Reads articles hardcoded:** Due to CORS restrictions on Substack RSS feeds, articles are curated manually. They accurately represent each writer's topics but are not live-fetched.
- **SVG project placeholders:** No real screenshots yet; placeholder SVGs are used.

### Challenges Resolved
- **CORS on RSS feeds:** Investigated three proxy solutions; settled on hardcoded data as the most reliable approach for a statically-hosted site.
- **Repo name URL issue:** Initial GitHub repository name contained the URL string; renamed via GitHub Settings before deployment.
- **File path errors:** Moved files from flat root to organised subfolders (`css/`, `js/`); updated `<link>` and `<script>` src paths accordingly.

### Challenges Unresolved
- Live RSS feed fetching for the Tech Reads sidebar (requires a backend proxy or server-side API key)
- Real email sending via contact form

### Planned for Future Work
- Add GitHub OAuth token (server-side) to raise API rate limit to 5,000/hour
- Integrate a backend proxy to enable live Substack RSS fetching
- Integrate EmailJS for real form submission
- Add `loading="lazy"` to real project images when screenshots are added
- Add a Service Worker for offline support
- Implement Arabic (RTL) language toggle

---

**Document Version:** 4.0  
**Last Updated:** April 2025  
**Next Review:** June 2025  
**Developer:** Nada Alshahrani
