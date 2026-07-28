# Product Requirements Document (PRD)
## Simple Interactive Website — HTML, Bootstrap & CSS

**Prepared by:** Eyris
**Version:** 1.0
**Date:** July 28, 2026

---

## 1. Project Overview

A single-page, mobile-responsive website built with **HTML, Bootstrap 5, and custom CSS only** (no React/JS frameworks). The site should feel warm, editorial, and lifestyle-driven — similar in mood to a boutique café or beach-house brand — while staying simple to build and maintain. Interactivity comes entirely from Bootstrap's built-in JS components (dropdowns, accordion, carousel, modals if needed) plus light custom CSS transitions.

**Goal:** A clean, professional, portfolio-ready one-pager that demonstrates card layouts, dropdowns, buttons, an accordion, and a carousel — all styled around a warm/coastal-cafe aesthetic.

---

## 2. Design Inspiration & Direction

Two reference sites were reviewed to define the visual tone:

| Reference | Key takeaways to borrow |
|---|---|
| **Norah Head Beach Haus** (norahheadbeachhaus.com.au) | Large full-bleed hero imagery, warm/coastal color palette, short punchy headlines ("Beach vibes meet delicious bites"), simple photo grid/gallery, testimonials section, clear single CTA per section ("View menu," "Order online"), minimal nav (Home / Menu / About / Contact) |
| **Onda Music & Arts Cafe** (onda-music-cafe.fi) | Dark, moody background with bold serif display headlines, rounded pill-style nav links, dropdown-style filterable menu categories, FAQ accordion, strong single-image CTA banner near the footer, social links in header |

**Direction for this project:** Blend the two — a warm, inviting layout structure (à la Norah Head) with the bolder typography, dark accent sections, and accordion/dropdown interactivity of Onda.

### Typography
The requested font, **"Recoleta Alt Bold,"** is a premium/paid display serif from Latinotype and is **not available for free web embedding** (no Google Fonts or CDN license). Since the brief calls for a free HTML/CSS/Bootstrap build, use this substitution:

