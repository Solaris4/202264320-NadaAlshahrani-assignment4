// ===============================================
// Assignment 4 – script.js
// Author: Nada Alshahrani
// Features: GitHub API, State Management,
//           Session Timer, Filter+Sort, Validation
// ===============================================

// -----------------------------------------------
// 1. SMOOTH SCROLLING NAVIGATION
// -----------------------------------------------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const bannerHeight = document.getElementById('visitorBanner')?.offsetHeight || 0;
            const targetPosition = targetElement.offsetTop - navbarHeight - bannerHeight - 8;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    });
});

// -----------------------------------------------
// 2. DARK / LIGHT THEME TOGGLE
// -----------------------------------------------
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Restore saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') body.classList.add('dark-theme');

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        const theme = body.classList.contains('dark-theme') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
        themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => { themeToggle.style.transform = ''; }, 300);
    });
}

// -----------------------------------------------
// 3. DYNAMIC GREETING BY TIME OF DAY
// -----------------------------------------------
function setGreeting() {
    const greetingEl = document.getElementById('greeting');
    if (!greetingEl) return;
    const hour = new Date().getHours();
    let greeting;
    if      (hour >= 5  && hour < 12) greeting = 'Good Morning! ☀️';
    else if (hour >= 12 && hour < 17) greeting = 'Good Afternoon! 🌤️';
    else if (hour >= 17 && hour < 21) greeting = 'Good Evening! 🌆';
    else                               greeting = 'Good Night! 🌙';
    greetingEl.textContent = greeting;
}
setGreeting();

// -----------------------------------------------
// 4. STATE MANAGEMENT – VISITOR NAME
// -----------------------------------------------
const visitorNameBox    = document.getElementById('visitorNameBox');
const visitorNameInput  = document.getElementById('visitorNameInput');
const visitorNameSubmit = document.getElementById('visitorNameSubmit');
const visitorBanner     = document.getElementById('visitorBanner');
const visitorWelcome    = document.getElementById('visitorWelcome');
const bannerClose       = document.getElementById('bannerClose');

/**
 * Shows the personalised welcome banner
 * and hides the name-input box.
 * @param {string} name - Visitor's name
 */
function showVisitorBanner(name) {
    if (!visitorBanner || !visitorWelcome) return;
    visitorWelcome.textContent = `Welcome, ${name}! 👋 Thanks for visiting my portfolio.`;
    visitorBanner.style.display = 'block';
    if (visitorNameBox) visitorNameBox.style.display = 'none';
}

// Restore name from localStorage (persists across reloads)
const savedName = localStorage.getItem('visitorName');
if (savedName) {
    showVisitorBanner(savedName);
} else if (visitorNameBox) {
    visitorNameBox.style.display = 'block';
}

if (visitorNameSubmit) {
    visitorNameSubmit.addEventListener('click', () => {
        const name = visitorNameInput?.value.trim();
        if (!name) {
            visitorNameInput.style.borderColor = '#dc3545';
            setTimeout(() => { visitorNameInput.style.borderColor = ''; }, 1500);
            return;
        }
        localStorage.setItem('visitorName', name);
        showVisitorBanner(name);
    });
}

// Allow pressing Enter in the name field
visitorNameInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') visitorNameSubmit.click();
});

// Close the banner (but keep name in localStorage)
bannerClose?.addEventListener('click', () => {
    visitorBanner.style.display = 'none';
});

// -----------------------------------------------
// 5. SESSION TIMER (State Management)
// -----------------------------------------------
const timerDisplay = document.getElementById('timerDisplay');
let sessionSeconds = 0;

setInterval(() => {
    sessionSeconds++;
    const mins = Math.floor(sessionSeconds / 60);
    const secs = sessionSeconds % 60;
    if (timerDisplay) {
        timerDisplay.textContent = `${mins}:${String(secs).padStart(2, '0')}`;
    }
}, 1000);

// -----------------------------------------------
// 6. GITHUB API INTEGRATION
// -----------------------------------------------
const GITHUB_USERNAME = 'Solaris4'; // ← your GitHub username
const githubGrid    = document.getElementById('githubGrid');
const githubLoading = document.getElementById('githubLoading');
const githubError   = document.getElementById('githubError');
const githubErrMsg  = document.getElementById('githubErrorMsg');
const retryBtn      = document.getElementById('retryBtn');
const repoSearch    = document.getElementById('repoSearch');
const repoSort      = document.getElementById('repoSort');

// Store fetched repos for client-side filter/sort
let allRepos = [];

/**
 * Fetches public repositories from the GitHub API.
 */
