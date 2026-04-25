# AI Usage Report – Assignment 4

**Student:** Nada Alshahrani  
**Date:** April 2025  
**Course:** Web Engineering & Development  
**Institution:** King Fahad University of Petroleum and Minerals

---

## Tools Used & Use Cases

### 1. Claude AI (Anthropic)
**Primary tool for Assignment 4**

| Use Case | Description |
|---|---|
| Tech Reads Sidebar Design | Discussed how to build a permanently visible sidebar featuring curated articles from tech writers, including layout approach (fixed position + body padding-left) |
| RSS Feed Investigation | Explored three RSS proxy approaches (rss2json, allorigins, direct fetch) to load Substack articles; Claude helped debug CORS errors and explained why each approach failed |
| Hardcoded Fallback Decision | After RSS approaches failed, Claude suggested curating articles manually as a reliable alternative for a statically-hosted site |
| XML Parsing (attempted) | Claude explained how to use DOMParser to parse raw RSS XML returned by allorigins — tested but ultimately not used due to Substack's 403 restrictions |
| File Structure Reorganisation | Assisted with moving from a flat root folder to the assignment-required subfolder structure (css/, js/, docs/, assets/, presentation/) and updating all src/href paths |
| GitHub Pages Deployment | Guided through enabling GitHub Pages from the repo Settings panel and explained why CORS errors disappear on https:// vs file:// |
| Assignment 3 Features | All features from Assignment 3 (GitHub API, filter+sort, state management, form validation, performance) were carried forward — see Assignment 3 AI report for details |
| Documentation | Helped update README, technical-documentation.md, and this report to reflect Assignment 4 changes |
| Code Review | Reviewed final script.js and styles.css for consistency, unused code, and naming conventions |

---

## Benefits & Challenges

### Benefits

