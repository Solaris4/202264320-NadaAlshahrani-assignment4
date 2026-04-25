# AI Usage Report – Assignment 3

**Student:** Nada Alshahrani  
**Date:** April 2025  
**Course:** Web Engineering & Development  
**Institution:** King Fahad University of Petroleum and Minerals

---

## Tools Used & Use Cases

### 1. Claude AI (Anthropic)
**Primary tool for Assignment 3**

| Use Case | Description |
|---|---|
| API Integration Design | Discussed how to structure the GitHub REST API fetch, handle rate limits (403), user-not-found (404), and network errors with clear user messages |
| Async JavaScript | Helped explain `async/await` and `try/catch` patterns for the `fetchGitHubRepos()` function |
| Complex Logic | Suggested the two-step filter-then-sort pattern used in both the projects grid and the GitHub repo grid |
| State Management | Assisted in designing the visitor-name flow (localStorage persistence, banner UI, dismiss button) |
| Session Timer | Provided the `setInterval` countdown pattern and explained how `padStart` ensures two-digit seconds |
| Form Validation | Reviewed the multi-field validation approach and suggested inline `field-error` spans for better UX than a single banner message |
| Performance | Recommended calling `observer.unobserve(entry.target)` after the first animation trigger to reduce ongoing observation overhead |
| Accessibility | Suggested `aria-live="polite"` on dynamic regions and `role="alert"` on error messages |
| Documentation | Helped structure this report and the technical documentation |
| Code Review | Reviewed script.js sections for correctness, unused variables, and naming consistency |

---

## Benefits & Challenges

### Benefits

**1. Faster Architecture Decisions**  
Rather than spending time researching which GitHub API endpoint to use or how to handle rate-limiting gracefully, Claude explained the differences between endpoints and common error codes in a few sentences. This let me focus on building the feature rather than on API research.

**2. Learning Async Patterns**  
I had used `fetch` before but had not built proper error-branching with `async/await`. Seeing Claude's explanation of how `response.ok` differs from `response.status` and when to use each gave me a clearer mental model I can apply in future projects.

**3. Accessibility Improvements**  
Claude pointed out that my original error message `<div>` had no `role` attribute, which means screen readers would not announce it automatically. Adding `role="alert"` and `aria-live="polite"` to dynamic content regions was a small change with a real impact.

**4. Debugging Suggestions**  
When I described the filter+sort feature not re-ordering DOM nodes correctly after sorting, Claude explained that I needed to re-append each card to the grid in the new order (since moving an element with `appendChild` automatically removes it from its previous position). This saved significant debugging time.

**5. Code Readability**  
Claude suggested splitting the long `filterAndSortRepos()` function into clearly labelled steps (Step 1 – Filter, Step 2 – Sort) using inline comments. This mirrors industry practice for making complex logic easy to follow.

### Challenges

**1. Customisation Required**  
AI-generated code tends to be generic. The GitHub card layout needed significant adjustment: I added language-dot colours per language, the fork/archived badge system, and the relative date format. These were all manual decisions based on how I wanted the section to look.

**2. Verifying API Behaviour**  
Claude described how the GitHub API works, but I had to test it myself in the browser's Network tab to confirm the exact JSON fields returned (e.g., `stargazers_count` not `stars`, `updated_at` not `last_updated`). AI descriptions of APIs should always be verified against the real response.

**3. Avoiding Over-Engineering**  
Some suggestions (e.g., a full pagination system, infinite scroll, local caching with `sessionStorage`) were beyond the scope of this assignment. I had to actively decide which suggestions to include and which to defer.

**4. Finding the Balance**  
It was tempting to ask Claude to write entire sections at once. I found it more educational to write the structure myself first, then ask Claude to review and suggest improvements — this forced me to engage with the code rather than paste it in.

---

## Learning Outcomes

### Technical Skills Acquired

