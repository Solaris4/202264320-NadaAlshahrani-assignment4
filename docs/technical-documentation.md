# Technical Documentation – Assignment 3

## Nada Alshahrani – Personal Portfolio Website

**Version:** 3.0  
**Last Updated:** April 2025  
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
6. [Responsive Design](#6-responsive-design)
7. [Browser Compatibility](#7-browser-compatibility)
8. [Accessibility](#8-accessibility)
9. [Known Limitations & Future Work](#9-known-limitations--future-work)

---

## 1. Project Overview

### Purpose
A professional portfolio website for Nada Alshahrani, Software Engineering student, demonstrating progressively advanced web development skills across three assignments. Assignment 3 introduces external API integration, persistent state management, and complex multi-step application logic.

### What Is New in Version 3
| Area | Assignment 2 | Assignment 3 |
|------|------|------|
| API | None | GitHub REST API v3 |
| State | Theme only (localStorage) | Theme + Visitor name + Session timer |
| Project logic | Filter only | Filter + multi-criteria Sort |
| Form validation | Single error banner | Inline per-field errors + char counter + subject dropdown |
| Performance | Debounce, IntersectionObserver | + `unobserve` after first trigger |

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
Portfolio Website (Assignment 3)
├── Visitor Banner          ← State Management (localStorage name)
├── Navigation
│   ├── Nav Links
│   ├── Session Timer       ← State (setInterval counter)
│   └── Theme Toggle        ← State (localStorage theme)
├── Hero
│   └── Visitor Name Input  ← State (read/write localStorage)
├── About
│   └── Skills Grid
├── GitHub Section          ← API Integration
│   ├── Search Input        ← Complex Logic (debounced filter)
│   ├── Sort Dropdown       ← Complex Logic (sort allRepos[])
│   ├── Loading Spinner
│   ├── Error + Retry
│   └── Repo Cards (dynamic)
├── Projects Section
│   ├── Filter Buttons      ← Complex Logic (category filter)
│   ├── Sort Dropdown       ← Complex Logic (multi-criteria sort)
│   └── Project Cards (static data)
├── Experience (Timeline)
├── Contact
│   ├── Contact Info
│   └── Enhanced Form       ← Complex Logic (multi-step validation)
└── Footer
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
id-name-assignment3/
├── README.md                       # Project overview & setup guide
├── index.html                      # Main HTML (semantic, accessible)
├── styles.css                      # All styles (moonstone blue theme)
├── script.js                       # All JavaScript behaviour
├── assets/
│   └── images/                     # Future: real project screenshots
├── docs/
│   ├── ai-usage-report.md          # AI tool usage documentation
│   └── technical-documentation.md  # This file
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

A **Retry** button calls `fetchGitHubRepos()` again, giving the user agency without a page refresh.

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

This feature demonstrates multi-step conditional logic: the user can independently apply a **category filter** and a **sort order**, and both are combined before rendering.

#### Projects Grid
```javascript
function applyProjectFilterSort() {
    // Step 1: Filter by active category button
    let visible = projectData.filter(p =>
        activeFilter === 'all' || p.category === activeFilter
    );

    // Step 2: Sort the filtered subset by the dropdown value
    const sortVal = projectSort?.value || 'default';
    if (sortVal === 'name-asc')  visible.sort((a, b) => a.name.localeCompare(b.name));
    if (sortVal === 'name-desc') visible.sort((a, b) => b.name.localeCompare(a.name));
    if (sortVal === 'date-new')  visible.sort((a, b) => b.date.localeCompare(a.date));
    if (sortVal === 'date-old')  visible.sort((a, b) => a.date.localeCompare(b.date));

    // Step 3: Re-order DOM elements and show/hide
    const visibleSet = new Set(visible.map(p => p.el));
    projectData.forEach(p => { p.el.style.display = visibleSet.has(p.el) ? '' : 'none'; });
    visible.forEach(p => projectsGrid.appendChild(p.el)); // Re-order in sorted sequence

    emptyMessage.style.display = visible.length === 0 ? 'block' : 'none';
}
```

**Why this is "complex logic":** The function combines two independent user choices (a filter and a sort criterion) in a defined sequence — filter first, then sort — and produces a result that neither choice alone would determine. The implementation also avoids rebuilding DOM nodes, instead relying on the browser's behaviour that `appendChild` on an existing node moves it rather than duplicates it.

#### GitHub Repos
```javascript
function filterAndSortRepos() {
    const query  = repoSearch.value.toLowerCase().trim();
    const sortBy = repoSort.value;

    // Step 1: Filter by search query (name OR description OR language)
    let filtered = allRepos.filter(repo => {
        const nameMatch = repo.name.toLowerCase().includes(query);
        const descMatch = (repo.description || '').toLowerCase().includes(query);
        const langMatch = (repo.language || '').toLowerCase().includes(query);
        return nameMatch || descMatch || langMatch;
    });

    // Step 2: Sort
    filtered.sort((a, b) => {
        if (sortBy === 'stars') return b.stargazers_count - a.stargazers_count;
        if (sortBy === 'name')  return a.name.localeCompare(b.name);
        return new Date(b.updated_at) - new Date(a.updated_at); // default: updated
    });

    renderRepos(filtered);
}
```

---

### 5.3 State Management

#### Visitor Name (localStorage – Persistent)
```javascript
// On submit:
localStorage.setItem('visitorName', name);
showVisitorBanner(name);   // Hides input box, shows banner

// On page load:
const savedName = localStorage.getItem('visitorName');
if (savedName) {
    showVisitorBanner(savedName); // Restores state immediately
}
```
Persists across browser sessions. The visitor sees their personalised banner every time they return.

#### Theme Preference (localStorage – Persistent)
```javascript
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') body.classList.add('dark-theme');

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    localStorage.setItem('theme', body.classList.contains('dark-theme') ? 'dark' : 'light');
});
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
Counts up from 0:00 every second. Displayed in the navbar. Resets on page refresh — intentionally session-scoped.

---

### 5.4 Enhanced Contact Form Validation

The form uses JavaScript-only validation (`novalidate` on the `<form>` element suppresses browser defaults). This gives full control over when and how errors appear.

#### Validation Rules
| Field | Rule | Error Message |
|---|---|---|
| Name | Required, min 2 chars | "Please enter your full name (at least 2 characters)." |
| Email | Required, regex test | "Please enter a valid email address (e.g. you@example.com)." |
| Subject | Required (not empty option) | "Please select a subject for your message." |
| Message | Required, min 20 chars | "Your message must be at least 20 characters long." |

#### Inline Error Display
```javascript
function showFieldError(fieldId, msg) {
    document.getElementById(`${fieldId}Error`).textContent = msg;
    document.getElementById(fieldId).classList.add('field-invalid');
}
```
Errors appear directly beneath the offending field. The `field-invalid` class applies a red border. All errors are cleared (`clearErrors()`) before each validation run so stale messages do not persist.

#### Character Counter
```javascript
messageInput.addEventListener('input', () => {
    const len = messageInput.value.length;
    charCount.textContent = `${len} / 1000`;
    charCount.style.color = len >= 900 ? '#dc3545' : '';
});
```
Turns red when the user is within 100 characters of the limit.

---

### 5.5 Performance Optimisations

#### Debouncing
```javascript
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

const debouncedSearch = debounce(filterAndSortRepos, 300);
repoSearch.addEventListener('input', debouncedSearch);
```
The repo-search function fires at most once every 300 ms regardless of how fast the user types.

#### IntersectionObserver with `unobserve`
```javascript
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity   = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target); // ← Stop watching after first animation
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });
```
Calling `unobserve` removes the element from the observation set after it has animated once, reducing the number of elements the browser needs to monitor during scroll.

#### CSS-Hardware Acceleration
All animations use `transform` and `opacity` — properties handled by the GPU compositor. Properties that trigger layout (e.g., `top`, `left`, `height`) are avoided in animations.

---

## 6. Responsive Design

| Breakpoint | Changes Applied |
|---|---|
| `< 968px` | About/Contact switch to single column; sort wrap loses auto margin |
| `< 768px` | Font size reduced to 14px; nav wraps; timer hidden; API controls stack |
| `< 480px` | Hero buttons full-width; visitor input stacks; single-column GitHub grid |

The GitHub grid uses `repeat(auto-fill, minmax(280px, 1fr))` to naturally reflow from 3 columns → 2 → 1 without breakpoint-specific overrides.

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

---

## 8. Accessibility

| Feature | Implementation |
|---|---|
| Navigation landmark | `role="navigation"` + `aria-label` on `<nav>` |
| Screen-reader announcements | `aria-live="polite"` on GitHub loading/error regions and form status |
| Form error alerts | `role="alert"` on per-field error spans |
| Theme toggle | `aria-label="Toggle dark/light theme"` |
| Session timer | `aria-label="Time spent on page"` |
| Decorative SVGs | `aria-hidden="true"` |
| Section numbers | `aria-hidden="true"` (purely decorative) |
| Form `required` | Replaced with explicit JS validation + visual indicators |
| Focus indicators | Preserved from browser defaults; not overridden with `outline:none` except when replaced with a visible box-shadow |
| Keyboard navigation | All interactive elements reachable via Tab in logical order |

---

## 9. Known Limitations & Future Work

### Known Limitations
- **GitHub API rate limit:** Unauthenticated requests are limited to 60/hour per IP. Exceeding this displays a 403 error message with a retry button.
- **No real form submission:** The contact form simulates a send with a 0.9 s timeout. No email is actually sent. A backend (e.g., EmailJS, Formspree) would be needed for production.
- **SVG project placeholders:** No real screenshots exist yet; placeholder SVGs are used.

### Future Work
- Add GitHub OAuth token (stored server-side) to raise API rate limit to 5,000/hour
- Integrate EmailJS for real form submission
- Add `loading="lazy"` to real project images when screenshots are added
- Add a Service Worker for offline support
- Implement Arabic (RTL) language toggle

---

**Document Version:** 3.0  
**Last Updated:** April 2025  
**Next Review:** June 2025  
**Developer:** Nada Alshahrani
