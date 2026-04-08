# Akalya – Restructure Summary

## Objective

- Landing page: simple and clean; only **Home | About | Contact | Login | Register** in the nav.
- All major functional modules moved **inside Student Dashboard** under a unified **Career Gateway**.
- No backend or feature logic removed; only access flow and UI placement changed.

---

## 1. Updated folder structure (relevant parts)

```
Akalya/src/
├── App.tsx                          # Modified: nested student routes, redirects
├── components/
│   ├── LandingNav.tsx               # NEW – landing nav (Home, About, Contact, Login, Register)
│   ├── StudentDashboardLayout.tsx   # NEW – sidebar + Outlet for /dashboard/student/*
│   ├── AppLayout.tsx                # Unchanged (still used by no public module routes)
│   └── ...
├── pages/
│   ├── Index.tsx                    # Modified: LandingNav, feature cards → /auth or Career Gateway
│   ├── About.tsx                    # Modified: LandingNav instead of AppLayout
│   ├── Contact.tsx                   # NEW – Contact page with LandingNav
│   ├── CareerGatewayHub.tsx         # NEW – hub grid for Career Gateway modules
│   ├── Certifications.tsx           # NEW – Certifications content (Career Gateway)
│   ├── StudentDashboard.tsx         # Unchanged (still full dashboard at index of student area)
│   ├── Scholarships.tsx             # Modified: optional `embedded` prop
│   ├── EntranceExams.tsx            # Modified: `embedded`, detailBasePath; EntranceExamDetail `embedded`
│   ├── Jobs.tsx                     # Modified: `embedded`, `defaultTab` for 10th/12th
│   ├── PreparationResources.tsx    # Modified: `embedded`
│   ├── CareerRoadmap.tsx            # Modified: `embedded`
│   ├── Practice.tsx                 # Modified: `embedded`
│   ├── TestSeries.tsx               # Modified: `embedded`, navigate path when embedded
│   ├── TestSeriesAttempt.tsx       # Modified: back link uses career-gateway path when in dashboard
│   ├── Locker.tsx                   # Modified: `embedded`
│   └── ...
└── ...
```

---

## 2. Files modified

| File | Changes |
|------|--------|
| `App.tsx` | Landing + About + Contact + Auth; `/dashboard/student` uses `StudentDashboardLayout` with nested routes; Career Gateway routes under `/dashboard/student/career-gateway/*`; old public module URLs redirect to `/auth`. |
| `Index.tsx` | Uses `LandingNav`; hero and CTA simplified; feature cards redirect to `/auth` if not logged in, else to `/dashboard/student/career-gateway` for students; footer links: Home, About, Contact, Login, Register. |
| `About.tsx` | Uses `LandingNav` instead of `AppLayout`. |
| `Scholarships.tsx` | Added `embedded?`; when `embedded`, renders content only (no `AppLayout`). |
| `EntranceExams.tsx` | Default export accepts `embedded`; `EntranceExamsList` accepts `detailBasePath` for detail links; `EntranceExamDetail` accepts `embedded` and back link. |
| `Jobs.tsx` | Added `embedded?` and `defaultTab?: "10th" \| "12th"`; when `embedded`, content only. |
| `PreparationResources.tsx` | Added `embedded?`; when `embedded`, content only. |
| `CareerRoadmap.tsx` | Added `embedded?`; when `embedded`, content only. |
| `Practice.tsx` | Added `embedded?`; when `embedded`, content only. |
| `TestSeries.tsx` | Added `embedded?`; “Start test” navigates to career-gateway path when `embedded`. |
| `TestSeriesAttempt.tsx` | “Back to tests” uses `useLocation` to go to `/dashboard/student/career-gateway/test-series` when under career-gateway. |
| `Locker.tsx` | Added `embedded?`; when `embedded`, content only. |

---

## 3. New files created

| File | Purpose |
|------|--------|
| `components/LandingNav.tsx` | Navbar for landing: Home, About, Contact, Login, Register; theme toggle; mobile menu. |
| `components/StudentDashboardLayout.tsx` | Layout for `/dashboard/student`: sidebar (Dashboard, Career Gateway with sub-links), welcome bar, `<Outlet />` for nested routes. |
| `pages/Contact.tsx` | Contact page with LandingNav; email and chatbot info. |
| `pages/CareerGatewayHub.tsx` | Grid of cards linking to Scholarships, Entrance Exams, Jobs 10th/12th, Certifications, Practice, Test Series, Career Roadmap, Preparation Resources, Locker. |
| `pages/Certifications.tsx` | Certifications content (ITI/NCVT, Skill India/NSDC) and link to Preparation Resources. |
| `RESTRUCTURE_SUMMARY.md` | This file. |

