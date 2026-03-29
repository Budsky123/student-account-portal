# Student Portal - Comprehensive Design Document

> **Version:** 1.0.0
> **Last Updated:** 2026-03-29
> **Author:** UX Redesign Team - University of San Agustin
> **Stack:** React 18.3.1 + TypeScript + Tailwind CSS v4.1 + Vite 6.3.5
> **Purpose:** Agentic coding reference for reproducing, extending, or maintaining this student portal.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture & File Structure](#2-architecture--file-structure)
3. [Routing Configuration](#3-routing-configuration)
4. [Design System & Tokens](#4-design-system--tokens)
5. [Shared Components](#5-shared-components)
6. [Page Specifications](#6-page-specifications)
7. [Data Models & Mock Data](#7-data-models--mock-data)
8. [Nielsen's Usability Heuristics Implementation](#8-nielsens-usability-heuristics-implementation)
9. [WCAG Accessibility Guidelines Implementation](#9-wcag-accessibility-guidelines-implementation)
10. [Consistency & Standards Principles](#10-consistency--standards-principles)
11. [Interaction Patterns](#11-interaction-patterns)
12. [Responsive Design Strategy](#12-responsive-design-strategy)
13. [Dependencies & Package Manifest](#13-dependencies--package-manifest)
14. [Known Constraints & Edge Cases](#14-known-constraints--edge-cases)

---

## 1. Project Overview

### 1.1 Context

The University of San Agustin Student Portal was redesigned to address three key complaints:
- **Confusing navigation** - Students couldn't find what they needed.
- **Poor mobile experience** - The old portal was not responsive.
- **Inaccessibility** - Screen reader and keyboard users were unsupported.

### 1.2 Scope

A 6-screen single-page application (SPA):

| Screen | Route | File | Auth Required |
|---|---|---|---|
| Login | `/` | `/src/app/pages/Login.tsx` | No |
| Registration | `/register` | `/src/app/pages/Register.tsx` | No |
| Dashboard | `/portal` | `/src/app/pages/Dashboard.tsx` | Yes (simulated) |
| My Courses | `/portal/courses` | `/src/app/pages/Courses.tsx` | Yes (simulated) |
| Grades | `/portal/grades` | `/src/app/pages/Grades.tsx` | Yes (simulated) |
| Profile | `/portal/profile` | `/src/app/pages/Profile.tsx` | Yes (simulated) |

**Note:** Authentication is simulated. Any Student ID + password combination (except `00000000` + `wrong`) will succeed login.

### 1.3 User Persona

- **Name:** Monkey D. Luffy (mock student)
- **Student ID:** 20210001
- **Program:** BS Computer Science, 2nd Year
- **Email:** luffy@usa.edu.ph
- **Academic Year:** 1st Semester, A.Y. 2025-2026

---

## 2. Architecture & File Structure

```
/
├── package.json
├── src/
│   ├── styles/
│   │   ├── index.css          # Root CSS entry - imports fonts, tailwind, theme
│   │   ├── fonts.css          # Google Fonts import (Inter 400/500/600/700)
│   │   ├── tailwind.css       # Tailwind v4 config with tw-animate-css
│   │   └── theme.css          # CSS custom properties, base typography, dark mode tokens
│   └── app/
│       ├── App.tsx            # Root component - renders <RouterProvider>
│       ├── routes.ts          # createBrowserRouter configuration
│       ├── components/
│       │   ├── Layout.tsx     # Shared authenticated shell (header, nav, mobile drawer)
│       │   ├── DesignNote.tsx # Inline annotation badges for design decisions
│       │   ├── figma/
│       │   │   └── ImageWithFallback.tsx  # [PROTECTED - DO NOT MODIFY]
│       │   └── ui/            # shadcn/ui component library (47 components)
│       └── pages/
│           ├── Login.tsx
│           ├── Register.tsx
│           ├── Dashboard.tsx
│           ├── Courses.tsx
│           ├── Grades.tsx
│           └── Profile.tsx
```

### 2.1 Key Architectural Decisions

- **No global state management** - Each page manages its own state via `useState`. No Redux, Zustand, or Context API.
- **No real backend** - All data is hardcoded mock data. API calls are simulated with `setTimeout`.
- **No authentication layer** - Login navigates to `/portal` after a simulated delay. No tokens, sessions, or guards.
- **Inline styles over Tailwind for colors** - The pastel color scheme is applied via `style={{}}` props rather than Tailwind color classes, ensuring exact hex values without custom Tailwind config.
- **React Router v7 Data Mode** - Uses `createBrowserRouter` with `RouterProvider`, NOT `<BrowserRouter>`.

---

## 3. Routing Configuration

**File:** `/src/app/routes.ts`

```typescript
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",              // Login page (public)
    Component: LoginPage,
  },
  {
    path: "/register",      // Registration page (public)
    Component: RegisterPage,
  },
  {
    path: "/portal",        // Authenticated layout wrapper
    Component: Layout,      // Renders header + nav + <Outlet />
    children: [
      { index: true, Component: DashboardPage },        // /portal
      { path: "courses", Component: CoursesPage },       // /portal/courses
      { path: "grades", Component: GradesPage },         // /portal/grades
      { path: "profile", Component: ProfilePage },       // /portal/profile
    ],
  },
]);
```

### 3.1 Navigation Items (defined in Layout.tsx)

```typescript
const navItems = [
  { to: "/portal", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/portal/courses", label: "My Courses", icon: BookOpen, end: false },
  { to: "/portal/grades", label: "Grades", icon: GraduationCap, end: false },
  { to: "/portal/profile", label: "My Profile", icon: User, end: false },
];
```

- `end: true` on Dashboard ensures it only highlights when exactly at `/portal`.
- Icons are from `lucide-react`.

---

## 4. Design System & Tokens

### 4.1 Color Palette

All colors are applied via inline `style={{}}` props. The portal does NOT use Tailwind color utility classes for its custom palette.

#### Primary Colors

| Token | Hex | Usage |
|---|---|---|
| **Pastel Pink (bg)** | `#FADADD` | Header gradient start, mobile nav bg, course icon bg |
| **Pastel Blue (bg)** | `#B3D9F7` | Header gradient end, background gradient end |
| **Page Background** | `#FEF0F5` | Main content area background, course card hover |
| **Primary Blue** | `#5B9BD5` | Active nav, primary buttons, links, focus outlines |
| **Primary Blue Light** | `#7BBCF0` | Button gradient end |
| **Accent Pink** | `#E88FAB` | Avatar gradient, secondary links, notification badge, chart accent |
| **Deep Pink** | `#B5295A` | Required field asterisks, secondary button text, back button |

#### Text Colors

| Token | Hex | Usage |
|---|---|---|
| **Heading Text** | `#1A1A2E` | h1, h2, course names, primary text |
| **Nav Text** | `#2D3556` | Navigation labels, form labels |
| **Subtitle Text** | `#5B7BA8` | University subtitle, help text |
| **Body Text** | `#4B5563` | Announcement body, dialog descriptions |
| **Muted Text** | `#6B7280` | Hints, dates, secondary info |
| **Placeholder Text** | `#9CA3AF` | Input placeholders, dash indicators |
| **Light Muted** | `#9BB8D4` | Inactive step indicators, disabled buttons |

#### Semantic Colors

| Category | Background | Border | Text |
|---|---|---|---|
| **Success** | `#E6FAF0` / `#DCFCE7` | `#86EFAC` | `#166534` / `#27AE60` |
| **Error** | `#FFF5F5` / `#FEE2E2` | `#FCA5A5` | `#C0392B` / `#991B1B` |
| **Warning** | `#FFFBEB` / `#FEF9C3` | `#FCD34D` | `#B45309` / `#854D0E` |
| **Info** | `#EBF4FE` / `#DBEAFE` | `#90CAF9` | `#1E5FA8` / `#5B9BD5` |

#### Surface Colors

| Token | Hex | Usage |
|---|---|---|
| **Card Background** | `#FFFFFF` | All card/section surfaces |
| **Input Background** | `#FAFAFA` | Default input background |
| **Input Error Background** | `#FFF5F5` | Input background on validation error |
| **Input Border Default** | `#F9A8C9` | Default pastel pink border on inputs |
| **Input Border Valid** | `#27AE60` | Green border when input has valid content |
| **Input Border Error** | `#C0392B` | Red border on validation error |
| **Divider/Separator** | `#F3E0E8` | Section dividers, table borders |

### 4.2 Gradients

| Name | CSS Value | Usage |
|---|---|---|
| **Header** | `linear-gradient(135deg, #FADADD 0%, #B3D9F7 100%)` | Top header bar |
| **Page Background** | `linear-gradient(135deg, #FADADD 0%, #EBF4FE 60%, #B3D9F7 100%)` | Login & Register full-page bg |
| **Primary Button** | `linear-gradient(135deg, #5B9BD5, #7BBCF0)` | All primary action buttons |
| **Avatar** | `linear-gradient(135deg, #E88FAB, #5B9BD5)` | Profile avatar circle |
| **Mobile Nav** | `linear-gradient(180deg, #FADADD 0%, #EBF4FE 100%)` | Mobile navigation drawer |
| **GPA Card Pink** | `linear-gradient(135deg, #FADADD, #FFE4EC)` | Cumulative GWA card |
| **GPA Card Blue** | `linear-gradient(135deg, #EBF4FE, #DBEAFE)` | Current midterm avg card |
| **GPA Card Green** | `linear-gradient(135deg, #E6FAF0, #DCFCE7)` | Units completed card |
| **Units Progress** | `linear-gradient(90deg, #E88FAB, #5B9BD5)` | Progress bar fill (normal) |
| **Units Progress Warning** | `linear-gradient(90deg, #F59E0B, #EF4444)` | Progress bar fill (>18 units) |
| **Registration Progress** | `linear-gradient(90deg, #E88FAB, #5B9BD5)` | Step progress bar fill |

### 4.3 Typography

**Font:** Inter (Google Fonts) - weights 400, 500, 600, 700
**Import:** `/src/styles/fonts.css` via `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');`

Base typography is defined in `/src/styles/theme.css` `@layer base`:

| Element | Font Size | Font Weight | Line Height |
|---|---|---|---|
| `html` | `var(--font-size)` = 16px | - | - |
| `h1` | `var(--text-2xl)` | `var(--font-weight-medium)` = 500 | 1.5 |
| `h2` | `var(--text-xl)` | 500 | 1.5 |
| `h3` | `var(--text-lg)` | 500 | 1.5 |
| `h4` | `var(--text-base)` | 500 | 1.5 |
| `label` | `var(--text-base)` | 500 | 1.5 |
| `button` | `var(--text-base)` | 500 | 1.5 |
| `input` | `var(--text-base)` | 400 | 1.5 |

In-component text sizing uses Tailwind classes: `text-xs`, `text-sm`, `text-2xl`, `text-3xl`, `text-4xl`, `text-[10px]`, `text-[11px]`.

### 4.4 Spacing & Sizing Conventions

| Element | Border Radius | Padding | Shadow |
|---|---|---|---|
| **Card** | `rounded-2xl` (1rem) | `p-5` to `p-8` | `shadow-sm` or `shadow-lg` |
| **Input** | `rounded-xl` (0.75rem) | `px-3 py-2.5` or `px-4 py-3` | None |
| **Button (primary)** | `rounded-xl` (0.75rem) | `py-3 px-4` (full-width) | None |
| **Badge/Pill** | `rounded-full` | `px-2 py-0.5` or `px-2.5 py-1` | None |
| **Icon Container** | `rounded-xl` or `rounded-lg` | Sized via `w-9 h-9` to `w-11 h-11` | None |
| **Avatar** | `rounded-full` | `w-8 h-8` (header) or `w-20 h-20` (profile) | None |
| **Modal** | `rounded-2xl` | `p-6` | `shadow-2xl` |
| **Toast** | `rounded-2xl` | `px-5 py-3` | `shadow-lg` |

### 4.5 Focus Outline Standard

**All** interactive elements use:
```
focus:outline-2 focus:outline-offset-2
style={{ outlineColor: "#5B9BD5" }}
```
This provides a consistent, visible 2px blue focus ring that meets WCAG 2.4.7 (Focus Visible).

---

## 5. Shared Components

### 5.1 Layout (`/src/app/components/Layout.tsx`)

**Purpose:** Authenticated page shell with header, navigation, and content outlet.

**Exports:** `export function Layout()`

**State:**
- `mobileOpen: boolean` - Controls mobile nav drawer visibility.
- `notifications: number` - Static value of `2` (not interactive).

**Structure:**
```
<div min-h-screen flex flex-col bg=#FEF0F5>
  <a> Skip to main content (sr-only, visible on focus) </a>
  <header> Sticky top header with gradient background
    <div> Max-width container (max-w-7xl)
      <div> Left: Mobile hamburger (lg:hidden) + University branding
      <nav> Center: Desktop nav links (hidden lg:flex)
      <div> Right: Bell notification + Avatar + Logout button
  </header>
  {mobileOpen && <div> Mobile nav overlay + drawer </div>}
  <main id="main-content"> <Outlet /> </main>
</div>
```

**Key Behaviors:**
- **Skip Link:** Hidden `<a>` element that becomes visible on keyboard focus, links to `#main-content`.
- **Mobile Menu:** Shows at `< lg` breakpoint. Hamburger button with `aria-expanded`, `aria-controls="mobile-nav"`. Clicking overlay or a nav link closes it.
- **Desktop Nav:** `NavLink` with `isActive` styling (blue bg + white text when active).
- **Notification Bell:** Displays count badge (`#E88FAB` bg) when `notifications > 0`. `aria-label` includes count.
- **User Avatar:** Shows initials "L" on `#E88FAB` background. Name "Monkey D. Luffy" visible at `sm:` breakpoint.
- **Logout:** Navigates to `/` (login page). Text "Log Out" hidden below `sm`.
- **No footer** - Footer was removed per design iteration.

**ARIA Roles:**
- `<header role="banner">`
- `<nav role="navigation" aria-label="Main navigation">`
- Mobile nav: `<div role="dialog" aria-modal="true" aria-label="Navigation menu">`
- `<main id="main-content" tabIndex={-1}>`

### 5.2 DesignNote (`/src/app/components/DesignNote.tsx`)

**Purpose:** Inline annotation badge showing which design principle is applied at a given location.

**Exports:** `export function DesignNote({ label, type, className })`

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | required | Text label (e.g., "H1: System Status") |
| `type` | `"heuristic" \| "wcag" \| "consistency"` | `"heuristic"` | Visual style category |
| `className` | `string` | `""` | Additional CSS classes |

**Visual Variants:**

| Type | Emoji | Background | Text | Border |
|---|---|---|---|---|
| `heuristic` | `📌` | `#FFE4EC` | `#B5295A` | `#F9A8C9` |
| `wcag` | `♿` | `#E0F0FF` | `#1E5FA8` | `#90CAF9` |
| `consistency` | `🎨` | `#FFF3E0` | `#B45309` | `#FCD34D` |

**Styling:** `inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-semibold tracking-wide`

---

## 6. Page Specifications

### 6.1 Login Page (`/src/app/pages/Login.tsx`)

**Route:** `/` (root)
**Export:** `export function LoginPage()`
**Full-page layout** (not wrapped in Layout).

#### State

```typescript
studentId: string          // Input value
password: string           // Input value
showPassword: boolean      // Toggle password visibility
errors: { studentId?: string; password?: string }  // Inline validation errors
isLoading: boolean         // Submit button loading state
loginStatus: "idle" | "loading" | "success" | "error"  // Overall form status
```

#### Validation Rules

| Field | Rule | Error Message |
|---|---|---|
| Student ID | Required | "Please enter your Student ID number." |
| Student ID | Must match `/^\d{8,10}$/` | "Student ID should be 8-10 digits (e.g., 20210001)." |
| Password | Required | "Please enter your password." |
| Password | Min length 6 | "Password must be at least 6 characters." |

#### Login Simulation

- `setTimeout` of 1200ms simulates API call.
- If `studentId === "00000000" && password === "wrong"` -> sets `loginStatus` to `"error"`.
- Otherwise -> sets `loginStatus` to `"success"`, then navigates to `/portal` after 800ms.

#### Visual Structure

```
Full-screen gradient background (#FADADD -> #EBF4FE -> #B3D9F7)
├── Skip link (to #login-form)
├── Header: "University of San Agustin" / "Student Portal - Sign In"
├── Status banners (loading spinner / success checkmark)
├── White card (rounded-2xl shadow-lg p-8)
│   ├── Student ID field (with hint text below)
│   ├── Password field (with show/hide toggle + forgot password link)
│   └── Sign In button (full-width, gradient primary)
│   ├── Separator (border-t)
│   └── "New student? Create your account here" link to /register
└── Help tip box (semi-transparent bg, info icon, contact email)
```

#### Input Behavior

- **Dynamic border colors:** Default `#F9A8C9` -> Valid (has value, no error) `#27AE60` -> Error `#C0392B`.
- **Dynamic background:** Default `#FAFAFA` -> Error `#FFF5F5`.
- **Student ID:** `inputMode="numeric"`, `autoComplete="username"`.
- **Password:** `autoComplete="current-password"`, toggle button with Eye/EyeOff icons.
- **Hint text** below Student ID: "Your 8-10 digit student ID from your enrollment form." (`id="studentId-hint"`).

---

### 6.2 Registration Page (`/src/app/pages/Register.tsx`)

**Route:** `/register`
**Export:** `export function RegisterPage()`
**Full-page layout** (not wrapped in Layout).

#### State

```typescript
step: 1 | 2 | 3                    // Current wizard step
showPassword: boolean               // Toggle password visibility
submitted: boolean                  // Success screen shown after submit
isLoading: boolean                  // Submit loading state
form: FormData                      // All form fields
errors: Partial<FormData>           // Field-level validation errors
```

#### Form Data Model

```typescript
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  program: string;       // Selected from dropdown
  yearLevel: string;     // Selected from dropdown ("1" - "5")
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}
```

#### 3-Step Wizard

| Step | Label | Fields |
|---|---|---|
| 1 | Personal Info | firstName*, lastName*, email*, studentId* |
| 2 | Academic Info | program* (dropdown), yearLevel* (dropdown) |
| 3 | Create Password | password*, confirmPassword*, agreeTerms* |

#### Step Progress Bar

- Visual: Numbered circles (1, 2, 3) with labels. Completed steps show "checkmark".
- Progress fill: `width = ((step - 1) / 2) * 100 + 50` percent.
- Gradient: `linear-gradient(90deg, #E88FAB, #5B9BD5)`.
- `role="progressbar"` with `aria-valuenow`, `aria-valuemin=1`, `aria-valuemax=3`.
- Text: "Step {n} of 3 - {label}".

#### Validation Rules per Step

**Step 1:**

| Field | Rule | Error Message |
|---|---|---|
| firstName | Required | "Please enter your first name." |
| lastName | Required | "Please enter your last name." |
| email | Required | "Please enter your email address." |
| email | Valid format | "Enter a valid email (e.g. juan@gmail.com)." |
| studentId | Required | "Please enter your Student ID." |
| studentId | `/^\d{8,10}$/` | "Student ID should be 8-10 digits." |

**Step 2:**

| Field | Rule | Error Message |
|---|---|---|
| program | Required | "Please select your program." |
| yearLevel | Required | "Please select your year level." |

**Step 3:**

| Field | Rule | Error Message |
|---|---|---|
| password | Required | "Please create a password." |
| password | Min 8 chars | "Password must be at least 8 characters long." |
| password | Has uppercase | "Include at least one uppercase letter (e.g. A, B, C)." |
| confirmPassword | Required | "Please confirm your password." |
| confirmPassword | Must match password | "Passwords do not match. Please re-enter." |
| agreeTerms | Must be checked | "You must agree to the terms to continue." |

#### Password Strength Indicators

Three inline requirement checks displayed below password field:
1. "At least 8 characters" - green dot when `password.length >= 8`
2. "One uppercase letter" - green dot when `/[A-Z]/.test(password)`
3. "One number" - green dot when `/\d/.test(password)`

Dot color: Met = `#27AE60`, Not met = `#D1D5DB`.

#### Available Programs

```typescript
const PROGRAMS = [
  "BS Computer Science",
  "BS Information Technology",
  "BS Business Administration",
  "BS Accountancy",
  "BS Nursing",
  "AB Communication",
  "BS Education",
  "BS Engineering",
];
```

#### Year Level Options

1st Year, 2nd Year, 3rd Year, 4th Year, 5th Year (values: "1" through "5").

#### Navigation Buttons

- **Back button** (steps 2-3): Secondary style, `borderColor: #F9A8C9`, `color: #B5295A`, text "Back" with left arrow.
- **Continue button** (steps 1-2): Primary gradient, text "Continue" with right arrow.
- **Create Account button** (step 3): Primary gradient, disabled during loading ("Creating account...").

#### Success Screen

Shown when `submitted === true`:
- Green checkmark circle icon.
- "Account Created!" heading.
- "Welcome, {firstName}!" message.
- "A confirmation email has been sent to {email}." note.
- "Go to Sign In" button navigates to `/`.

#### Design Notes Displayed

```
H1: System Status (Progress)
H5: Error Prevention
H9: Error Recovery
WCAG 1.4.3: Contrast
```

---

### 6.3 Dashboard Page (`/src/app/pages/Dashboard.tsx`)

**Route:** `/portal` (index child of Layout)
**Export:** `export function DashboardPage()`

#### Visual Structure

```
<div space-y-6>
  ├── Page Header: "Good morning, Luffy! wave" + today's date + semester info
  ├── Quick Stats Section (3 cards in responsive grid)
  ├── Main Grid (lg:grid-cols-3)
  │   ├── Enrolled Courses (lg:col-span-2) - 3 course cards
  │   └── Announcements sidebar - 2 announcement cards
  └── Quick Actions (4 shortcut cards in responsive grid)
</div>
```

#### Quick Stats Data

```typescript
const quickStats = [
  { label: "Current GPA", value: "1.50", sub: "", icon: TrendingUp, color: "#E88FAB", bg: "#FFE4EC" },
  { label: "Enrolled Units", value: "8", sub: "of 21 allowed", icon: BookOpen, color: "#5B9BD5", bg: "#EBF4FE" },
  { label: "Classes Today", value: "2", sub: "CS 223 & GE 8", icon: Calendar, color: "#27AE60", bg: "#E6FAF0" },
];
```

#### Enrolled Courses (Dashboard view)

```typescript
const enrolledCourses = [
  { id: 1, code: "CS 223", name: "Human-Computer Interaction", units: 3, schedule: "MWF 9:00-10:00 AM", room: "Room 302", status: "ongoing" },
  { id: 2, code: "CS 221", name: "Object Oriented Programming", units: 3, schedule: "TTH 10:30-12:00 PM", room: "Room 210", status: "ongoing" },
  { id: 3, code: "GE 8", name: "Ethics", units: 2, schedule: "MWF 2:00-4:00 PM", room: "Room 067", status: "ongoing" },
];
```

Each course card shows: BookOpen icon, "{code} - {name}", Clock icon + schedule, pin emoji + room, units badge.

#### Announcements

```typescript
const announcements = [
  { id: 1, type: "info", title: "Enrollment for 2nd Semester is now open", date: "Mar 10, 2026", body: "..." },
  { id: 3, type: "success", title: "Tuition payment received", date: "Mar 5, 2026", body: "..." },
];
```

Announcement styles by type:

| Type | Icon | Badge Label | Background | Border |
|---|---|---|---|---|
| `info` | Bell | "Info" | `#EBF4FE` | `#90CAF9` |
| `warning` | AlertCircle | "Action Needed" | `#FFFBEB` | `#FCD34D` |
| `success` | CheckCircle2 | "Confirmed" | `#E6FAF0` | `#86EFAC` |

#### Quick Actions

| Label | Icon | Route | Color | Background |
|---|---|---|---|---|
| Register for Classes | BookOpen | `/portal/courses` | `#5B9BD5` | `#EBF4FE` |
| View My Grades | GraduationCap | `/portal/grades` | `#E88FAB` | `#FFE4EC` |
| Update Profile | CheckCircle2 | `/portal/profile` | `#27AE60` | `#E6FAF0` |
| Class Schedule | Calendar | `/portal/courses` | `#B45309` | `#FEF3C7` |

Each card: `rounded-2xl border-2` white bg, icon in colored container, label text below.

#### Date Display

```typescript
const today = new Date().toLocaleDateString("en-PH", {
  weekday: "long", year: "numeric", month: "long", day: "numeric"
});
```

---

### 6.4 My Courses Page (`/src/app/pages/Courses.tsx`)

**Route:** `/portal/courses`
**Export:** `export function CoursesPage()`

#### State

```typescript
enrolled: Course[]                           // Currently enrolled courses (mutable)
search: string                               // Search filter (defined but search UI removed)
confirmDrop: Course | null                   // Course pending drop confirmation
confirmAdd: Course | null                    // Course pending add confirmation
recentlyDropped: Course | null               // Last dropped course (for undo)
toast: { message: string; type: "success" | "error" } | null  // Toast notification
```

#### Course Interface

```typescript
interface Course {
  id: number;
  code: string;
  name: string;
  units: number;
  schedule: string;
  room: string;
  enrolled: number;     // Current enrollment count
  capacity: number;     // Max capacity
  prereq?: string;      // Optional prerequisite (not displayed)
}
```

#### Initial Enrolled Courses

```typescript
[
  { id: 1, code: "CS 223", name: "Human-Computer Interaction", units: 3, schedule: "MWF 9:00-10:00 AM", room: "Room 302", enrolled: 25, capacity: 30 },
  { id: 2, code: "CS 221", name: "Object Oriented Programming", units: 3, schedule: "TTH 10:30-12:00 PM", room: "Room 210", enrolled: 28, capacity: 30 },
  { id: 3, code: "GE 8", name: "Ethics", units: 2, schedule: "MWF 2:00-4:00 PM", room: "Room 067", enrolled: 22, capacity: 35 },
]
```

#### Available Courses (to add)

```typescript
[
  { id: 10, code: "CS 677", name: "Operating Systems", units: 3, schedule: "MWF 8:00-9:00 AM", room: "Room 301", enrolled: 28, capacity: 35 },
  { id: 11, code: "CS 225", name: "Database Management", units: 3, schedule: "TTH 1:00-2:30 PM", room: "Room 202", enrolled: 30, capacity: 35 },
  { id: 12, code: "CS 251", name: "Software Engineering", units: 3, schedule: "MWF 2:00-3:00 PM", room: "Room 410", enrolled: 20, capacity: 30 },
  { id: 14, code: "CS 213", name: "Discrete Mathematics", units: 3, schedule: "MWF 11:00 AM-12:00 PM", room: "Room 205", enrolled: 15, capacity: 30 },
]
```

#### Business Logic

- **Max units:** 20 per semester.
- **Add button disabled when:** Course is full (`enrolled >= capacity`) OR adding would exceed 20 units.
- **Drop confirmation:** Modal dialog with "Cancel" (autoFocus) and "Yes, Drop Class" buttons.
- **Add confirmation:** Modal dialog showing new total units.
- **Undo:** After dropping, an "Undo" button appears in the toast for 8 seconds.
- **Toast:** Auto-dismisses after 4 seconds. Fixed position at bottom center.
- **Available list filtering:** Hides already-enrolled courses. Search filters by code or name (though search input UI was removed from the rendered JSX, the filter logic remains).

#### Units Progress Bar

- `role="progressbar"`, `aria-valuenow={totalUnits}`, `aria-valuemax={20}`.
- Normal gradient: `#E88FAB -> #5B9BD5`.
- Warning gradient (>18 units): `#F59E0B -> #EF4444`.
- At 20 units: Shows warning alert text.

#### Visual Structure

```
<div space-y-6>
  ├── Header: "My Classes" + semester + "{totalUnits} / 20 units enrolled"
  ├── Units Progress Bar (full-width card)
  ├── Toast notification (fixed bottom center, conditional)
  ├── Enrolled Classes Section
  │   ├── Empty state (dashed border + illustration when 0 enrolled)
  │   └── List of enrolled course cards with Drop button
  ├── Add More Classes Section
  │   └── List of available course cards with Add button
  ├── Drop Confirmation Modal (conditional)
  └── Add Confirmation Modal (conditional)
</div>
```

#### Empty State

When no courses enrolled:
- Dashed border (`border: 2px dashed #F9A8C9`).
- BookOpen icon in pink.
- "You are not enrolled in any classes yet."
- "Browse available classes below to get started."

---

### 6.5 Grades Page (`/src/app/pages/Grades.tsx`)

**Route:** `/portal/grades`
**Export:** `export function GradesPage()`

#### State

```typescript
openSemesters: Set<number>  // Indices of expanded semester accordions (default: Set([0]))
```

#### Grade Interface

```typescript
interface Grade {
  code: string;
  name: string;
  units: number;
  prelim: number | null;
  midterm: number | null;
  finals: number | null;
  finalGrade: number | null;
  remarks: string;           // "In Progress" | "Passed" | "Failed"
}
```

#### Semester Data (3 semesters)

**1st Semester, A.Y. 2025-2026 (Current):**
| Code | Name | Units | Prelim | Midterm | Finals | Final | Remarks |
|---|---|---|---|---|---|---|---|
| CS 223 | Human-Computer Interaction | 3 | 1.00 | 1.25 | null | null | In Progress |
| CS 221 | Data Structures 2 | 3 | 1.25 | 1.25 | null | null | In Progress |
| CS 210 | Programming Languages | 3 | 1.50 | 1.60 | null | null | In Progress |
| GE 8 | Ethics | 2 | 1.25 | 1.25 | null | null | In Progress |

**2nd Semester, A.Y. 2024-2025:**
| Code | Name | Units | Prelim | Midterm | Finals | Final | Remarks |
|---|---|---|---|---|---|---|---|
| CS 200 | Algorithms & Complexity | 3 | 1.25 | 1.50 | 1.50 | 1.50 | Passed |
| CS 201 | Object-Oriented Programming | 3 | 1.00 | 1.25 | 1.00 | 1.00 | Passed |
| Math 101 | Calculus 2 | 3 | 1.75 | 2.00 | 2.25 | 2.25 | Passed |
| GE 101 | Komunikasyon sa Filipino | 3 | 1.50 | 1.50 | 1.75 | 1.75 | Passed |
| PE 102 | Physical Education 2 | 2 | 1.00 | 1.00 | 1.50 | 1.50 | Passed |

**1st Semester, A.Y. 2024-2025:**
| Code | Name | Units | Prelim | Midterm | Finals | Final | Remarks |
|---|---|---|---|---|---|---|---|
| CS 100 | Introduction to Computing | 3 | 1.50 | 1.75 | 1.75 | 1.75 | Passed |
| CS 101 | Computer Programming 1 | 3 | 1.25 | 1.25 | 1.25 | 1.25 | Passed |
| Math 100 | Calculus 1 | 3 | 2.25 | 2.50 | 2.25 | 2.25 | Passed |
| GE 100 | Purposive Communication | 3 | 1.50 | 1.50 | 1.75 | 1.75 | Passed |

#### Computed Values

- **Cumulative GWA:** Weighted average of all completed (non-null finalGrade) grades. Formula: `sum(units * finalGrade) / sum(units)`.
- **Current Midterm Avg:** Simple average of midterm grades in current semester (index 0) where midterm is not null.
- **Total Units Completed:** Sum of units for all completed grades.

#### Grade Color Coding

```typescript
function gradeToColor(grade: number | null): { bg: string; text: string } {
  if (grade === null) return { bg: "#F3F4F6", text: "#6B7280" };
  if (grade <= 1.25) return { bg: "#DCFCE7", text: "#166534" };  // Green
  if (grade <= 1.75) return { bg: "#EBF4FE", text: "#1E5FA8" };  // Blue
  if (grade <= 2.25) return { bg: "#FEF9C3", text: "#854D0E" };  // Yellow
  if (grade <= 3.00) return { bg: "#FEE2E2", text: "#991B1B" };  // Red
  return { bg: "#FEE2E2", text: "#991B1B" };                     // Red (5.00)
}
```

#### Grade Label Mapping

```typescript
function gradeToLabel(grade: number | null): string {
  if (grade === null) return "Not yet posted";
  if (grade === 1.00) return "Excellent";
  if (grade <= 1.25) return "Very Good";
  if (grade <= 1.50) return "Good";
  if (grade <= 1.75) return "Above Average";
  if (grade <= 2.00) return "Average";
  if (grade <= 2.25) return "Below Average";
  if (grade <= 2.50) return "Fair";
  if (grade <= 3.00) return "Passing";
  return "Failed";
}
```

#### Grade Scale Legend

Displayed as a horizontal row of pills:
- 1.00 = Excellent (green)
- 1.25-1.50 = Very Good (blue)
- 1.75-2.00 = Average (yellow)
- 2.25-3.00 = Passing (red)
- 5.00 = Failed (gray)

#### Semester Accordion

Each semester is a collapsible section:
- **Header button:** `aria-expanded`, `aria-controls={grades-panel-{idx}}`. Shows TrendingUp icon, semester name, subject count, unit count, GWA (if available).
- **Current semester badge:** Blue pill "Current" on index 0.
- **Table:** Full `<table>` with `<thead>` and `<tbody>`. Columns: Subject, Units, Prelim, Midterm, Finals, Final Grade, Remarks.
- **Null values:** Displayed as em-dash "-" for period grades, "Not yet posted" for finals, "In progress" for final grade.
- **Alternating rows:** Even `#FFFFFF`, Odd `#FAFAFA`.
- **Remarks badge:** "Passed" = green, "In Progress" = blue, "Failed" = red.

#### Visual Structure

```
<div space-y-6>
  ├── Header: "Grades" + description + DesignNote
  ├── GPA Summary Cards (3 cards: Cumulative GWA, Midterm Avg, Units Completed)
  ├── Grade Scale Legend (horizontal pills)
  └── Semester Accordions (3 sections, first open by default)
      └── Each: Button header -> Expandable table
</div>
```

---

### 6.6 Profile Page (`/src/app/pages/Profile.tsx`)

**Route:** `/portal/profile`
**Export:** `export function ProfilePage()`

#### State

```typescript
form: ProfileForm           // Editable form values
original: ProfileForm       // Original values (for reset comparison)
errors: Partial<ProfileForm>  // Validation errors
saved: boolean              // Success banner shown after save
isLoading: boolean          // Save button loading state
hasChanges: boolean         // Tracks if form differs from original
```

#### Profile Form Interface

```typescript
interface ProfileForm {
  firstName: string;         // Default: "Luffy"
  lastName: string;          // Default: "" (empty)
  email: string;             // Default: "luffy@usa.edu.ph"
  phone: string;             // Default: "09171234567"
  address: string;           // Default: "Tigbauan, Iloilo"
  emergencyContact: string;  // Default: "Hazel Marie Garganera"
  emergencyPhone: string;    // Default: "09181234567"
}
```

#### Validation Rules

| Field | Rule | Error Message |
|---|---|---|
| firstName | Required | "First name is required." |
| lastName | Required | "Last name is required." |
| email | Required | "Email is required." |
| email | Valid format | "Please enter a valid email address." |
| phone | If provided, must match `/^(09|\+639)\d{9}$/` | "Enter a valid Philippine mobile number (e.g. 09171234567)." |
| emergencyPhone | If provided, must match `/^(09|\+639)\d{9}$/` | "Enter a valid Philippine mobile number." |

#### Save Simulation

- `setTimeout` of 1200ms.
- On completion: `saved = true`, `hasChanges = false`.

#### Visual Structure

```
<div space-y-6 max-w-2xl>
  ├── Header: "My Profile" + description
  ├── Success Banner (conditional, dismissible)
  ├── Unsaved Changes Warning (conditional)
  ├── Profile Avatar Card
  │   ├── Gradient avatar circle with initials "JD"
  │   ├── Camera button overlay
  │   └── Name, Student ID, Program/Year
  ├── <form>
  │   ├── Personal Information Section (white card)
  │   │   ├── First Name* / Last Name* (2-column grid)
  │   │   ├── Email Address*
  │   │   ├── Mobile Number
  │   │   └── Address
  │   ├── Emergency Contact Section (white card)
  │   │   └── Contact Name / Contact Number (2-column grid)
  │   ├── Academic Information Section (read-only, blue bg #EBF4FE)
  │   │   └── Student ID / Program / Year Level (3-column grid)
  │   └── Action Buttons
  │       ├── Discard Changes (secondary, disabled when no changes)
  │       └── Save Changes (primary, disabled when no changes or loading)
  └── </form>
</div>
```

#### Read-Only Academic Info

```typescript
[
  { label: "Student ID", value: "20210001" },
  { label: "Program", value: "BS Computer Science" },
  { label: "Year Level", value: "2nd Year" },
]
```

Displayed on blue background `#EBF4FE` with `#90CAF9` border to indicate non-editable status.

---

## 7. Data Models & Mock Data

### 7.1 Summary of All Mock Data

| Data Set | Location | Record Count |
|---|---|---|
| Nav items | Layout.tsx | 4 items |
| Enrolled courses (Dashboard) | Dashboard.tsx | 3 courses |
| Announcements | Dashboard.tsx | 2 items |
| Quick stats | Dashboard.tsx | 3 stats |
| Quick actions | Dashboard.tsx | 4 actions |
| Enrolled courses (Courses) | Courses.tsx | 3 courses (mutable) |
| Available courses | Courses.tsx | 4 courses |
| Semester grades | Grades.tsx | 3 semesters, 13 total grades |
| Profile data | Profile.tsx | 1 student record |
| Programs list | Register.tsx | 8 programs |

### 7.2 Data Inconsistency Notes

> **IMPORTANT for agents:** The following data inconsistencies exist between pages:

1. **Course name mismatch:** Dashboard and Courses both have `id: 2` as "Object Oriented Programming", but Grades lists "Data Structures 2" for `CS 221`. These are independent mock datasets.
2. **GPA mismatch:** Dashboard quick stat shows "Current GPA: 1.50", but the Grades page computes cumulative GWA dynamically from all completed grades (which yields approximately 1.66).
3. **Units mismatch:** Dashboard shows "8 of 21 allowed", Courses page enforces max "20 units".
4. **Avatar initials mismatch:** Layout header shows "L" (for Luffy), Profile page avatar shows "JD" (presumably for a different student).
5. **Profile name:** Header shows "Monkey D. Luffy", Profile form shows firstName "Luffy" with empty lastName.

These inconsistencies are cosmetic issues in mock data only and do not affect functionality.

---

## 8. Nielsen's Usability Heuristics Implementation

The portal implements **7 of Nielsen's 10 Usability Heuristics** (minimum requirement was 5):

### H1: Visibility of System Status

| Location | Implementation |
|---|---|
| Login page | Loading spinner ("Signing you in, please wait..."), success banner ("Login successful! Redirecting...") with `role="status" aria-live="polite"` |
| Registration | Step progress bar with numbered circles, progress fill, "Step {n} of 3" text, `role="progressbar"` |
| Dashboard | Quick stats cards showing GPA, enrolled units, classes today |
| Courses | Units progress bar with color change at >18 units, toast notifications for add/drop actions |
| Profile | "Your profile has been updated successfully!" success banner, "You have unsaved changes" warning |
| Layout | Notification bell badge with unread count |

### H2: Match Between System and the Real World

| Location | Implementation |
|---|---|
| Dashboard | "Your Classes This Semester" (not "Enrolled Course Records"), "Good morning, Luffy!" greeting |
| Grades | Grade scale legend with familiar labels (Excellent, Very Good, Passing), grade-to-label mapping |
| All forms | Plain language labels ("First Name", "Mobile Number", not "fname", "tel") |
| Courses | "My Classes" heading, "Drop" / "Add" verbs matching real enrollment language |

### H3: User Control and Freedom

| Location | Implementation |
|---|---|
| Courses | Drop confirmation modal with Cancel button (autoFocused), Undo action in toast (8-second window) |
| Courses | Add confirmation modal with Cancel option |
| Registration | Back button on steps 2-3 to return to previous step |
| Profile | "Discard Changes" button to reset form to original values |
| Login | "Forgot password?" link available |

### H5: Error Prevention

| Location | Implementation |
|---|---|
| Registration (Step 2) | Dropdown selects for program and year level prevent freeform input errors |
| Courses | Add button disabled when course is full or adding would exceed 20 units |
| Login | `inputMode="numeric"` on Student ID constrains keyboard on mobile |
| All forms | `noValidate` on forms to use custom validation instead of browser defaults |
| Courses | Max units warning with explicit message when at 20 units |

### H6: Recognition Rather Than Recall

| Location | Implementation |
|---|---|
| Login | Placeholder text "e.g. 20210001" shows expected format |
| Registration | Placeholders on all fields (e.g., "e.g. Juan", "e.g. juan@gmail.com") |
| Login | Hint text below Student ID: "Your 8-10 digit student ID from your enrollment form." |
| Registration | Info box: "Your program and year level determine which classes you can enroll in." |

### H8: Aesthetic and Minimalist Design

| Location | Implementation |
|---|---|
| Dashboard | Quick action shortcuts provide direct paths to common tasks |
| All pages | Clean card-based layout with generous whitespace |
| Layout | Compact navigation with icons + labels |
| Profile | Read-only academic info visually separated from editable fields |

### H9: Help Users Recognize, Diagnose, and Recover from Errors

| Location | Implementation |
|---|---|
| All forms | Specific error messages with AlertCircle icon, `role="alert"` for screen readers |
| Login | "Student ID should be 8-10 digits (e.g., 20210001)" — includes example |
| Registration | "Include at least one uppercase letter (e.g. A, B, C)" — actionable guidance |
| Registration | "Passwords do not match. Please re-enter." — explains what went wrong |
| All inputs | Error state: red border `#C0392B` + pink error background `#FFF5F5` |

### H10: Help and Documentation

| Location | Implementation |
|---|---|
| Login | Help tip box with Info icon: "Use the Student ID from your enrollment form. If you have trouble logging in, contact registrar@usa.edu.ph" |
| Registration | Step-specific info notes |
| Grades | Grade scale legend explaining the grading system |

---

## 9. WCAG Accessibility Guidelines Implementation

The portal implements **4 WCAG guidelines** (minimum requirement was 2):

### WCAG 1.3.1: Info and Relationships (Level A)

| Implementation | Details |
|---|---|
| Semantic HTML | Proper use of `<header>`, `<nav>`, `<main>`, `<section>`, `<form>`, `<table>`, `<fieldset>`, `<legend>` |
| Table structure | Grades table uses `<thead>`, `<th scope="col">`, `<tbody>`, `<tr>`, `<td>` |
| Form labels | Every input has an associated `<label htmlFor="...">` or `aria-label` |
| `aria-describedby` | Inputs reference hint text and error messages |
| `aria-required="true"` | On all required fields |
| `aria-invalid` | Set to `true` when validation errors are present |
| `role="list"` / `role="listitem"` | On course lists and announcement lists |
| `role="progressbar"` | On progress bars with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` |
| `role="dialog" aria-modal="true"` | On confirmation modals and mobile nav |
| `role="note"` | On informational boxes |
| `role="separator"` | On visual dividers |
| `role="banner"` | On header element |

### WCAG 1.4.3: Contrast (Minimum) (Level AA)

| Text Context | Foreground | Background | Approximate Ratio |
|---|---|---|---|
| Heading on white card | `#1A1A2E` | `#FFFFFF` | ~16.5:1 |
| Body text on white | `#4B5563` | `#FFFFFF` | ~7.5:1 |
| Muted text on white | `#6B7280` | `#FFFFFF` | ~5.0:1 |
| Error text on error bg | `#C0392B` | `#FFF5F5` | ~5.7:1 |
| Success text on success bg | `#166534` | `#E6FAF0` | ~7.2:1 |
| Active nav (white on blue) | `#FFFFFF` | `#5B9BD5` | ~3.6:1 |
| Labels on white | `#2D3556` | `#FFFFFF` | ~12.0:1 |

### WCAG 2.1.1: Keyboard (Level A)

| Implementation | Details |
|---|---|
| Skip link | "Skip to main content" on Layout, "Skip to login form" on Login. `sr-only` by default, visible on focus with blue background. |
| Focus outlines | All interactive elements have `focus:outline-2 focus:outline-offset-2` with `#5B9BD5` color |
| Tab order | Natural DOM order. Forms use standard tab navigation. |
| Button keyboard activation | All buttons use native `<button>` elements (Enter/Space activation built-in) |
| Link keyboard activation | All links use native `<a>` or `<Link>` elements |
| Modal focus | `autoFocus` on Cancel button in confirmation modals |
| `aria-expanded` | On mobile menu toggle button and semester accordion buttons |
| `aria-controls` | Mobile menu button references `mobile-nav`, accordion buttons reference `grades-panel-{idx}` |

### WCAG 2.4.7: Focus Visible (Level AA)

| Implementation | Details |
|---|---|
| Consistent focus style | `outline: 2px solid #5B9BD5` with `outline-offset: 2px` on every focusable element |
| Links | `focus:outline-2 focus:outline-offset-1 rounded` |
| Buttons | `focus:outline-2 focus:outline-offset-2` |
| Inputs | Custom focus via border color change (no outline-none without replacement) |

### WCAG 4.1.2: Name, Role, Value (Level A)

| Implementation | Details |
|---|---|
| `aria-label` on icon-only buttons | "Open/Close navigation menu", "Show/Hide password", "Notifications - {n} unread", "Change profile photo", "Log out of student portal", "Dismiss success message" |
| `aria-label` on sections | "Quick statistics", "Your enrolled classes", "Announcements and notifications", "Quick actions", "Add classes to your schedule", etc. |
| `aria-label` on progress bars | "Step {n} of 3: {label}", "{n} of 20 units enrolled" |
| `aria-label` on badges | "{n} units" on course unit badges |
| `aria-hidden="true"` on decorative icons | All lucide-react icons that are purely decorative |
| `aria-live="polite"` | On status messages, toasts, loading states |

---

## 10. Consistency & Standards Principles

### 10.1 Visual Consistency

| Element | Standard |
|---|---|
| **Primary button** | `rounded-xl`, gradient `#5B9BD5 -> #7BBCF0`, white text, full-width in forms |
| **Secondary/Cancel button** | `rounded-xl`, transparent bg, `border-2 #F9A8C9`, text `#B5295A` |
| **Destructive button** | `rounded-xl` or `rounded-lg`, red `#C0392B` bg or border |
| **Disabled button** | `disabled:opacity-60 disabled:cursor-not-allowed` or `disabled:opacity-40` |
| **Input fields** | `rounded-xl`, `border-2 #F9A8C9`, bg `#FAFAFA`, consistent padding `px-3 py-2.5` or `px-4 py-3` |
| **Cards/Sections** | `rounded-2xl`, `shadow-sm`, bg `#FFFFFF` |
| **Error messages** | AlertCircle icon + red text `#C0392B`, `role="alert"` |
| **Success banners** | CheckCircle2 icon + green bg `#E6FAF0` + border `#86EFAC` |
| **Warning banners** | Info icon + yellow bg `#FFFBEB` + border `#FCD34D` |
| **Info banners** | Info/Bell icon + blue bg `#EBF4FE` + border `#90CAF9` |
| **Badges/Pills** | `rounded-full`, `text-xs font-semibold`, semantic bg/text colors |

### 10.2 Behavioral Consistency

| Pattern | Standard |
|---|---|
| **Form submission** | `noValidate` + custom validation -> inline errors with `role="alert"` -> loading state -> success feedback |
| **Simulated API calls** | `setTimeout` of 1200-1500ms |
| **Destructive actions** | Always require confirmation modal before executing |
| **Navigation** | `useNavigate()` for programmatic nav, `<Link>` / `<NavLink>` for user-initiated nav |
| **Active nav indicator** | Blue background `#5B9BD5` + white text on active `<NavLink>` |
| **Required field marker** | Red asterisk `*` with `aria-label="required"` on `<span>` |
| **Password visibility** | Eye/EyeOff toggle button inside input, consistent across Login and Registration |

### 10.3 Labeling Conventions

| Context | Convention |
|---|---|
| Page headings | Title case, concise ("Grades", "My Classes", "My Profile") |
| Form labels | Title case, no colons ("First Name", "Email Address") |
| Buttons | Action verbs ("Sign In", "Save Changes", "Create Account", "Continue", "Drop", "Add") |
| Links | Descriptive text ("Create your account here", "Sign in here", "View all") |
| Error messages | Start with "Please..." or describe the issue specifically |
| Placeholder text | "e.g. {example}" format consistently |

---

## 11. Interaction Patterns

### 11.1 Form Submission Flow

```
User fills form -> User clicks submit
  -> validate() runs synchronously
  -> If errors: setErrors(), return (no API call)
  -> If valid: setIsLoading(true), clear errors
     -> setTimeout simulates API call
     -> On "success": Show success state, navigate or update UI
     -> On "error": Show error state (only Login has this path)
```

### 11.2 Inline Validation

- **On change:** Clears the specific field's error when the user types.
- **On submit:** Validates all fields at once, sets all errors simultaneously.
- **No on-blur validation** - Errors only appear after form submission attempt.

### 11.3 Modal Pattern

```
User clicks trigger button -> setState(targetItem)
  -> Modal renders (fixed inset-0 z-50 bg-black/30)
     -> Dialog card (rounded-2xl shadow-2xl max-w-sm)
     -> Cancel button (autoFocus) + Confirm button
  -> Cancel: setState(null), modal closes
  -> Confirm: Execute action, setState(null), show toast
```

### 11.4 Accordion Pattern (Grades)

- State: `Set<number>` of open indices.
- Toggle: If open, remove from set; if closed, add to set.
- Multiple can be open simultaneously.
- Default: Index 0 (current semester) open.
- `aria-expanded` on trigger button, `aria-controls` references panel `id`.

### 11.5 Toast Notification Pattern

```
Action completes -> showToast(message, type)
  -> Toast renders fixed at bottom center (-translate-x-1/2)
  -> role="status" aria-live="polite"
  -> Auto-dismiss after 4000ms (setTimeout -> setToast(null))
  -> Optional Undo button (for drop actions, 8000ms window)
```

### 11.6 Mobile Navigation Pattern

```
User taps hamburger (lg:hidden)
  -> setMobileOpen(true)
  -> Overlay (bg-black/20) + Drawer (w-72, gradient bg)
  -> NavLinks with ChevronRight icons
  -> Click overlay or nav item -> setMobileOpen(false)
```

---

## 12. Responsive Design Strategy

### 12.1 Breakpoints Used

| Breakpoint | Tailwind Class | Usage |
|---|---|---|
| Default (mobile-first) | No prefix | Single column, stacked layouts |
| `sm:` (640px) | `sm:` | 2-column grids, show university name, show logout text |
| `lg:` (1024px) | `lg:` | Desktop nav visible, mobile hamburger hidden, 3-column dashboard grid |

### 12.2 Page-Specific Responsive Behavior

| Page | Mobile | Desktop |
|---|---|---|
| **Layout** | Hamburger menu, avatar initial only, no logout text | Horizontal nav, full name shown, logout text shown |
| **Dashboard** | Single column stats, stacked grid | 3-column stats, 2:1 grid (courses:announcements) |
| **Dashboard Quick Actions** | 2-column grid | 4-column grid |
| **Courses** | Stacked card content, full-width buttons | Side-by-side course info + actions |
| **Grades** | Horizontal scroll on table, step labels hidden | Full table visible, step labels shown |
| **Profile** | Single column form fields, stacked buttons | 2-column name fields, 3-column academic info |
| **Login/Register** | `max-w-md` / `max-w-lg` centered | Same, naturally responsive within max-width |

### 12.3 Responsive Utilities Used

- `hidden sm:block` / `hidden sm:inline` - Hide on mobile, show on sm+
- `hidden lg:flex` - Desktop-only nav
- `lg:hidden` - Mobile-only hamburger
- `flex-col sm:flex-row` - Stack on mobile, row on desktop
- `grid-cols-1 sm:grid-cols-2` / `sm:grid-cols-3` / `sm:grid-cols-4` - Responsive grids
- `lg:grid-cols-3` - Dashboard main grid
- `lg:col-span-2` - Dashboard courses section spans 2 of 3 columns
- `overflow-x-auto` - Horizontal scroll for wide tables on mobile

---

## 13. Dependencies & Package Manifest

### 13.1 Core Dependencies (Actually Used)

| Package | Version | Usage |
|---|---|---|
| `react` | 18.3.1 | UI framework (peer dependency) |
| `react-dom` | 18.3.1 | DOM rendering (peer dependency) |
| `react-router` | 7.13.0 | Client-side routing (createBrowserRouter, RouterProvider, NavLink, Link, useNavigate, Outlet) |
| `lucide-react` | 0.487.0 | Icon library (LayoutDashboard, BookOpen, GraduationCap, User, LogOut, Menu, X, Bell, ChevronRight, Eye, EyeOff, AlertCircle, CheckCircle2, Info, Search, Plus, AlertTriangle, Clock, Users, Undo2, TrendingUp, ChevronDown, ChevronUp, Calendar, Camera, Save, ChevronLeft) |
| `tailwindcss` | 4.1.12 | Utility-first CSS (dev dependency) |
| `@tailwindcss/vite` | 4.1.12 | Tailwind Vite plugin |
| `tw-animate-css` | 1.3.8 | Animation utilities for Tailwind |
| `vite` | 6.3.5 | Build tool |
| `@vitejs/plugin-react` | 4.7.0 | React plugin for Vite |

### 13.2 Installed but Unused Dependencies

The following packages are installed in `package.json` but are **not imported or used** in any page or component code. They exist because the project includes a full shadcn/ui component library in `/src/app/components/ui/`:

`@emotion/react`, `@emotion/styled`, `@mui/icons-material`, `@mui/material`, `@popperjs/core`, `@radix-ui/*` (17 packages), `class-variance-authority`, `clsx`, `cmdk`, `date-fns`, `embla-carousel-react`, `input-otp`, `motion`, `next-themes`, `react-day-picker`, `react-dnd`, `react-dnd-html5-backend`, `react-hook-form`, `react-popper`, `react-resizable-panels`, `react-responsive-masonry`, `react-slick`, `recharts`, `sonner`, `tailwind-merge`, `vaul`

### 13.3 shadcn/ui Components Available

The `/src/app/components/ui/` directory contains 47 pre-installed shadcn/ui components. None are currently used in the portal pages, but they are available for extension:

`accordion`, `alert-dialog`, `alert`, `aspect-ratio`, `avatar`, `badge`, `breadcrumb`, `button`, `calendar`, `card`, `carousel`, `chart`, `checkbox`, `collapsible`, `command`, `context-menu`, `dialog`, `drawer`, `dropdown-menu`, `form`, `hover-card`, `input-otp`, `input`, `label`, `menubar`, `navigation-menu`, `pagination`, `popover`, `progress`, `radio-group`, `resizable`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `slider`, `sonner`, `switch`, `table`, `tabs`, `textarea`, `toggle-group`, `toggle`, `tooltip`, `use-mobile.ts`, `utils.ts`

---

## 14. Known Constraints & Edge Cases

### 14.1 No Real Backend

- All data is hardcoded. Changes (add/drop courses, edit profile) are lost on page refresh.
- Login accepts any valid input except the explicit error case (`00000000` + `wrong`).
- No JWT tokens, session management, or route guards.

### 14.2 No Route Protection

- Users can navigate directly to `/portal` without logging in.
- There is no redirect logic for unauthenticated users.

### 14.3 Search Input Removed from Courses

- The `search` state variable and filter logic exist in `Courses.tsx`, but the search `<input>` element was removed from the JSX. The filter still works if `search` were set programmatically, but there's no UI for it.

### 14.4 Keyboard Trap Risk in Modals

- The confirmation modals do not implement focus trapping. Tab can escape to elements behind the modal overlay.
- The mobile nav drawer similarly lacks focus trapping.

### 14.5 `autoComplete` Attribute Usage

| Field | autoComplete Value |
|---|---|
| Login Student ID | `username` |
| Login Password | `current-password` |
| Registration first name | `given-name` |
| Registration last name | `family-name` |
| Registration email | `email` |
| Registration password | `new-password` |
| Registration confirm password | `new-password` |
| Profile first name | `given-name` |
| Profile last name | `family-name` |
| Profile email | `email` |
| Profile phone | `tel` |
| Profile address | `street-address` |
| Emergency contacts | `off` |

### 14.6 Color-Only Information

- Grade color coding uses background + text color to indicate grade quality. The grade scale legend and text labels (`gradeToLabel`) provide non-color alternatives, partially addressing WCAG 1.4.1 (Use of Color).
- The units progress bar color change (normal -> warning) is accompanied by a text warning at 20 units.

### 14.7 Protected Files

These files must NOT be modified:
- `/src/app/components/figma/ImageWithFallback.tsx`
- `/pnpm-lock.yaml`

### 14.8 Build Configuration

- **Tailwind v4** configuration: No `tailwind.config.js` file. Config is in `/src/styles/tailwind.css` using `@import 'tailwindcss' source(none)` with `@source` directive.
- **CSS import chain:** `index.css` -> `fonts.css` + `tailwind.css` + `theme.css`.

---

## End of Design Document

This document fully describes the current state of the University of San Agustin Student Portal as of 2026-03-29. Any AI coding agent should be able to reproduce, extend, or refactor the portal using this specification alone.
