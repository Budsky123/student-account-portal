# Student Portal — Build Checklist

> **Project:** University of San Agustin Student Portal  
> **Stack:** Plain HTML + CSS + Vanilla JavaScript  
> **Source:** DESIGN_DOC.md v1.0.0  
> **Created:** 2026-03-29

---

## Progress Tracker

| Feature | Total Steps | Done |
|---|---|---|
| 1. Project Setup & Architecture | 10 | [ ] |
| 2. Design System & Tokens | 7 | [ ] |
| 3. Shared Layout / Navigation | 14 | [ ] |
| 4. DesignNote Component | 5 | [ ] |
| 5. Login Page | 16 | [ ] |
| 6. Registration Page (3-Step Wizard) | 15 | [ ] |
| 7. Dashboard Page | 8 | [ ] |
| 8. My Courses Page | 13 | [ ] |
| 9. Grades Page | 16 | [x] |
| 10. Profile Page | 14 | [ ] |
| 11. Nielsen's Heuristics | 8 | [ ] |
| 12. WCAG Accessibility | 8 | [ ] |
| 13. Consistency & Standards | 10 | [ ] |
| 14. Responsive Design | 8 | [ ] |
| 15. Mock Data & Known Constraints | 9 | [ ] |

---

## 1. Project Setup & Architecture

> Scaffold files, folder structure, routing via JS, font imports.

- [ ] Create folder structure: `/css/`, `/js/`, `/pages/`, `/components/`
- [ ] Create `index.html` (Login page — public entry point)
- [ ] Create `register.html` (Registration page — public)
- [ ] Create `portal/index.html` (Dashboard — auth required)
- [ ] Create `portal/courses.html` (My Courses)
- [ ] Create `portal/grades.html` (Grades)
- [ ] Create `portal/profile.html` (Profile)
- [ ] Create `js/router.js` — simulated client-side nav using `location.href` or History API
- [ ] Create `js/auth.js` — simulated auth state stored in `sessionStorage`
- [ ] Add guard: all `/portal/*.html` pages redirect to `index.html` if not logged in

---

## 2. Design System & Tokens

> CSS custom properties for colors, gradients, spacing, and typography.

- [ ] Create `css/tokens.css` — define all CSS custom properties:
  - Primary palette: `--pink: #FADADD`, `--blue: #B3D9F7`, `--page-bg: #FEF0F5`, `--primary: #5B9BD5`, `--primary-lt: #7BBCF0`, `--accent: #E88FAB`, `--deep-pink: #B5295A`
  - Text colors: `--heading: #1A1A2E`, `--nav: #2D3556`, `--subtitle: #5B7BA8`, `--body: #4B5563`, `--muted: #6B7280`, `--placeholder: #9CA3AF`
  - Semantic colors: success / error / warning / info (bg, border, text)
  - Surface colors: `--card: #FFFFFF`, `--input-bg: #FAFAFA`, `--input-border: #F9A8C9`, `--divider: #F3E0E8`
- [ ] Create `css/typography.css` — Inter font import from Google Fonts. Base rules for h1–h4, label, button, input (font sizes, weights, line-height)
- [ ] Create `css/components.css` — reusable component styles: cards, buttons (primary/secondary/destructive), inputs, badges/pills, modals, toasts, progress bars
- [ ] Create `css/layout.css` — header, nav, main content area, skip link styles
- [ ] Create `css/utilities.css` — helper classes: `.sr-only`, `.visually-hidden`, responsive grid helpers
- [ ] Create `css/animations.css` — fade-in, slide-in transitions for modals, drawers, toasts
- [ ] Create `css/main.css` — root CSS entry that `@import`s all above files

---

## 3. Shared Layout / Navigation

> Header, desktop nav, mobile drawer, skip link — injected into all portal pages.