**1. Efficient Problem Diagnosis**  
When the Substack RSS sidebar kept showing errors, Claude immediately identified the root cause (CORS + Substack's feed restrictions) without requiring me to spend hours reading proxy documentation. It also suggested trying multiple approaches in sequence rather than abandoning the idea.

**2. Architectural Clarity**  
The decision to use `body { padding-left: 260px }` to push main content rather than restructuring the HTML layout was Claude's suggestion. It was simpler and more maintainable than wrapping everything in a flex container, and it preserved the existing page structure.

**3. Honest Trade-off Analysis**  
Rather than pushing for a "clever" live-fetch solution that might fail in production, Claude recommended the hardcoded approach and explained clearly why it was the right engineering choice for a statically-hosted portfolio. This mirrors how professional engineers make pragmatic decisions under constraints.

**4. Deployment Guidance**  
I had not deployed a site to GitHub Pages before. Claude walked through the exact steps and explained why the feature was not in my profile settings but inside the specific repository settings — a distinction that was genuinely confusing at first.

**5. Documentation Quality**  
Claude helped ensure the technical documentation accurately reflects what was built, including the "Challenges Resolved" section which documents the RSS investigation as a deliberate engineering decision rather than hiding it.

### Challenges

**1. CORS Is Non-Trivial**  
Even with Claude's guidance, resolving the RSS CORS issue took multiple iterations. Each proxy approach worked differently, and Substack's server-side restrictions added a layer that no client-side proxy could solve. This was a genuine technical limitation, not a code error.

**2. Adapting Generic Layout Suggestions**  
The initial sidebar CSS Claude suggested used `position: fixed` with a slide-in toggle. Redesigning it to be always-visible required me to rethink the layout, add `body { padding-left }`, and handle the responsive breakpoint where the sidebar should disappear on mobile — all of which required manual iteration.

**3. Keeping It Scoped**  
Claude often suggested enhancements beyond the assignment scope (e.g., a collapsible sidebar with animation, a "last updated" timestamp per article, localStorage caching of curated content). I had to stay disciplined about what was necessary versus what was nice-to-have.

---

## Learning Outcomes

### Technical Skills Acquired

**1. CORS and Browser Security Model**
```javascript
// CORS blocks cross-origin requests from the browser
// A proxy fetches the resource server-side, then returns it to the client
const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`;
const response = await fetch(proxyUrl);
```
I now understand why `file://` pages cannot make API calls and why `https://` pages can — the Same-Origin Policy only applies in browser contexts, not between servers.

**2. RSS XML Parsing**
```javascript
// DOMParser can parse XML strings returned by proxy services
const parser = new DOMParser();
const xmlDoc = parser.parseFromString(data.contents, 'text/xml');
const items  = Array.from(xmlDoc.querySelectorAll('item'));
```
Even though this approach was not used in the final version, understanding how to parse XML in the browser was a valuable skill to acquire.

**3. Static Site Deployment**
- Learned how GitHub Pages serves static files directly from a repo branch
- Understood the difference between a user/org page (`username.github.io`) and a project page (`username.github.io/repo-name/`)
- Understood why relative file paths (`css/styles.css`) work on GitHub Pages but absolute paths may not

**4. Organised File Structure**
Moving from a flat folder to a proper subfolder structure required updating every `href` and `src` reference in `index.html`. This reinforced the importance of consistent file organisation from the start of a project.

**5. Pragmatic Engineering Decisions**
The RSS investigation taught me that the "best" solution is not always the most technically sophisticated one. A hardcoded array that always works is better than a live fetch that intermittently fails — especially for a portfolio that needs to impress visitors reliably.

### Conceptual Understanding

- **Static hosting constraints:** GitHub Pages cannot run server-side code. Any feature requiring a backend (proxies, email sending, OAuth) needs to use a third-party service or be deferred.
- **CORS is a browser protection, not a server one:** The RSS feeds exist and are public — the restriction is the browser refusing to pass the response to the JavaScript. A server making the same request has no such restriction.
- **Reliability over cleverness:** A feature that always works creates a better impression than a feature that works 80% of the time and shows an error the rest.

---

## Responsible Use & Modifications

### Review Process

Every AI suggestion went through the following steps before being included:

1. **Read it line by line** — I did not include code I did not understand. Where unclear, I asked Claude to explain it or looked it up on MDN.
2. **Test it in the browser** — All JavaScript was tested in Chrome DevTools with the Console open. The RSS approaches were tested with Network tab open to observe actual HTTP responses.
3. **Modify it to fit** — Variable names, colours, and layout details were adjusted to match my existing design system.
4. **Delete what was not needed** — Suggestions outside assignment scope were deliberately excluded.

### Specific Modifications Made

| AI Suggestion | My Modification | Reason |
|---|---|---|
| Slide-in toggle sidebar | Redesigned as always-visible sidebar | Assignment requirement: visible at all times, no click needed |
| Tabs per writer | Removed tabs entirely; all writers shown together | Cleaner layout; avoids interaction overhead |
| rss2json fetch approach | Replaced with allorigins + XML parser (then hardcoded) | rss2json blocked on GitHub Pages |
| Generic article placeholder text | Replaced with real summaries of each writer's actual topics | More authentic and relevant to the portfolio |
| body wrapper flex layout | Used `body { padding-left: 260px }` instead | Simpler; preserves existing page structure |
| Sidebar visible on all screen sizes | Added `display: none` at 900px breakpoint | Sidebar too narrow to be useful on tablets/phones |

### Academic Integrity

- All code in this project was reviewed and is understood by me.
- AI was used as a learning aid and collaborator, not as a replacement for my own thinking.
- The decision to use hardcoded articles was an engineering judgement I made after evaluating the alternatives — it was not simply "giving up" on the RSS approach.
- This report transparently documents what was AI-assisted, what failed and why, and what I learned from both.

---

## Conclusion

Assignment 4 pushed me to think beyond writing code and consider deployment, reliability, and real-world constraints. The Tech Reads sidebar started as a live RSS feature and ended as a curated hardcoded section — not because the code was too hard to write, but because the infrastructure (CORS, Substack restrictions, static hosting) made live fetching unreliable for a portfolio context.

Using Claude AI helped me move through that technical investigation efficiently, understand why each approach failed, and make a principled decision about the final implementation. The deployment process on GitHub Pages was also smoother with guidance, and the documentation reflects a mature understanding of what was built, why, and what the trade-offs were.

**Key Takeaway from Assignment 4:** Real engineering is as much about constraints and trade-offs as it is about writing code. The best solution is the one that works reliably within the actual environment — not the most technically interesting one on paper.

---

**Report Prepared by:** Nada Alshahrani  
**Submission Date:** April 2025  
**Course:** Web Engineering & Development  
**Institution:** King Fahad University of Petroleum and Minerals
