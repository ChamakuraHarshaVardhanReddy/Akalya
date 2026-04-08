# Akalya – Refactor & Validation Summary

## 1. Updated Folder Structure (Relevant)

```
Akalya/
├── src/
│   ├── App.tsx
│   ├── components/
│   │   ├── ChatbotWidget.tsx    # Role-based: student & teacher only
│   │   ├── StudentDashboardLayout.tsx  # Single sidebar: Dashboard, Career Gateway ▼, My Locker, Profile, Logout
│   │   ├── LandingNav.tsx
│   │   └── ...
│   └── pages/
│       ├── StudentDashboard.tsx  # No sidebar; section tabs only
│       ├── ...
├── server/
│   ├── routes/
│   │   └── chat.js              # Assistant: GEMINI_API_KEY or LOVABLE_API_KEY fallback
│   └── ...
└── REFACTOR_VALIDATION.md
```

## 2. Database Schema Overview (Unchanged)

- **User**: email, password, fullName, role (student|teacher|admin)
- **Course, Assignment, Submission, Class, Note, CourseEnrollment**: existing learning flow
- **Scholarship, EntranceExam, JobPosting, PreparationResource**: Career Gateway content
- **PracticeQuestion, PracticeAttempt, MockTest, MockTestQuestion, MockTestAttempt**: practice & test series
- **LockerFile**: student digital locker (100MB limit)
- **ChatConversation, ChatMessage**: chatbot

All modules use MongoDB via Mongoose; no schema changes in this refactor.

## 3. Files Modified

| File | Changes |
|------|--------|
| `src/components/StudentDashboardLayout.tsx` | Single sidebar: Dashboard, Career Gateway (dropdown with animation), My Locker, Profile, Logout. Removed "My Locker" from dropdown. |
| `src/pages/StudentDashboard.tsx` | Removed duplicate sidebar and logout; added horizontal section tabs (Dashboard, Explore, My Courses, Assignments, etc.). Removed `sidebarOpen`, `handleSignOut`, `useNavigate`; removed console.logs. |
| `src/components/ChatbotWidget.tsx` | Role-based render: show only when `user.role === 'student' \|\| user.role === 'teacher'`. Added "Thinking..." when loading reply; 502/503 error message improved. |
| `server/routes/chat.js` | Assistant uses `GEMINI_API_KEY` or `LOVABLE_API_KEY`; 503 when not set; API URL uses v1beta. |
| `src/pages/Scholarships.tsx` | Official Website / Apply button with URL validation (prepend https if missing). |
| `src/pages/Jobs.tsx` | Official Website button with URL validation. |
| `src/pages/EntranceExams.tsx` | Detail page: Official Website link with URL validation. |
| `src/pages/Certifications.tsx` | Official Website buttons for NCVT (ncvt.nic.in) and Skill India (skillindia.gov.in). |

## 4. Files Created

- `REFACTOR_VALIDATION.md` (this file)

## 5. Routing Explanation

- **Landing**: `/`, `/about`, `/contact`, `/auth` — no chatbot.
- **Student**: `/dashboard/student` (layout with single sidebar) — index = StudentDashboard (section tabs); `career-gateway` = hub; `career-gateway/scholarships`, etc. = embedded modules. Chatbot visible.
- **Teacher**: `/dashboard/teacher` — Chatbot visible.
- **Admin**: `/dashboard/admin` — Chatbot not visible.

All Career Gateway and dashboard routes remain protected by `ProtectedRoute`; no new routes added.

## 6. Real-Time Implementation

- **Scholarships, Jobs, Entrance Exams, Preparation Resources**: Fetched from API on load; admin create/update/delete via existing APIs; students see updated list on next load or refresh.
- **Practice / Test Series**: Questions and attempts stored in DB; history and scores from API.
- **Locker**: Upload → backend storage + LockerFile document; list/usage from API; 100MB limit enforced.
- **Courses, Assignments, Enrollments, Submissions**: Already use APIs; no static demo in these flows.
- **Attendance**: Teacher dashboard may use static or local state; backend attendance API can be added later without breaking current UI.
- **Admin**: Some demo/placeholder for resources and announcements; core CRUD (courses, users, etc.) is real. To make resources/announcements real-time, add backend models and wire Admin UI to them.

No WebSockets were added; “real-time” here means data from database via REST with refresh on load or after mutations.

## 7. Confirmation

- **Single sidebar**: Only `StudentDashboardLayout` provides the sidebar; StudentDashboard has no sidebar, only section tabs.
- **Chatbot**: Renders only for student and teacher; hidden on landing and for admin.
- **Chat**: Backend assistant uses env key fallback; frontend shows loading and clearer errors.
- **Official links**: Scholarships (Apply/Official), Jobs (Official Website), Entrance Exam detail (Official Website), Certifications (NCVT, Skill India) — all open in new tab with valid URLs.
- **Console**: Removed noisy logs from StudentDashboard; no intentional console errors introduced.
- **No duplicate layouts**: One layout for student area; no second sidebar.
- **Existing behaviour**: Courses, assignments, enrollments, submissions, career gateway modules, auth, and role redirects unchanged; only sidebar structure, chatbot visibility, chat error/loading, official links, and cleanup were updated.

To run a quick validation:

1. **Landing**: Open `/` — no chatbot; Login/Register work.
2. **Student login**: Go to dashboard — one sidebar with Dashboard, Career Gateway (expandable), My Locker, Profile, Logout; section tabs for Dashboard content; Career Gateway routes load correctly.
3. **Teacher login**: Chatbot visible.
4. **Admin login**: No chatbot.
5. **Chatbot (as student/teacher)**: Send message — “Thinking...” then reply or error toast; no uncaught errors.
6. **Scholarships/Jobs/Exams/Certifications**: Cards show Official Website / Apply where applicable; links open in new tab.