- [ ] Create `components/layout.html` (or `js/layout.js`) — renders shared header + nav via JS `innerHTML` injection on page load
- [ ] Build sticky `<header role="banner">` with gradient `#FADADD → #B3D9F7`, `max-width: 1280px` container
- [ ] Left section: hamburger button (`<lg` breakpoint) — `aria-expanded`, `aria-controls="mobile-nav"`, Menu ↔ X icons (SVG inline)
- [ ] Left section: University branding — "University of San Agustin" + subtitle
- [ ] Center: desktop `<nav role="navigation" aria-label="Main navigation">` — 4 links: Dashboard, My Courses, Grades, My Profile
- [ ] Active nav highlight: add `.active` class (bg `#5B9BD5`, white text) to current page's link by comparing `location.pathname`
- [ ] Right section: Bell notification icon with badge (`#E88FAB`, count = 2), `aria-label` including count
- [ ] Right section: Avatar circle (gradient `#E88FAB → #5B9BD5`) showing "L" initial. Name "Monkey D. Luffy" visible at sm+ breakpoint
- [ ] Right section: "Log Out" button — clears `sessionStorage`, redirects to `index.html`. Text hidden below sm.
- [ ] Mobile drawer: `<div role="dialog" aria-modal="true" aria-label="Navigation menu">` — overlay + w-72 drawer with gradient bg
- [ ] Mobile nav links with chevron icons. Close on overlay click or nav link click.
- [ ] `<main id="main-content" tabindex="-1">` wrapping page content
- [ ] `<a class="skip-link" href="#main-content">Skip to main content</a>` — sr-only by default, visible on focus
- [ ] Inject layout via `js/layout.js` called from a `<script>` tag at the top of each portal page body

---

## 4. DesignNote Component

> Inline annotation badges for heuristics, WCAG, and consistency notes.