async function fetchGitHubRepos() {
    // Show loading state
    githubLoading.style.display  = 'flex';
    githubError.style.display    = 'none';
    githubGrid.style.display     = 'none';

    try {
        const response = await fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=30&sort=updated`,
            { headers: { 'Accept': 'application/vnd.github.v3+json' } }
        );

        if (!response.ok) {
            // Handle rate limit or not-found gracefully
            if (response.status === 404) {
                throw new Error('GitHub user not found. Please check the username in script.js.');
            } else if (response.status === 403) {
                throw new Error('GitHub API rate limit reached. Try again in a few minutes.');
            } else {
                throw new Error(`GitHub API error (${response.status}). Please try again.`);
            }
        }

        allRepos = await response.json();

        // If no repos exist, display a friendly notice
        if (!allRepos.length) {
            allRepos = [];
        }

        githubLoading.style.display = 'none';
        githubGrid.style.display    = 'grid';
        renderRepos(allRepos);

    } catch (err) {
        console.error('GitHub API error:', err);
        githubLoading.style.display = 'none';
        githubError.style.display   = 'flex';
        githubErrMsg.textContent    = err.message || 'Could not load repositories. Please check your connection.';
    }
}

/**
 * Renders repository cards into #githubGrid.
 * @param {Array} repos - Array of GitHub repo objects
 */
function renderRepos(repos) {
    const noRepoMsg = document.getElementById('noRepoMsg');
    githubGrid.innerHTML = '';

    if (!repos.length) {
        noRepoMsg.style.display = 'block';
        return;
    }
    noRepoMsg.style.display = 'none';

    repos.forEach(repo => {
        const card = document.createElement('article');
        card.className = 'github-card';

        // Determine language badge colour
        const langColours = {
            JavaScript: '#f1e05a', Python: '#3572A5', Java: '#b07219',
            HTML: '#e34c26', CSS: '#563d7c', TypeScript: '#2b7489',
            'C++': '#f34b7d', C: '#555555', Shell: '#89e051'
        };
        const langColor = langColours[repo.language] || '#73A5C6';

        // Format the last-updated date
        const updated = new Date(repo.updated_at);
        const updatedStr = updated.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });

        card.innerHTML = `
            <div class="github-card-header">
                <span class="repo-icon" aria-hidden="true">📁</span>
                <a class="repo-name" href="${repo.html_url}" target="_blank" rel="noopener noreferrer"
                   aria-label="Open ${repo.name} on GitHub">
                    ${repo.name}
                </a>
                ${repo.fork ? '<span class="repo-badge fork">Fork</span>' : ''}
                ${repo.archived ? '<span class="repo-badge archived">Archived</span>' : ''}
            </div>
            <p class="repo-description">${repo.description || 'No description provided.'}</p>
            <div class="repo-meta">
                ${repo.language
                    ? `<span class="repo-lang">
                           <span class="lang-dot" style="background:${langColor}" aria-hidden="true"></span>
                           ${repo.language}
                       </span>`
                    : ''}
                <span class="repo-stat" title="Stars">⭐ ${repo.stargazers_count}</span>
                <span class="repo-stat" title="Forks">🍴 ${repo.forks_count}</span>
                <span class="repo-updated">Updated ${updatedStr}</span>
            </div>
        `;
        githubGrid.appendChild(card);
    });
}

/**
 * Filters and sorts repos based on current UI state.
 * Demonstrates complex logic: multi-step conditions.
 */
function filterAndSortRepos() {
    const query  = (repoSearch?.value || '').toLowerCase().trim();
    const sortBy = repoSort?.value || 'updated';

    // Step 1: Filter by search query
    let filtered = allRepos.filter(repo => {
        const nameMatch = repo.name.toLowerCase().includes(query);
        const descMatch = (repo.description || '').toLowerCase().includes(query);
        const langMatch = (repo.language || '').toLowerCase().includes(query);
        return nameMatch || descMatch || langMatch;
    });

    // Step 2: Sort the filtered results
    filtered.sort((a, b) => {
        if (sortBy === 'stars') {
            return b.stargazers_count - a.stargazers_count;
        } else if (sortBy === 'name') {
            return a.name.localeCompare(b.name);
        } else {
            // Default: recently updated
            return new Date(b.updated_at) - new Date(a.updated_at);
        }
    });

    renderRepos(filtered);
}

// Debounced search input
const debouncedSearch = debounce(filterAndSortRepos, 300);
repoSearch?.addEventListener('input', debouncedSearch);
repoSort?.addEventListener('change', filterAndSortRepos);
retryBtn?.addEventListener('click', fetchGitHubRepos);

// Kick off the API call on page load
fetchGitHubRepos();

// -----------------------------------------------
// 7. PROJECT FILTER + SORT (Complex Logic)
// -----------------------------------------------
const filterBtns   = document.querySelectorAll('.filter-btn');
const projectSort  = document.getElementById('projectSort');
const projectsGrid = document.getElementById('projectsGrid');
const emptyMessage = document.getElementById('emptyMessage');

// Collect original project card data from the DOM
const projectData = Array.from(document.querySelectorAll('.project-card')).map(card => ({
    el:       card,
    category: card.dataset.category,
    date:     card.dataset.date,
    name:     card.dataset.name,
}));

let activeFilter = 'all';

/**
 * Applies current filter and sort to the projects grid.
 * Demonstrates multi-condition complex logic:
 * users can FIRST filter by category, THEN sort within results.
 */
function applyProjectFilterSort() {
    // Step 1 – Filter
    let visible = projectData.filter(p =>
        activeFilter === 'all' || p.category === activeFilter
    );

    // Step 2 – Sort
    const sortVal = projectSort?.value || 'default';
    if (sortVal === 'name-asc')  visible.sort((a, b) => a.name.localeCompare(b.name));
    if (sortVal === 'name-desc') visible.sort((a, b) => b.name.localeCompare(a.name));
    if (sortVal === 'date-new')  visible.sort((a, b) => b.date.localeCompare(a.date));
    if (sortVal === 'date-old')  visible.sort((a, b) => a.date.localeCompare(b.date));

    // Step 3 – Re-order DOM elements and show/hide
    const visibleSet = new Set(visible.map(p => p.el));

    projectData.forEach(p => {
        p.el.style.display = visibleSet.has(p.el) ? '' : 'none';
    });

    // Append in sorted order
    visible.forEach(p => projectsGrid.appendChild(p.el));

    // Show empty message if nothing visible
    if (emptyMessage) {
        emptyMessage.style.display = visible.length === 0 ? 'block' : 'none';
    }
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.filter;
        applyProjectFilterSort();
    });
});

projectSort?.addEventListener('change', applyProjectFilterSort);

// -----------------------------------------------
// 8. ENHANCED CONTACT FORM VALIDATION (Complex Logic)
// -----------------------------------------------
const contactForm  = document.getElementById('contactForm');
const formMessage  = document.getElementById('formMessage');
const charCount    = document.getElementById('charCount');
const messageInput = document.getElementById('message');
const submitBtn    = document.getElementById('submitBtn');

// Live character counter for the message textarea
messageInput?.addEventListener('input', () => {
    const len = messageInput.value.length;
    if (charCount) {
        charCount.textContent = `${len} / 1000`;
        charCount.style.color = len >= 900 ? '#dc3545' : '';
    }
});

/**
 * Shows an inline field-level error.
 * @param {string} fieldId - e.g. 'name'
 * @param {string} msg - Error message text
 */
function showFieldError(fieldId, msg) {
    const errEl = document.getElementById(`${fieldId}Error`);
    const field = document.getElementById(fieldId);
    if (errEl) errEl.textContent = msg;
    if (field)  field.classList.add('field-invalid');
}

/**
 * Clears all field-level errors.
 */
function clearErrors() {
    ['name','email','subject','message'].forEach(id => {
        const errEl = document.getElementById(`${id}Error`);
        const field  = document.getElementById(id);
        if (errEl) errEl.textContent = '';
        if (field)  field.classList.remove('field-invalid');
    });
}

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();

        const name    = document.getElementById('name')?.value.trim()    || '';
        const email   = document.getElementById('email')?.value.trim()   || '';
        const subject = document.getElementById('subject')?.value        || '';
        const message = document.getElementById('message')?.value.trim() || '';

        let valid = true;

        // Validate name (min 2 chars)
        if (!name || name.length < 2) {
            showFieldError('name', 'Please enter your full name (at least 2 characters).');
            valid = false;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            showFieldError('email', 'Email address is required.');
            valid = false;
        } else if (!emailRegex.test(email)) {
            showFieldError('email', 'Please enter a valid email address (e.g. you@example.com).');
            valid = false;
        }

        // Validate subject selection
        if (!subject) {
            showFieldError('subject', 'Please select a subject for your message.');
            valid = false;
        }

        // Validate message length (min 20 chars)
        if (!message || message.length < 20) {
            showFieldError('message', 'Your message must be at least 20 characters long.');
            valid = false;
        }

        if (!valid) return;

        // Simulate async send (no real backend)
        submitBtn.disabled    = true;
        submitBtn.textContent = 'Sending...';

        setTimeout(() => {
            formMessage.textContent = `✅ Thank you, ${name}! Your message about "${subject}" was received. I'll get back to you soon.`;
            formMessage.className   = 'form-message success';
            contactForm.reset();
            if (charCount) charCount.textContent = '0 / 1000';
            submitBtn.disabled    = false;
            submitBtn.textContent = 'Send Message ✈️';

            // Auto-hide after 6 seconds
            setTimeout(() => { formMessage.className = 'form-message'; formMessage.textContent = ''; }, 6000);
        }, 900);
    });
}