---

## 4. Routing changes

- **Public (no auth):**
  - `/` – Index (landing)
  - `/about` – About
  - `/contact` – Contact
  - `/auth` – Login / Register

- **Student (protected):**
  - `/dashboard/student` – Student dashboard (existing `StudentDashboard`).
  - `/dashboard/student/career-gateway` – Career Gateway hub.
  - `/dashboard/student/career-gateway/scholarships` – Scholarships.
  - `/dashboard/student/career-gateway/entrance-exams` – Entrance exams list.
  - `/dashboard/student/career-gateway/entrance-exams/:slug` – Exam detail.
  - `/dashboard/student/career-gateway/jobs-after-10th` – Jobs (10th tab).
  - `/dashboard/student/career-gateway/jobs-after-12th` – Jobs (12th tab).
  - `/dashboard/student/career-gateway/certifications` – Certifications.
  - `/dashboard/student/career-gateway/practice` – Practice (6–12).
  - `/dashboard/student/career-gateway/test-series` – Test series list.
  - `/dashboard/student/career-gateway/test-series/:id` – Test attempt.
  - `/dashboard/student/career-gateway/career-roadmap` – Career roadmap.
  - `/dashboard/student/career-gateway/preparation-resources` – Preparation resources.
  - `/dashboard/student/career-gateway/locker` – My Locker.

- **Redirects (old URLs → login):**  
  `/scholarships`, `/entrance-exams`, `/entrance-exams/:slug`, `/jobs`, `/preparation-resources`, `/career-roadmap`, `/practice`, `/test-series`, `/test-series/:id`, `/locker` → `Navigate to="/auth"`.

- **Teacher / Admin:**  
  `/dashboard/teacher`, `/dashboard/admin` unchanged; still protected by `ProtectedRoute`.

---

## 5. Authentication flow

- **Landing:** User sees Home, About, Contact, Login, Register. Feature cards either send to `/auth` (if not logged in) or to `/dashboard/student/career-gateway` (if student).
- **Login/Register:** `Auth` page unchanged; after sign-in, redirect to `/dashboard/${role}` (e.g. student → `/dashboard/student`).
- **Student:** All `/dashboard/student` and `/dashboard/student/career-gateway/*` routes are wrapped in `ProtectedRoute allowedRoles={["student"]}`. Unauthenticated or non-student users cannot open these URLs; they get the same behaviour as before (login/forbidden).
- **Direct hit on old URLs:** Any of the old public module paths above redirect to `/auth`, so no direct access without going through dashboard.

---

## 6. Confirmation: no functionality removed

- **Backend:** No API or server code changed. All endpoints (scholarships, entrance-exams, jobs, preparation-resources, practice, mock-tests, locker, etc.) are still used from the same page components when rendered inside Career Gateway.
- **Features:** Scholarships, Entrance Exams, Jobs (10th/12th), Certifications, Practice, Test Series, Career Roadmap, Preparation Resources, and Locker are the same; they are now reached only via Student Dashboard → Career Gateway.
- **Student dashboard:** Existing behaviour (courses, explore, enrolled, assignments, attendance, doubt, progress, library, notifications, settings) is unchanged; it is still the index route at `/dashboard/student`.
- **Teacher & Admin:** No changes; dashboards and access unchanged.
- **Landing:** Only the nav and where links go have changed; hero, feature highlight, steps, CTA and footer are still present and improved for clarity.

---

## 7. UI/UX summary

- **Landing:** One navbar (Home, About, Contact, Login, Register), clean hero, short mission, feature cards that lead to login or Career Gateway, steps, CTA, footer.
- **Student dashboard:** Welcome line with student name; sidebar with Dashboard and Career Gateway (with sub-items); main area shows either the full dashboard or the selected Career Gateway screen; responsive layout.
- **Career Gateway:** Single hub page with card grid; each card goes to the corresponding sub-module; sub-pages use the same components as before, rendered without `AppLayout` when `embedded` is true.
