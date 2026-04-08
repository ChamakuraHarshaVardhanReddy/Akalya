# Akalya – Rural Student Empowerment Ecosystem – Upgrade Summary

## Updated folder structure

```
Akalya/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── .env
├── UPGRADE_SUMMARY.md          # this file
├── src/
│   ├── main.tsx
│   ├── App.tsx                 # updated: new routes + layout
│   ├── index.css
│   ├── lib/
│   │   └── api.ts              # updated: new API clients
│   ├── contexts/
│   ├── hooks/
│   ├── pages/
│   │   ├── Index.tsx           # updated: AppLayout, rural content
│   │   ├── Auth.tsx
│   │   ├── StudentDashboard.tsx
│   │   ├── TeacherDashboard.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── NotFound.tsx
│   │   ├── Scholarships.tsx    # NEW
│   │   ├── EntranceExams.tsx    # NEW (list + detail)
│   │   ├── Jobs.tsx            # NEW (10th + 12th)
│   │   ├── PreparationResources.tsx  # NEW
│   │   ├── CareerRoadmap.tsx    # NEW
│   │   ├── Practice.tsx        # NEW (Class 6–12 MCQ)
│   │   ├── TestSeries.tsx       # NEW
│   │   ├── TestSeriesAttempt.tsx # NEW
│   │   ├── Locker.tsx           # NEW (digital locker)
│   │   └── About.tsx           # NEW
│   ├── components/
│   │   ├── AppLayout.tsx       # NEW (shared navbar + layout)
│   │   ├── FeatureShowcase.tsx # updated: rural copy
│   │   ├── ProtectedRoute.tsx
│   │   ├── ChatbotWidget.tsx
│   │   └── ui/...
│   └── integrations/
└── server/
    ├── index.js                # updated: new route mounts
    ├── package.json            # updated: multer
    ├── .env
    ├── middleware/
    │   ├── auth.js
    │   └── uploadLocker.js     # NEW (multer for locker)
    ├── models/
    │   ├── User.js
    │   ├── Course.js
    │   ├── ... (existing)
    │   ├── Scholarship.js      # NEW
    │   ├── EntranceExam.js     # NEW
    │   ├── JobPosting.js       # NEW
    │   ├── PreparationResource.js # NEW
    │   ├── PracticeQuestion.js # NEW
    │   ├── PracticeAttempt.js   # NEW
    │   ├── MockTest.js         # NEW
    │   ├── MockTestQuestion.js # NEW
    │   ├── MockTestAttempt.js  # NEW
    │   └── LockerFile.js       # NEW
    ├── controllers/
    │   ├── scholarshipsController.js    # NEW
    │   ├── entranceExamsController.js   # NEW
    │   ├── jobsController.js             # NEW
    │   ├── preparationResourcesController.js # NEW
    │   ├── practiceController.js        # NEW
    │   ├── mockTestsController.js       # NEW
    │   └── lockerController.js           # NEW
    ├── routes/
    │   ├── scholarships.js     # NEW
    │   ├── entranceExams.js    # NEW
    │   ├── jobs.js             # NEW
    │   ├── preparationResources.js # NEW
    │   ├── practice.js         # NEW
    │   ├── mockTests.js        # NEW
    │   ├── locker.js           # NEW
    │   └── submissions.js      # updated: PUT :id/grade
    └── scripts/
        └── seed-exams-and-jobs.js  # NEW (seed national/state exams + jobs)
```

---

## New files created

### Frontend

| File | Purpose |
|------|--------|
| `src/components/AppLayout.tsx` | Shared layout with navbar: Home, Scholarships, Entrance Exams, Jobs, Career Roadmap, Practice, Test Series, My Locker, About, Login/Dashboard |
| `src/pages/Scholarships.tsx` | List scholarships with category/class filters; cards with eligibility, deadline, apply link |
| `src/pages/EntranceExams.tsx` | National vs state tabs; list exams; detail page with overview, eligibility, pattern, syllabus, dates, official site |
| `src/pages/Jobs.tsx` | Tabs: Jobs after 10th (Govt + Skill), Jobs after 12th (Govt + Private); cards with eligibility, salary, links |
| `src/pages/PreparationResources.tsx` | List resources by type (book, YouTube, govt, previous paper, timetable, roadmap, strategy) |
| `src/pages/CareerRoadmap.tsx` | Form: current class, interests, financial background → generated academic path, exams, scholarships, skills |
| `src/pages/Practice.tsx` | Class 6–12 MCQ practice: select class/subject, timer, submit, score, history (student-only) |
| `src/pages/TestSeries.tsx` | List mock tests; “Start test” / “Login to attempt”; recent attempts for logged-in user |
| `src/pages/TestSeriesAttempt.tsx` | Take mock test: timer, MCQ, submit → score, weak topics, suggestions |
| `src/pages/Locker.tsx` | Student digital locker: upload (PDF/images/Word), rename, download, delete; 100 MB limit; usage display |
| `src/pages/About.tsx` | Mission, what we offer, rural education focus, contact |

