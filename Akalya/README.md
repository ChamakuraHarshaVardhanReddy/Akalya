# Akalya — Remote Learning Platform

This repository contains a full-stack remote learning platform with a TypeScript React client and a Node.js/Express server.

**Quick overview**
- **Client:** frontend app in `client/` (Vite + React + TypeScript)
- **Server:** backend API in `server/` (Node.js + Express, plain JS)

**Key features**
- Courses, classes, assignments, submissions, notes, mock tests, job postings, and a chat system.

**Prerequisites**
- Node.js 18+ and npm (or yarn/pnpm)
- MongoDB (local or hosted) if running the full backend

Getting started
1. Clone the repo and open the project root (this folder).

2. Install dependencies for client and server:

```bash
# from project root
cd client
npm install

cd ../server
npm install
```

3. Environment variables
- Create `.env` files as needed (server expects DB and auth config). Example keys:

- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — JWT signing secret
- `PORT` — server port (default 3000)

4. Run locally

```bash
# Run server
cd server
npm run dev

# In another terminal, run client
cd ../client
npm run dev
```

5. Build for production

```bash
# Build client
cd client
npm run build

# Start server (ensure server serves the built client or use a separate static host)
cd ../server
npm start
```

Repository layout
- `client/` — React + Vite frontend
- `server/` — Express backend, controllers, models, and routes
- `server/models` — Mongoose-like models (JS files)
- `server/routes` — API route definitions

Notes & next steps
- See `server/README.md` for server-specific setup and scripts.
- Add `.env.local` or other env files to `.gitignore` (already added).

Want me to run the dev server or commit this README for you? 