- **Headings/Display font:** [**Fraunces**](https://fonts.google.com/specimen/Fraunces) (Google Fonts, free, OFL license) — the closest free match to Recoleta's warm, retro-serif character; supports a 900/Black weight for bold display headlines.
- **Body/UI font:** A clean sans-serif such as **Inter** or **Poppins** (Google Fonts), used for nav, body copy, and buttons — mirrors the "Bold, sans-serif" fallback in the original brief.

```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,700;9..144,900&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
```

```css
h1, h2, h3, .display-font { font-family: 'Fraunces', serif; font-weight: 900; }
body, p, .btn, .nav-link { font-family: 'Poppins', sans-serif; }
```

### Color Palette (from "Grace and Glory Tastebuds" menu reference)
The client supplied a café menu design as the color reference. Palette extracted from that image:

| Role | Color | Hex | Where it's used on the menu |
|---|---|---|---|
| Background (light sections) | Warm ivory/cream | `#FBF1E7` | Page background |
| Primary accent | Terracotta / coral | `#DE7C54` | Category pill headers (HOT/COLD COFFEE, FRAPPE, MILKTEA, PASTRIES, COMBO) |
| Secondary accent | Soft peach/blush | `#F3CBAF` | Decorative swirl/border accents |
| Headline / text (dark) | Deep brick maroon | `#7A2E22` | "MENU" bold display headline |
| Body text | Charcoal | `#2E2A27` | Item names, prices |
| Logo accent (optional) | Deep navy/teal | `#1F2E3A` | Small circular logo badge |
| Text (light, on accent bg) | Off-white | `#FBF1E7` | Text on terracotta pill buttons |

**Application to the website:**
- Backgrounds stay warm ivory (`#FBF1E7`) rather than pure white, matching the menu's paper tone
- Terracotta (`#DE7C54`) becomes the primary button/accent color — navbar CTA, hero button, card buttons, accordion active state, carousel indicators
- Deep brick maroon (`#7A2E22`) is reserved for bold display headlines (paired with the Fraunces font) instead of pure black, echoing the "MENU" wordmark
- Soft peach (`#F3CBAF`) works well as card backgrounds, section dividers, or subtle hover states
- Footer can use the deep navy (`#1F2E3A`) as a dark anchor section instead of pure black, nodding to the logo badge color

---

## 3. Tech Stack

- **HTML5** — semantic structure
- **Bootstrap 5.3** (CDN) — grid, cards, dropdowns, buttons, accordion, carousel, forms
- **Custom CSS** — theme colors, fonts, hover/transition effects, spacing overrides
- **Vanilla JavaScript (light, single file `script.js`)** — Bootstrap's bundled JS (Popper included) still handles the base component behavior (navbar collapse, dropdown, accordion, carousel); a small custom script layers on top for the order/cart logic and extra interactivity described in Section 4.8
- **Google Fonts CDN** — Fraunces + Poppins
- **No frameworks/build tools** — plain `<script>` tag, no React/npm/bundlers, keeping the "simple" brief intact

---

## 4. Site Structure & Section-by-Section Requirements

### 4.1 Navbar
- Bootstrap `navbar navbar-expand-lg` with logo/wordmark on the left
- Nav links: Home, About, Products/Menu, Gallery, Contact
- Collapsible hamburger menu on mobile (`navbar-toggler`)
- Sticky-top behavior (`sticky-top` or `fixed-top` with body padding offset)
- One nav item includes a **dropdown** (e.g., "Products" → dropdown listing product categories) to satisfy the dropdown requirement
- CTA button in navbar (e.g., "Order Now" / "Contact Us") using `btn btn-primary` styled with accent color

### 4.2 Hero Section (with About Us)
- Full-width hero (`vh-100` or `min-vh-75`) with background image or color block, centered bold **Fraunces** headline + short subtext (mirrors "Beach vibes meet delicious bites" tone)
- Primary CTA button (e.g., "Explore Our Products")
- Below or beside hero: a short **About Us** blurb (2–3 sentences) with a secondary "Learn More" button — can be a two-column `row` (image left, text right) similar to Norah Head's "Step into paradise" block

### 4.3 Body — Products
- Bootstrap **card** grid (`row row-cols-1 row-cols-md-3 g-4`), 3–6 product cards
- Each card: image top, `card-title`, `card-text` (short description), price badge, and a `btn` (e.g., "Add to Cart" / "View Details")
- Optional: a **dropdown filter** button above the grid (e.g., "Sort by: Popular / Price / New") to add a second dropdown interaction point, echoing Onda's filterable menu

### 4.4 Accordion
- Bootstrap `accordion` component for **FAQs** or **Product Details/Ingredients** (e.g., "What's included," "Shipping & Returns," "Care Instructions")
- 3–5 accordion items, only one open at a time (default Bootstrap behavior)
- Styled with theme colors on the `accordion-button` active state

### 4.5 Carousel
- Bootstrap `carousel` with 3–5 slides — can show product highlights, gallery photos, or customer testimonials (Norah Head's "Your kind words" testimonials are a good model)
- Include indicators (dots) and prev/next controls
- Optional captions overlay (`carousel-caption`) with short text per slide

### 4.6 Form
- Contact or "Order Inquiry" form using Bootstrap form classes (`form-control`, `form-select`, `mb-3`)
- Fields: Name, Email, Phone (optional), Product interest (`<select>` dropdown — third dropdown touchpoint), Message (`textarea`)
- Submit button (`btn btn-primary`), with Bootstrap validation classes (`was-validated`, `required`) for simple client-side checks
- No backend required for this phase — button can trigger a static "Thank you" alert or Bootstrap `alert` component on click (via a small inline script or `data-bs-*` toggle, still counts as "simple" per the brief)

### 4.7 Footer with CTA
- Dark-background footer (matches Onda's moody palette) with:
  - A closing **CTA banner** above the footer links (e.g., "Ready to visit us? Order online today.") with one prominent button
  - Footer columns: brand blurb, quick links, contact info/location, social icons
  - Copyright line at the bottom

### 4.8 JavaScript-Powered Interactivity (new)
Light vanilla JS layered on top of Bootstrap to make the site feel like a real ordering experience, without any backend or framework:

**Add-to-Order / Cart**
- Each product card gets an "Add to Order" button
- Clicking it stores the item (name, price, qty) in a JS array/object (in-memory, resets on page reload — no backend/localStorage needed for v1, though `localStorage` can be added later if persistence is wanted)
- A **cart icon/badge** in the navbar updates its count live as items are added
- Clicking the cart icon opens a Bootstrap **offcanvas** or **modal** showing the order summary: item list, quantity +/- controls, running total, and a "Clear Order" / "Checkout" button
- "Checkout" can trigger a styled **confirmation alert/toast** ("Thanks! Your order has been received.") — matches the "static confirmation only" scope from Section 8

**Quantity & Size Selection**
- Cards with size options (12oz/16oz/22oz, like the menu reference) use a small button group or dropdown per card so price updates dynamically when a size is selected before adding to order

**Interactive Design Touches**
- Smooth scroll for in-page nav links (`scrollIntoView` with `behavior: 'smooth'`)
- Scroll-triggered fade-in/slide-up animations on sections as they enter the viewport (`IntersectionObserver` + a CSS class toggle)
- Active nav-link highlighting based on scroll position (highlights "Products," "About," etc. as the user scrolls past each section)
- Hover/active micro-interactions on cards (slight lift + shadow) and buttons (color shift), done in CSS but triggered/reinforced via JS class toggles where needed
- Live character counter or simple inline validation feedback on the contact/order form fields
- A "Back to top" floating button that fades in after scrolling past the hero

**Why this stays "simple":**
- One `script.js` file, plain DOM APIs (`querySelector`, `addEventListener`) — no state management library
- No external JS dependencies beyond Bootstrap's own bundle
- All data is in-memory for this phase (Section 8 "Out of Scope" still applies to real payment/backend order processing)

---

## 5. Interaction & Component Checklist (per brief requirement)

| Requirement | Where it appears |
|---|---|
| Cards | Products section (required), optionally testimonial cards |
| Dropdowns | Navbar "Products" dropdown, product sort/filter dropdown, form product-interest `<select>` |
| Buttons | Navbar CTA, Hero CTA(s), product card buttons, form submit, footer CTA |
| Accordion | FAQ / product details section |
| Carousel | Gallery or testimonials |
| Form | Contact/order inquiry |
| Navbar | Sticky top nav |
| Hero + About | Combined hero section |
| Footer + CTA | Closing banner + footer |
| Add-to-order / cart (JS) | Product cards → navbar cart badge → offcanvas/modal summary |
| Scroll animations & active nav highlight (JS) | Global, across all sections |
| Back-to-top button (JS) | Global, floating |

---

## 6. Non-Functional Requirements
- **Responsive:** must look good on mobile, tablet, and desktop (Bootstrap grid + breakpoints)
- **Performance:** use compressed images, Bootstrap via CDN, no heavy JS libraries
- **Accessibility:** proper `alt` text on images, sufficient color contrast (especially white text on dark backgrounds), labeled form fields
- **Browser support:** latest Chrome, Edge, Firefox, Safari

---

## 7. File Structure (suggested)
```
project-root/
├── index.html
├── css/
│   └── style.css
├── images/
│   ├── hero.jpg
│   ├── products/
│   └── gallery/
└── README.md
```

---

## 8. Out of Scope (v1)
- Backend/database integration for the form or order/cart (in-memory JS only, resets on page reload)
- Persistent cart via `localStorage`/`sessionStorage` (can be a v1.1 enhancement if wanted)
- User accounts / login
- Real payment processing
- CMS or dynamic content management

---

## 9. Next Steps
1. Confirm color palette and final font pairing
2. Gather/select product and hero images
3. Build static HTML skeleton section by section (Navbar → Hero → Products → Accordion → Carousel → Form → Footer)
4. Apply custom CSS theme on top of Bootstrap defaults
5. Test responsiveness across breakpoints