**1. GitHub REST API**
```javascript
// Learned that the GitHub API uses specific Accept headers for versioning
const response = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=30&sort=updated`,
    { headers: { 'Accept': 'application/vnd.github.v3+json' } }
);
```
- Understood the difference between `response.ok` and `response.status`
- Learned how to distinguish API errors (404, 403, 5xx) and show specific messages
- Learned to parse JSON asynchronously with `await response.json()`

**2. DOM Re-ordering Without Re-render**
```javascript
// appendChild moves an existing element rather than cloning it
// This means sorted order can be applied by appending in the right sequence
visible.forEach(p => projectsGrid.appendChild(p.el));
```
This was a useful insight: the DOM can be re-ordered efficiently without rebuilding cards from scratch.

**3. Debouncing**
```javascript
// Prevents the search function from firing on every keystroke
const debouncedSearch = debounce(filterAndSortRepos, 300);
repoSearch.addEventListener('input', debouncedSearch);
```
Previously I understood the concept but had not written a `debounce` function from scratch. Writing and commenting it myself solidified the pattern.

**4. IntersectionObserver Optimisation**
```javascript
// Unobserving after the first intersection avoids continued monitoring
observer.unobserve(entry.target);
```
A small but meaningful performance improvement — elements that have already animated do not need to keep being watched.

**5. localStorage for State Persistence**
```javascript
// Name persists across page reloads — not just in session memory
localStorage.setItem('visitorName', name);
const savedName = localStorage.getItem('visitorName');
```
I now understand the difference between `localStorage` (persistent) and `sessionStorage` (tab-session only), and when each is appropriate.

### Conceptual Understanding

- **API error handling as a UX responsibility:** A broken API call should never leave the user with a blank space. Every async operation should have a loading state, a success state, and an error state.
- **State as the single source of truth:** Storing `allRepos` as a module-level array and re-filtering/sorting from it (rather than removing/re-adding DOM nodes based on what is visible) is a cleaner state pattern.
- **Progressive enhancement:** The site still works without the GitHub API section if the network is unavailable — the rest of the page is not blocked.

---

## Responsible Use & Modifications

### Review Process

Every AI suggestion went through the following steps before being included:

1. **Read it line by line** — I did not paste code I did not understand. Where I did not understand a line, I asked Claude to explain it, or I looked it up on MDN.
2. **Test it in the browser** — All JavaScript was tested in Chrome DevTools with the Network tab open to verify API calls and with the Console open to catch errors.
3. **Modify it to fit** — Generic suggestions were adapted: variable names were changed to match my naming conventions, layout was adjusted to match the moonstone-blue design system, and content was personalised.
4. **Delete what was not needed** — I did not include AI suggestions that were out of scope (pagination, caching, service workers). Keeping the code lean is part of good engineering.

### Specific Modifications Made

| AI Suggestion | My Modification | Reason |
|---|---|---|
| Generic language badge as text only | Added coloured dot per language using a colour-map object | More visually informative |
| Single form error banner | Replaced with inline per-field error `<span>` elements | Better UX; user sees exactly which field is wrong |
| `visitorName` stored and shown on same page load only | Added `localStorage` persistence so name survives reload | Demonstrates true state management across sessions |
| `observer.observe()` without unobserve | Added `observer.unobserve(entry.target)` after first trigger | Performance: avoids continued monitoring of animated elements |
| Sort by a single criterion | Combined filter + sort in sequence with clear step comments | Demonstrates multi-step complex logic as required |

### Academic Integrity

- All code in this project was reviewed and is understood by me.
- AI was used as a learning aid and collaborator, not as a replacement for my own thinking.
- I made deliberate design and architectural decisions throughout.
- This report transparently documents what was AI-assisted and what was independently developed.

---

## Conclusion

Assignment 3 pushed me to integrate real external data, manage application state across multiple user interactions, and handle errors in a way that respects the user. Using Claude AI accelerated the research phase significantly — particularly for the GitHub API specifics and async error-handling patterns — but the design decisions, layout implementation, and debugging were my own work.

The most valuable lesson was that AI assistance is most effective when I come to it with a specific, concrete question rather than a vague "write this for me" request. The more I understood what I wanted to build, the more useful Claude's suggestions became.

**Key Takeaway:** AI tools raise the ceiling of what I can build in a given timeframe, but they do not replace the need to understand, test, and own the code.

---

**Report Prepared by:** Nada Alshahrani  
**Submission Date:** April 2025  
**Course:** Web Engineering & Development  
**Institution:** King Fahad University of Petroleum and Minerals