- [ ] Create `js/design-note.js` — `createDesignNote(label, type)` returns an HTML element
- [ ] Type `heuristic`: emoji 📌, bg `#FFE4EC`, text `#B5295A`, border `#F9A8C9`
- [ ] Type `wcag`: emoji ♿, bg `#E0F0FF`, text `#1E5FA8`, border `#90CAF9`
- [ ] Type `consistency`: emoji 🎨, bg `#FFF3E0`, text `#B45309`, border `#FCD34D`
- [ ] Base style: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-semibold tracking-wide`
- [ ] Place badges at relevant locations in each page (Login, Register, Courses, Grades)

---

## 5. Login Page (`index.html`)

> Form validation, loading state, simulated auth, dynamic borders.

- [ ] Full-page gradient background: `linear-gradient(135deg, #FADADD 0%, #EBF4FE 60%, #B3D9F7 100%)`
- [ ] `<a class="skip-link" href="#login-form">Skip to login form</a>` — sr-only, visible on focus
- [ ] Page header: "University of San Agustin" `<h1>` + "Student Portal - Sign In" subtitle
- [ ] Status banner area: loading spinner div ("Signing you in, please wait...") + success banner ("Login successful! Redirecting..."), both with `role="status" aria-live="polite"`, hidden by default
- [ ] White card (border-radius 1rem, box-shadow, padding 2rem): Student ID field + password field + submit button
- [ ] Student ID input: `inputmode="numeric"`, `autocomplete="username"`, `aria-describedby="studentId-hint studentId-error"`
- [ ] Hint text `id="studentId-hint"`: "Your 8-10 digit student ID from your enrollment form."
- [ ] Password field: `autocomplete="current-password"` + Eye/EyeOff SVG toggle button inside input wrapper (`aria-label="Show/Hide password"`)
- [ ] Dynamic border/bg via JS: default `#F9A8C9` / `#FAFAFA` → valid (has value, no error) `#27AE60` → error `#C0392B` / `#FFF5F5`
- [ ] Validation in `js/login.js`: Student ID required + `/^\d{8,10}$/`. Password required + min 6 chars. Show errors with AlertCircle SVG + `role="alert"`
- [ ] Submit: `validate()` → show loading → `setTimeout(1200)` → error if `00000001 + wrong` → success → `setTimeout(800)` → `location.href = 'portal/index.html'`
- [ ] "Forgot password?" link below password field
- [ ] Separator (`<hr>`) + "New student? Create your account here" link to `register.html`
- [ ] Help tip box: Info SVG icon + "contact registrar@usa.edu.ph" (semi-transparent bg, `role="note"`)
- [ ] All error messages: AlertCircle SVG + red text `#C0392B` + `role="alert"` + `aria-live="polite"`
- [ ] DesignNote badges: H6 Recognition, H9 Error Recovery, WCAG 1.4.3 Contrast

---

## 6. Registration Page (`register.html`)

> 3-step wizard, progress bar, per-step validation, password strength.

- [ ] Full-page gradient bg (same as Login). Create `js/register.js`.
- [ ] State object: `{ step: 1, showPassword: false, submitted: false, isLoading: false, form: {...}, errors: {...} }`
- [ ] Step progress bar: numbered circles 1→2→3 with labels. Width = `((step-1)/2)*100 + 50`%. Gradient `#E88FAB → #5B9BD5`. `role="progressbar"` `aria-valuenow` `aria-valuemin=1` `aria-valuemax=3`. Text: "Step {n} of 3 – {label}"
- [ ] Show/hide step panels using CSS class `.step-panel` with `.active` visibility toggle
- [ ] **Step 1 – Personal Info:** firstName* (e.g. Juan), lastName* (e.g. Dela Cruz), email* (valid format), studentId* (`/^\d{8,10}$/`)
- [ ] **Step 2 – Academic Info:** program* `<select>` (8 options), yearLevel* `<select>` (1st–5th Year). Info box: "Your program and year level determine which classes..."
- [ ] PROGRAMS data: BS Computer Science, BS Information Technology, BS Business Administration, BS Accountancy, BS Nursing, AB Communication, BS Education, BS Engineering
- [ ] **Step 3 – Create Password:** password* (min 8 chars, ≥1 uppercase), confirmPassword* (must match), agreeTerms* (checkbox)
- [ ] Password strength indicators (3 inline dots): ≥8 chars, one uppercase, one number. Green `#27AE60` when met, gray `#D1D5DB` when not. Update live on `input` event.
- [ ] Back button (steps 2–3): border `#F9A8C9`, text `#B5295A`, ← icon. Continue button (steps 1–2): primary gradient, → icon.
- [ ] Create Account button (step 3): primary gradient, disabled + "Creating account..." while loading. `setTimeout(1500)` → show success screen.
- [ ] `onChange` equivalent: `input` event listener clears specific field's error as user types
- [ ] Success screen (separate div, hidden until `submitted = true`): green checkmark circle, "Account Created!", "Welcome, {firstName}!", confirmation email note, "Go to Sign In" → `index.html`
- [ ] All required fields: red asterisk `*` with `aria-label="required"`. All inputs: `aria-invalid`, `aria-required="true"`, `aria-describedby` pointing to error element
- [ ] DesignNote badges: H1 System Status (progress), H5 Error Prevention, H9 Error Recovery, WCAG 1.4.3

---

## 7. Dashboard Page (`portal/index.html`)

> Greeting, quick stats, enrolled courses, announcements, quick actions.

- [ ] Inject shared layout header + nav via `js/layout.js`
- [ ] Page greeting: "Good morning, Luffy! 👋" + today's date (`new Date().toLocaleDateString('en-PH', { weekday:'long', year:'numeric', month:'long', day:'numeric' })`) + semester info
- [ ] Quick Stats grid (1→3 cols responsive): Current GPA 1.50 (TrendingUp icon, `#E88FAB`), Enrolled Units 8/21 (BookOpen icon, `#5B9BD5`), Classes Today 2 (Calendar icon, `#27AE60`)
- [ ] Main grid (lg: 2:1 cols): Enrolled Courses column + Announcements sidebar
- [ ] Enrolled Courses (3 cards): CS 223 Human-Computer Interaction, CS 221 Object Oriented Programming, GE 8 Ethics. Each: icon, code+name, clock+schedule, 📍+room, units badge. `role="list"` on container.
- [ ] Announcements (2 items): info type (Enrollment open, Mar 10 2026), success type (Tuition received, Mar 5 2026). Each styled by type (bg, border, icon, badge label). `role="list"` on container.
- [ ] Quick Actions grid (2→4 cols): Register for Classes → `courses.html`, View My Grades → `grades.html`, Update Profile → `profile.html`, Class Schedule → `courses.html`. Each: colored icon container + label.
- [ ] All list sections: `aria-label` on containers, `role="list"` / `role="listitem"`

---

## 8. My Courses Page (`portal/courses.html`)

> Add/drop flow, confirmation modals, toast with undo, units progress bar.

- [ ] Inject layout. Create `js/courses.js`. State: `enrolled[]`, `confirmDrop`, `confirmAdd`, `recentlyDropped`, `toast`
- [ ] Course data — initial enrolled (3): CS 223, CS 221, GE 8 (with enrolled/capacity counts)
- [ ] Course data — available (4): CS 677 Operating Systems, CS 225 Database Management, CS 251 Software Engineering, CS 213 Discrete Mathematics
- [ ] Page header: "My Classes" + semester + "{totalUnits} / 20 units enrolled"
- [ ] Units progress bar: `role="progressbar"` `aria-valuenow` `aria-valuemax=20`. Normal gradient `#E88FAB→#5B9BD5`. Warning gradient `#F59E0B→#EF4444` when > 18. Warning text alert at 20 units.
- [ ] Enrolled section: render course cards dynamically. Each card: "Drop" button → opens drop modal. `role="list"` on container.
- [ ] Available section: render available cards (exclude already-enrolled). Each: "Add" button disabled if `enrolled >= capacity` OR adding would exceed 20 units.
- [ ] **Drop Confirmation Modal:** fixed overlay `rgba(0,0,0,0.3)`, `role="dialog"` `aria-modal="true"`. Cancel (autofocus) + "Yes, Drop Class" buttons. Close on Cancel or backdrop click.
- [ ] **Add Confirmation Modal:** shows new total units after adding. Cancel + Confirm buttons.
- [ ] On drop confirm: splice from enrolled array, store in `recentlyDropped`, show toast with Undo btn, re-render. After 4s → clear toast. Undo restores within 8s.
- [ ] Toast: fixed bottom center, `role="status"` `aria-live="polite"`, auto-dismiss `setTimeout(4000)`, optional Undo button (`setTimeout(8000)` to remove undo option)
- [ ] Empty state (0 enrolled): dashed border `2px dashed #F9A8C9`, BookOpen icon, instructional text
- [ ] DesignNote badges: H1 System Status (units), H3 User Control (undo/cancel), H5 Error Prevention (disabled add)

---

## 9. Grades Page (`portal/grades.html`)

> GPA summary cards, grade color coding, accordion semesters, grade scale legend.

- [x] Inject layout. Create `js/grades.js`. State: `openSemesters = new Set([0])` (first open by default)
- [x] Grade data — 3 semesters:
  - Current (1st Sem 2025-2026): CS 223, CS 221, CS 210, GE 8 — all In Progress, prelim + midterm grades set, finals null
  - 2nd Sem 2024-2025: CS 200, CS 201, Math 101, GE 101, PE 102 — all Passed with full grades
  - 1st Sem 2024-2025: CS 100, CS 101, Math 100, GE 100 — all Passed with full grades
- [x] Compute **Cumulative GWA**: `sum(units * finalGrade) / sum(units)` for all non-null finalGrades → display on GPA card
- [x] Compute **Current Midterm Avg**: simple avg of midterm grades in semester index 0 where midterm !== null
- [x] Compute **Total Units Completed**: sum of units for courses with non-null finalGrade
- [x] GPA Summary Cards (3 cards): Cumulative GWA (pink gradient `#FADADD→#FFE4EC`), Current Midterm Avg (blue gradient `#EBF4FE→#DBEAFE`), Units Completed (green gradient `#E6FAF0→#DCFCE7`)
- [x] Grade Scale Legend: horizontal row of pills — 1.00 Excellent (green), 1.25–1.50 Very Good (blue), 1.75–2.00 Average (yellow), 2.25–3.00 Passing (red), 5.00 Failed (gray)
- [x] `gradeToColor(grade)`: null→gray, ≤1.25→green, ≤1.75→blue, ≤2.25→yellow, ≤3.00→red
- [x] `gradeToLabel(grade)`: null→"Not yet posted", 1.00→"Excellent", ≤1.25→"Very Good", ≤1.50→"Good", ≤1.75→"Above Average", ≤2.00→"Average", ≤2.25→"Below Average", ≤2.50→"Fair", ≤3.00→"Passing", else→"Failed"
- [x] Accordion per semester: `<button>` with `aria-expanded` + `aria-controls="grades-panel-{i}"`. TrendingUp icon, semester name, subject count, unit count, GWA pill. Multiple can be open simultaneously.
- [x] "Current" blue badge on index 0 semester header
- [x] Grade table: `<table>` → `<thead>` `<th scope="col">` → `<tbody>` `<tr>` `<td>`. Columns: Subject, Units, Prelim, Midterm, Finals, Final Grade, Remarks
- [x] Null handling: period grades → "—" em-dash. Alternating row colors: even `#FFFFFF`, odd `#FAFAFA`. Remarks styled as colored badge.
- [x] `overflow-x: auto` wrapper on `<table>` for mobile horizontal scroll

---

## 10. Profile Page (`portal/profile.html`)

> Editable form, validation, save simulation, unsaved changes warning.

- [ ] Inject layout. Create `js/profile.js`. State: `form`, `original`, `errors`, `saved`, `isLoading`, `hasChanges`
- [ ] Initial profile data: firstName "Luffy", lastName "", email "luffy@usa.edu.ph", phone "09171234567", address "Tigbauan, Iloilo", emergencyContact "Hazel Marie Garganera", emergencyPhone "09181234567"
- [ ] `hasChanges`: recompute on every `input` event — compare `form` to `original` field by field
- [ ] Profile Avatar Card: gradient circle `(135deg, #E88FAB, #5B9BD5)` with initials "JD" + camera overlay `<button>` (`aria-label="Change profile photo"`)
- [ ] Avatar card: Name, Student ID 20210001, Program BS Computer Science / 2nd Year
- [ ] Dismissible success banner (CheckCircle2 icon, bg `#E6FAF0`, border `#86EFAC`). Dismiss button `aria-label="Dismiss success message"`.
- [ ] Unsaved Changes Warning banner (Info icon, bg `#FFFBEB`, border `#FCD34D`) — shown when `hasChanges === true`
- [ ] Personal Information card: First Name* / Last Name* (2-col grid sm+), Email Address*, Mobile Number, Address. `autocomplete` attributes set.
- [ ] Emergency Contact card: Contact Name / Contact Number (2-col grid sm+). `autocomplete="off"`.
- [ ] Academic Information card (read-only, bg `#EBF4FE`, border `#90CAF9`): Student ID / Program / Year Level — 3-col grid sm+
- [ ] Validation: firstName required, lastName required, email required + valid format. phone/emergencyPhone (if provided) → `/^(09|\+639)\d{9}$/`
- [ ] Save Changes: disabled when `!hasChanges` or `isLoading`. `setTimeout(1200)` → `saved = true`, `hasChanges = false`.
- [ ] Discard Changes: disabled when `!hasChanges`. Resets `form` to `original`, re-renders.
- [ ] All inputs: dynamic border color (valid `#27AE60`, error `#C0392B`, default `#F9A8C9`), `aria-invalid`, `aria-required`, `aria-describedby`

---

## 11. Nielsen's Heuristics

> Implement at least 7 of Nielsen's 10 heuristics across all pages.

- [ ] **H1 – Visibility of System Status:** loading spinners on Login + Profile, step progress bar on Register, units progress bar on Courses, notification bell badge in header
- [ ] **H2 – Match Between System and the Real World:** "My Classes" (not "Enrolled Course Records"), "Good morning, Luffy!" greeting, plain labels ("Mobile Number" not "tel"), grade labels (Excellent, Very Good, etc.)
- [ ] **H3 – User Control and Freedom:** Cancel (autofocused) in all modals, Undo in Courses drop toast (8s), Back button on Register steps 2–3, Discard Changes on Profile
- [ ] **H5 – Error Prevention:** dropdowns for program/yearLevel on Register step 2, Add button disabled when full or exceeds 20 units, `inputmode="numeric"` on Student ID, `novalidate` + custom validation on all forms
- [ ] **H6 – Recognition Rather Than Recall:** placeholder "e.g. 20210001" / "e.g. Juan" on all inputs, hint text below Student ID, step-specific info boxes on Register
- [ ] **H8 – Aesthetic and Minimalist Design:** clean card layout, generous whitespace, Quick Actions on Dashboard, read-only academic info visually separated on Profile
- [ ] **H9 – Help Users Recover from Errors:** specific error messages with examples, AlertCircle icon + `role="alert"`, red border + pink bg on error inputs, DesignNote badges placed in pages
- [ ] **H10 – Help and Documentation:** help tip box on Login (registrar@usa.edu.ph), step-specific info notes on Register, grade scale legend on Grades

---

## 12. WCAG Accessibility

> Implement at least 4 WCAG guidelines.

- [ ] **WCAG 1.3.1 – Info and Relationships:** semantic HTML (`<header>`, `<nav>`, `<main>`, `<section>`, `<form>`, `<table>`, `<fieldset>`, `<legend>`). `role="list"` / `role="listitem"` on courses + announcements.
- [ ] **WCAG 1.3.1 – Table structure:** `<thead>`, `<th scope="col">`, `<tbody>`, `<tr>`, `<td>` on Grades tables. Every input has `<label for>` or `aria-label`.
- [ ] **WCAG 1.3.1 – ARIA:** `aria-describedby`, `aria-required="true"`, `aria-invalid`, `role="progressbar"` with `aria-valuenow/min/max`, `role="dialog"` `aria-modal` on modals and mobile nav
- [ ] **WCAG 1.4.3 – Contrast:** verify heading `#1A1A2E` on white (~16.5:1), body `#4B5563` on white (~7.5:1), error `#C0392B` on `#FFF5F5` (~5.7:1), success `#166534` on `#E6FAF0` (~7.2:1)
- [ ] **WCAG 2.1.1 – Keyboard:** skip links on all portal pages and Login. All interactive elements use native `<button>` or `<a>`. `autofocus` on Cancel in modals. `aria-expanded` on hamburger + accordion buttons.
- [ ] **WCAG 2.4.7 – Focus Visible:** `outline: 2px solid #5B9BD5` with `outline-offset: 2px` on ALL focusable elements. No `outline: none` without visible replacement.
- [ ] **WCAG 4.1.2 – Name, Role, Value:** `aria-label` on all icon-only buttons (hamburger, password toggle, bell, camera, logout, dismiss). `aria-label` on progress bars. `aria-hidden="true"` on all decorative SVG icons.
- [ ] **WCAG 4.1.2 – Live Regions:** `aria-live="polite"` on login status, toast notifications, loading states. `role="status"` on banners.

---

## 13. Consistency & Standards

> Enforce visual and behavioral patterns across all pages.

- [ ] Primary button: `border-radius: 0.75rem`, gradient `#5B9BD5→#7BBCF0`, white text, full-width in forms — applied consistently on ALL pages
- [ ] Secondary button: `border-radius: 0.75rem`, transparent bg, `border: 2px solid #F9A8C9`, text `#B5295A` — applied on Register (Back) and all modals (Cancel)
- [ ] Destructive button: `border-radius: 0.75rem`, red `#C0392B` bg or border — only on modal confirm-drop
- [ ] Disabled state: `opacity: 0.6; cursor: not-allowed` on all disabled buttons
- [ ] Inputs across ALL pages: `border-radius: 0.75rem`, `border: 2px solid #F9A8C9`, bg `#FAFAFA`, consistent padding `px-3 py-2.5`
- [ ] Error messages: AlertCircle SVG + red text `#C0392B` + `role="alert"` — consistent across all forms
- [ ] Success banners: CheckCircle2 SVG + bg `#E6FAF0` + border `#86EFAC`. Warning banners: Info SVG + bg `#FFFBEB` + border `#FCD34D`
- [ ] Badges/Pills: `border-radius: 9999px`, `font-size: 0.75rem`, `font-weight: 600`, semantic colors — consistent throughout
- [ ] All forms: `novalidate` attribute. Custom validation runs on submit. `onChange` clears field-specific errors on input.
- [ ] Required field markers: red `*` with `aria-label="required"` on ALL required field labels across all forms

---

## 14. Responsive Design

> Mobile-first, three breakpoints: default (mobile) → 640px → 1024px.

- [ ] Header: hamburger visible below 1024px, full nav + logout text visible at 1024px+, user name visible at 640px+
- [ ] Dashboard Quick Stats: `grid-cols: 1` (mobile) → `grid-cols: 3` (640px+)
- [ ] Dashboard main content: stacked (mobile) → `grid-cols: 3` with `col-span: 2` for courses (1024px+)
- [ ] Dashboard Quick Actions: `grid-cols: 2` (mobile) → `grid-cols: 4` (640px+)
- [ ] Courses page: stacked course info (mobile) → side-by-side with actions inline (640px+)
- [ ] Grades: `overflow-x: auto` on table for mobile scroll. "Step" labels hidden on mobile.
- [ ] Profile: single-column form fields → 2-col grid for name (640px+). 3-col grid for academic info (640px+). Stacked → row for action buttons.
- [ ] Login/Register: `max-width: 28rem` / `max-width: 32rem` centered card — naturally responsive within constraint

---

## 15. Mock Data & Known Constraints

> Document inconsistencies, edge cases, and no-backend behavior.

- [ ] Add JS comment in `courses.js`: Course id:2 name is "Object Oriented Programming" on Dashboard/Courses but "Data Structures 2" on Grades — intentional mock data mismatch
- [x] Add JS comment in `grades.js`: Dashboard hardcodes GPA "1.50" but Grades computes ~1.66 dynamically — intentional
- [ ] Add JS comment in `dashboard.js`: Dashboard shows "8 of 21 allowed" units but Courses enforces max 20 — intentional
- [ ] Add JS comment in `layout.js`: Layout header shows "L" avatar, Profile page avatar shows "JD" — cosmetic mock mismatch
- [ ] Auth guard in `js/auth.js`: check `sessionStorage.getItem('logged_in')` — redirect to `index.html` if falsy on all portal pages
- [ ] Document in `README.md`: no route protection beyond sessionStorage (direct URL still redirects), not a production-grade auth system
- [ ] Search state + filter logic exists in `courses.js` but no UI input is rendered — document in code comment
- [ ] Modal focus trap is NOT implemented (Tab can escape modals) — document as known WCAG limitation in code comment
- [ ] All data is hardcoded in JS arrays — state is lost on page refresh — document in README

---

*End of Build Checklist — University of San Agustin Student Portal (Plain HTML Edition)*