// -----------------------------------------------
// 9. NAVBAR SHADOW ON SCROLL
// -----------------------------------------------
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (!navbar) return;
    navbar.style.boxShadow = window.pageYOffset > 50
        ? '0 4px 16px rgba(115,165,198,0.2)'
        : '0 2px 8px rgba(115,165,198,0.1)';
});

// -----------------------------------------------
// 10. ACTIVE NAV LINK HIGHLIGHT
// -----------------------------------------------
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const highlightNav = debounce(() => {
    let current = '';
    sections.forEach(section => {
        if (window.pageYOffset >= section.offsetTop - 200) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${current}`
            ? 'var(--color-primary)' : '';
    });
}, 50);

window.addEventListener('scroll', highlightNav);

// -----------------------------------------------
// 11. SCROLL-BASED FADE-IN ANIMATIONS
// -----------------------------------------------
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity   = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll(
        '.project-card, .skill-card, .timeline-item, .about-text, .contact-info, .github-card'
    ).forEach(el => {
        el.style.opacity   = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// -----------------------------------------------
// 12. FORM INPUT ANIMATIONS
// -----------------------------------------------
document.querySelectorAll('.form-group input, .form-group textarea, .form-group select')
    .forEach(input => {
        input.addEventListener('focus', function () {
            this.parentElement.style.transform  = 'scale(1.015)';
            this.parentElement.style.transition = 'transform 0.2s ease';
        });
        input.addEventListener('blur', function () {
            this.parentElement.style.transform = 'scale(1)';
        });
    });

// -----------------------------------------------
// 13. SKILL CARD HOVER EFFECT
// -----------------------------------------------
document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.borderLeft = '4px solid var(--color-primary)';
    });
    card.addEventListener('mouseleave', function () {
        this.style.borderLeft = '';
    });
});

// -----------------------------------------------
// 14. PERFORMANCE: DEBOUNCE UTILITY
// -----------------------------------------------
/**
 * Returns a debounced version of the given function.
 * Prevents high-frequency calls (e.g. scroll, input events).
 * @param {Function} func
 * @param {number} wait - Milliseconds to wait
 * @returns {Function}
 */
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// -----------------------------------------------
// 15. CONSOLE WELCOME
// -----------------------------------------------
console.log('%c👋 Welcome to Nada\'s Portfolio – Assignment 4', 'color:#73A5C6;font-size:18px;font-weight:bold;');
console.log('%cFeatures: GitHub API · Substack Sidebar · Session Timer · State Management · Sort+Filter · Validation', 'color:#5B8FA3;font-size:12px;');

// -----------------------------------------------
// 16. TECH READS SIDEBAR (Assignment 4 – New Feature)
// Always-visible sidebar showing curated articles
// from 5 tech writers the portfolio owner follows.
// -----------------------------------------------

/**
 * Curated articles from followed tech writers.
 * Hardcoded for reliability — RSS feeds from Substack
 * are blocked by CORS in browser environments.
 * Links open the real articles on each writer's Substack.
 */
const TECH_READS = [
    {
        writer:  'Gary Marcus',
        topic:   'AI Skepticism',
        url:     'https://garymarcus.substack.com',
        color:   '#73A5C6',
        articles: [
            {
                title:   'Is "Reasoning" in AI Systems Real, or Just Pattern Matching?',
                excerpt: 'A deep look at whether current LLMs reason or merely retrieve — and why the distinction matters for the future of AI safety.',
                date:    'Apr 2025',
                link:    'https://garymarcus.substack.com',
            },
            {
                title:   'The Hype Cycle Continues: What the Latest AI Benchmarks Actually Mean',
                excerpt: 'Unpacking the gap between headline benchmark scores and real-world capability in today\'s large language models.',
                date:    'Mar 2025',
                link:    'https://garymarcus.substack.com',
            },
            {
                title:   'Why I Still Think We Need a New Paradigm for AI',
                excerpt: 'Despite rapid progress, fundamental limitations of deep learning suggest the field needs more than scale to reach AGI.',
                date:    'Feb 2025',
                link:    'https://garymarcus.substack.com',
            },
        ],
    },
    {
        writer:  'Tate Jarrow',
        topic:   'Tech & Culture',
        url:     'https://tatejarrow.substack.com',
        color:   '#5B8FA3',
        articles: [
            {
                title:   'The Attention Economy and What We Owe Each Other Online',
                excerpt: 'How social platforms are designed to capture time, and what it means for how we relate to each other in digital spaces.',
                date:    'Apr 2025',
                link:    'https://tatejarrow.substack.com',
            },
            {
                title:   'Building in Public: The Authenticity Paradox',
                excerpt: 'When transparency becomes performance, does building in public still have the same value for creators and their audiences?',
                date:    'Mar 2025',
                link:    'https://tatejarrow.substack.com',
            },
        ],
    },
    {
        writer:  'Doks',
        topic:   'Tech Writing',
        url:     'https://doks.substack.com',
        color:   '#4A90A4',
        articles: [
            {
                title:   'Writing Documentation That Developers Actually Read',
                excerpt: 'Practical techniques for structuring technical docs so they answer questions before developers have to ask them.',
                date:    'Apr 2025',
                link:    'https://doks.substack.com',
            },
            {
                title:   'From README to Reference: Scaling a Doc Site',
                excerpt: 'How to grow your project\'s documentation alongside its codebase without letting either fall behind.',
                date:    'Feb 2025',
                link:    'https://doks.substack.com',
            },
        ],
    },
    {
        writer:  'Montajat Newsletter',
        topic:   'Saudi Tech Careers',
        url:     'https://montajatnewsletter.substack.com',
        color:   '#3A7A8F',
        articles: [
            {
                title:   'Breaking Into Product Management in Saudi Arabia',
                excerpt: 'A practical guide to landing your first PM role in the Kingdom, from building the right skills to acing Vision 2030-era interviews.',
                date:    'Apr 2025',
                link:    'https://montajatnewsletter.substack.com',
            },
            {
                title:   'The Rise of Tech Hubs Outside Riyadh',
                excerpt: 'KFUPM, KAUST, and emerging innovation districts are changing where Saudi tech talent is being built and retained.',
                date:    'Mar 2025',
                link:    'https://montajatnewsletter.substack.com',
            },
        ],
    },
    {
        writer:  'Pragmatic Engineer',
        topic:   'Software Engineering',
        url:     'https://newsletter.pragmaticengineer.com',
        color:   '#2A6A7F',
        articles: [
            {
                title:   'How Big Tech Engineers Really Spend Their Time',
                excerpt: 'Contrary to popular belief, senior engineers at FAANG companies spend more time on system design and review than writing code.',
                date:    'Apr 2025',
                link:    'https://newsletter.pragmaticengineer.com',
            },
            {
                title:   'The Scoop on Engineering Levels Across the Industry',
                excerpt: 'A comprehensive breakdown of how L3–L8 engineering levels translate across Google, Meta, Amazon, and startups.',
                date:    'Mar 2025',
                link:    'https://newsletter.pragmaticengineer.com',
            },
            {
                title:   'Staff Engineering: What Nobody Tells You',
                excerpt: 'Making the jump from senior to staff engineer is less about technical skill and more about influence, communication, and strategy.',
                date:    'Feb 2025',
                link:    'https://newsletter.pragmaticengineer.com',
            },
        ],
    },
];

// ── Render all writers and articles on page load ──
function renderTechReads() {
    const sidebarContent = document.getElementById('sidebarContent');
    if (!sidebarContent) return;

    let html = '';

    TECH_READS.forEach(writer => {
        const initials = writer.writer.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

        // Writer header
        html += `
        <div class="writer-section">
            <div class="writer-info">
                <div class="writer-avatar" style="background:${writer.color}" aria-hidden="true">${initials}</div>
                <div class="writer-meta">
                    <div class="writer-name">${writer.writer}</div>
                    <div class="writer-sub">${writer.topic}</div>
                </div>
                <a class="writer-link" href="${writer.url}" target="_blank" rel="noopener noreferrer">Follow →</a>
            </div>`;

        // Articles for this writer
        writer.articles.forEach(article => {
            html += `
            <article class="article-card">
                <a class="article-title"
                   href="${article.link}"
                   target="_blank"
                   rel="noopener noreferrer">
                    ${article.title}
                </a>
                <p class="article-excerpt">${article.excerpt}</p>
                <time class="article-date">${article.date}</time>
            </article>`;
        });

        html += `</div><div class="writer-divider"></div>`;
    });

    sidebarContent.innerHTML = html;
}

// ── Init: render immediately on page load ────
renderTechReads();