### Backend

| File | Purpose |
|------|--------|
| `server/models/Scholarship.js` | Title, description, provider, amount, eligibility, deadline, applicationUrl, category, forClass |
| `server/models/EntranceExam.js` | name, slug, level (national/state), state, overview, eligibility, ageLimit, examPattern, syllabus, importantDates, officialWebsite, careerOpportunities |
| `server/models/JobPosting.js` | title, category (govt_10, skill_10, govt_12, private_12), eligibility, ageLimit, selectionProcess, salaryRange, officialWebsite, etc. |
| `server/models/PreparationResource.js` | title, type (book/youtube/govt/previous_paper/timetable/roadmap/strategy), url, examIds, classLevel |
| `server/models/PracticeQuestion.js` | classLevel 6–12, subject, question, options, correctIndex, explanation |
| `server/models/PracticeAttempt.js` | userId, classLevel, subject, totalQuestions, correctCount, timeSpentSeconds, answers |
| `server/models/MockTest.js` | title, examId, type (full_length/subject_wise), durationMinutes, totalMarks |
| `server/models/MockTestQuestion.js` | mockTestId, question, options, correctIndex, marks, explanation |
| `server/models/MockTestAttempt.js` | userId, mockTestId, score, totalMarks, timeSpentSeconds, answers, weakTopics, improvementSuggestions |
| `server/models/LockerFile.js` | userId, originalName, storedName, displayName, mimeType, size; 100 MB limit per user |
| `server/controllers/scholarshipsController.js` | getAll, getById, create, update, remove |
| `server/controllers/entranceExamsController.js` | getAll, getBySlug, getById, create, update, remove |
| `server/controllers/jobsController.js` | getAll, getById, create, update, remove |
| `server/controllers/preparationResourcesController.js` | getAll, getById, create, update, remove |
| `server/controllers/practiceController.js` | getQuestions, submitPractice, getExplanation, getMyHistory; admin CRUD for questions |
| `server/controllers/mockTestsController.js` | getAll, getById, submitTest, getMyAttempts; admin create/update/addQuestion/delete |
| `server/controllers/lockerController.js` | listFiles, getUsage, upload, rename, remove, download (student-only) |
| `server/middleware/uploadLocker.js` | Multer disk storage for locker; 10 MB per file; allowed types: PDF, images, Word |
| `server/routes/scholarships.js` | GET /, GET /:id; POST/PUT/DELETE (admin) |
| `server/routes/entranceExams.js` | GET /, GET /slug/:slug, GET /:id; POST/PUT/DELETE (admin) |
| `server/routes/jobs.js` | GET /, GET /:id; POST/PUT/DELETE (admin) |
| `server/routes/preparationResources.js` | GET /, GET /:id; POST/PUT/DELETE (admin) |
| `server/routes/practice.js` | GET /questions, POST /submit, GET /explanation/:id, GET /history (student); /admin/questions CRUD (admin) |
| `server/routes/mockTests.js` | GET /, GET /my/attempts, GET /:id, POST /submit (student); /admin (admin) |
| `server/routes/locker.js` | GET /, GET /usage, POST /upload, PUT /:id/rename, DELETE /:id, GET /:id/download (student) |
| `server/scripts/seed-exams-and-jobs.js` | Seeds national exams (JEE, NEET, CUET, CLAT, NDA, NIFT, NID, SSC, Banking, Railway) and state (TSPSC, APPSC, KCET, MHCET, TNEA); jobs after 10th and 12th |

---

## Integration steps

1. **Install backend dependency**  
   In `server/`: run `npm install` (adds `multer`). Ensure `MONGODB_URI` and `JWT_SECRET` are set in `server/.env`.

