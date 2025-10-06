# Static Event Website Plan

## Recommended Technology Stack
- **HTML5** for semantic markup.
- **CSS3** with your provided style guide; consider using a simple utility-first structure or custom CSS, avoiding preprocessors for GitHub Pages compatibility.
- **Vanilla JavaScript** for lightweight interactivity (tab highlighting, simple animations, gallery lightbox if needed).
- **Responsive Images** (WebP/JPEG) and embedded YouTube iframes for video content.
- Optional: **A11y-enhancing libraries** delivered via CDN (e.g., `a11y-dialog`) if modals/lightboxes are needed.

This stack keeps the site fully static, easy to host on GitHub Pages, Netlify, or similar platforms without build tooling.

## Suggested File & Directory Structure
```
/ (project root)
├── index.html          # Home page with hero banner and event overview
├── gallery.html        # Photo gallery, optionally with lightbox functionality
├── presentations.html  # Embedded YouTube videos and talk summaries
├── about.html          # About the organizing team and event history
├── assets/
│   ├── css/
│   │   ├── reset.css   # (Optional) Normalize styles
│   │   └── styles.css  # Main stylesheet following the style guide
│   ├── js/
│   │   └── main.js     # Shared scripts (nav interactions, analytics)
│   └── images/         # Optimized images (web banners, gallery thumbnails)
└── README.md           # Documentation for setup and deployment
```

## Layout Outline
1. **Top Banner**
   - Full-width banner image or background color aligned with the style guide.
   - Event title, subtitle, and date.
   - Call-to-action button linking to gallery or presentations.

2. **Global Navigation Bar**
   - Horizontal nav with four links (Home, Gallery, Presentations, About Us).
   - Responsive design (hamburger menu for mobile) using CSS/JS.
   - Active state styling to indicate the current page.

3. **Page-Specific Sections**
   - Each HTML file includes a consistent header/footer imported via `<header>`/`<footer>` components or JavaScript includes.

### Home (`index.html`)
- Hero section reiterating banner content.
- Event summary, key highlights, statistics.
- Feature section linking to gallery and presentation pages.
- Testimonials or quotes from participants.

### Gallery (`gallery.html`)
- Grid-based gallery using CSS Grid or Flexbox.
- Thumbnails linked to high-res images or modal viewer.
- Optional filters (e.g., Day 1, Day 2, Workshops) managed by JS.

### Presentations (`presentations.html`)
- List of sessions with speaker info.
- Embedded YouTube iframes in responsive containers (`aspect-ratio` or padding hack).
- Download links for slides or related materials.

### About Us (`about.html`)
- Organization mission and background.
- Team member profiles with headshots and bios.
- Contact information and social links.

## Deployment Tips
- Use descriptive filenames and alt text for images to improve accessibility and SEO.
- Optimize images before uploading (TinyPNG, Squoosh).
- Leverage GitHub Actions or manual workflow to deploy to GitHub Pages.
- Validate HTML and CSS with W3C validators to ensure compatibility.

## Next Steps
1. Gather all assets following the style guide.
2. Build base HTML structure for each page.
3. Apply shared CSS and responsive rules.
4. Integrate multimedia content (images, YouTube embeds).
5. Test across devices/browsers, then deploy.