2. **Seed initial data (optional but recommended)**  
   From `server/`:  
   `node scripts/seed-exams-and-jobs.js`  
   This populates entrance exams and job postings so the Entrance Exams and Jobs pages show content.

3. **Create uploads directory**  
   Locker saves files under `server/uploads/locker/<userId>/`. The app creates the directory on first upload; ensure the process has write permission to `server/uploads`.

4. **Frontend**  
   No new env vars. Ensure `VITE_API_URL` in `Akalya/.env` points to your backend (e.g. `http://localhost:3001/api` for local dev).

5. **Run**  
   - Backend: `cd server && npm run dev` (or `npm start`).  
   - Frontend: `npm run dev` (e.g. port 8080).  
   - Open the app; use navbar to open Scholarships, Entrance Exams, Jobs, Career Roadmap, Practice, Test Series, My Locker, About.

6. **Roles**  
   - **Student**: Can view all public pages; attempt practice and mock tests when logged in; use locker; view dashboard.  
   - **Admin**: Can manage scholarships, entrance exams, jobs, preparation resources, practice questions, and mock tests via API (admin UI can be added later).  
   - **Teacher**: Unchanged; continues to use courses, assignments, classes, submissions (grading now supported via `PUT /api/submissions/:id/grade`).

---

## Backend changes (summary)

- **New API bases**:  
  `/api/scholarships`, `/api/entrance-exams`, `/api/jobs`, `/api/preparation-resources`, `/api/practice`, `/api/mock-tests`, `/api/locker`
- **Auth**: Existing JWT and `authenticate`/`requireRole` unchanged. New routes use `requireAdmin` for create/update/delete and `requireStudent` for practice submit, mock submit, locker.
- **Submissions**: Added `PUT /api/submissions/:id/grade` (body: `{ grade, feedback }`) for teacher/admin so existing grading UI keeps working.
- **Locker**: File upload via `multipart/form-data`; multer in `uploadLocker.js`; allowed types and 10 MB per file; 100 MB total per user enforced in controller.
- **MongoDB**: New collections created when first document is saved for Scholarship, EntranceExam, JobPosting, PreparationResource, PracticeQuestion, PracticeAttempt, MockTest, MockTestQuestion, MockTestAttempt, LockerFile.

---

## Module connection overview

- **Home (Index)** uses `AppLayout` and links to Scholarships, Entrance Exams, Practice, Test Series, Jobs, About; footer links updated.
- **Navbar** (in `AppLayout`) links to all new pages and Auth/Dashboard.
- **Scholarships / Entrance Exams / Jobs / Preparation Resources** call `scholarshipsAPI`, `entranceExamsAPI`, `jobsAPI`, `preparationResourcesAPI`; list and detail pages work with backend filters.
- **Career Roadmap** is client-only (form + generated text); can later call APIs to pull exams/scholarships by filters.
- **Practice** uses `practiceAPI.getQuestions`, `practiceAPI.submit`, `practiceAPI.getMyHistory`; student-only submit and history.
- **Test Series** uses `mockTestsAPI.getAll`, `mockTestsAPI.getMyAttempts`; **TestSeriesAttempt** uses `mockTestsAPI.getById`, `mockTestsAPI.submit`.
- **Locker** uses `lockerAPI.list`, `lockerAPI.getUsage`, `lockerAPI.upload` (FormData), `lockerAPI.rename`, `lockerAPI.delete`, `lockerAPI.download`; student-only.
- **Dashboards** (Student/Teacher/Admin) and **Auth** are unchanged; only new routes and one new layout component were added.

---

## Security and performance (addressed)

- **Role-based routes**: Admin-only for create/update/delete on scholarships, exams, jobs, resources, practice questions, mock tests; student-only for practice submit, test submit, locker.
- **Locker**: Allowed MIME types and file size limit in multer; total 100 MB per user in controller; files stored per-user directory.
- **Validation**: Controllers validate required fields (e.g. title, category) and return 400 on bad input; optional enhancement: use `express-validator` for more validation/sanitization.
- **Existing behaviour**: Courses, assignments, classes, enrollments, submissions, notes, chat, users, queries are unchanged; only submissions gained the grade endpoint.

You can extend admin UI later (e.g. in AdminDashboard) to manage scholarships, exams, jobs, resources, practice questions, and mock tests using the same APIs.
