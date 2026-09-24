# VitalSync — Hospital Portal Application

## High-Level Description
VitalSync is a role-based hospital management portal connecting Doctors and 
Patients through a single system. Doctors manage their assigned patients' 
records, publish appointment availability, and issue prescriptions. Patients 
select a doctor based on their medical need, book appointments, and view 
their own medical history and prescriptions in real time. The application 
enforces strict access control so each role sees only the data relevant to 
them.

## Track
Fullstack

## Tech Stack
- **Frontend:** React (Vite)
- **Backend:** Node.js + Express
- **Database:** MongoDB (Mongoose)
- **Real-time:** Socket.io
- **Styling:** Tailwind CSS

## Core Features

### RBAC (Role-Based Access Control)
- Doctor can view and edit records only for their assigned patients
- Patient can view only their own appointments, history, and prescriptions
- Patient can request changes (e.g., new appointment) but cannot directly 
  edit records

### Appointment Scheduling
- Doctor has a specialty (e.g., Cardiologist, Dermatologist, General 
  Physician, General Surgeon)
- Patient selects a specialty based on their medical problem, views 
  available doctors and their slots, and books/requests an appointment
- Doctor publishes and manages their own available time slots

### Medical History Timeline
- Doctor can add/update procedure records for their assigned patients
- Patient has read-only access to their own treatment history

### Prescription Management
- Doctor writes and updates prescriptions for their patients
- Patient has read-only access to prescriptions issued to them

### Real-Time Availability
- When a slot is booked, all users viewing that doctor's schedule see it 
  marked unavailable instantly via Socket.io — no page refresh required

## UI/UX Wireframes (Figma)
[View Figma Wireframes] (https://www.figma.com/design/cKgEUv3WW7uZnQlpaeD9DC/VitalSync-Wireframes?node-id=0-1&t=2NrV3XjF2Pzza6of-1)
Covers 4 core viewports — Auth/Login, Patient Dashboard, Booking Screen, and 
Doctor Dashboard — plus a mobile-responsive version of the Booking Screen 
demonstrating cross-device layout adaptation.

## System Architecture (ERD)
[View ERD Diagram] (https://dbdiagram.io/d/Vitalsync-6a81a1afe093539a9ec44f1f)

<img width="737" height="884" alt="Vitalsync" src="https://github.com/user-attachments/assets/6aa3d9ea-b7fa-42e4-8a9f-0176163c54f1" />

Four MongoDB collections: **Users** (shared identity for Doctor/Patient via a 
`role` field), **Appointments**, **MedicalHistory**, and **Prescriptions** — 
the latter three each reference `Users` via `doctorId` and `patientId` to 
enforce RBAC at the data layer.

## Future Enhancements (Post-MVP)
- Department/Room-level organization for larger hospital structures


## Sprint 14 — Authentication & Deployment

### Backend (Node.js + Express + MongoDB)
- User schema with bcrypt-hashed passwords (salted, never stored in plain text)
- `/api/auth/register` and `/api/auth/login` routes, returning a signed JWT on success
- `authMiddleware` protecting routes (e.g. `/api/profile`) — verifies JWT, rejects invalid/missing tokens

### Frontend (React + Vite)
- Login/Register form with role-aware fields
- JWT persisted in localStorage on successful login
- `ProtectedRoute` component — redirects unauthenticated users to `/login`

### Live Deployment
- **Backend (Render):** https://prodesk-capstone-vitalsync-q5cm.onrender.com
- **Frontend (Vercel):** https://prodesk-capstone-vital-sync-sooty.vercel.app

### Verification
- Password hashing confirmed directly in MongoDB Atlas (see Screenshots/)
- Register, login, and protected route tested via Thunder Client and live browser session

## Sprint 15 — REST API CRUD, Data Ownership & Monetization

### Backend (Node.js + Express + MongoDB)
- Full CRUD on Appointments: `POST`, `GET` (list + single), `PUT`, `DELETE` 
  — all protected by JWT and ownership checks
- Data ownership enforced server-side: `patientId` always set from the 
  decoded JWT (never trusted from client input); `GET`/`PUT`/`DELETE` 
  compare the document's `doctorId`/`patientId` against the requester's 
  ID, rejecting mismatches with `403 Forbidden`
- `User` schema extended with a `role` field (`doctor` / `patient`, 
  enum-restricted)
- Stripe (test mode) checkout session endpoint — Secret Key stays 
  backend-only, never exposed to the client

### Frontend (React + Vite)
- Dashboard fetches and displays the logged-in user's appointments 
  (filtered server-side by role)
- Optimistic UI on delete — the item is removed from the screen instantly, 
  before the API call resolves
- Role-based rendering — the Delete button only appears for Doctors, since 
  Patients are never authorized to delete
- "Upgrade to Pro" button redirects to Stripe Checkout; a `/success` route 
  handles the post-payment redirect

### Verification
- Ownership checks tested both ways: correct owner → `200`, unrelated 
  user → `403` (verified for GET, PUT, and DELETE)
- Stripe checkout tested end-to-end with Stripe's official test card, 
  confirming a working redirect to the success page

### Live Deployment
- **Backend (Render):** https://prodesk-capstone-vitalsync-q5cm.onrender.com
- **Frontend (Vercel):** https://prodesk-capstone-vital-sync-sooty.vercel.app

## Sprint 16 — Code Freeze: Validation, AI Endpoint & Rate Limiting

### Backend (Node.js + Express + MongoDB)
- Schema validation added on `auth.js` (`registerSchema`, `loginSchema`) 
  and the appointments POST route (`appointmentSchema`) using Zod — all 
  incoming `req.body` payloads are checked with `safeParse` before 
  touching the database, returning a clean `400 Bad Request` on invalid input
- `CastError` handling added to the ID-based appointment routes 
  (`GET`/`PUT`/`DELETE /:id`) — a malformed MongoDB ID now returns a clean 
  `400` instead of crashing with a raw `500`
- New server-side AI microservice: `POST /api/ai/suggest` — auth-protected, 
  Zod-validated, calls Google's Gemini API (`@google/generative-ai`) to 
  rewrite user-submitted text professionally; API key stays server-side in 
  `.env`, never exposed to the React client
- Rate limiting via `express-rate-limit`: `/api/auth/login` capped at 5 
  requests per 15 minutes, `/api/ai/suggest` capped at 20 per 15 minutes
- Codebase swept for stray `console.log` statements — none found outside 
  3 legitimate startup/DB-connection logs in `index.js`, kept intentionally

### Verification
- Validation tested on both routes: malformed input → `400`, valid data → 
  successfully created/logged in
- Invalid MongoDB ID tested on `GET`/`PUT`/`DELETE /:id` → clean `400` 
  instead of a server crash
- AI endpoint tested end-to-end, both locally and on the live Render 
  deployment, returning a properly rewritten response
- Login rate limit tested directly — 6th consecutive attempt correctly 
  blocked with "Too many requests"

### Live Deployment
- **Backend (Render):** https://prodesk-capstone-vitalsync-q5cm.onrender.com
- **Frontend (Vercel):** https://prodesk-capstone-vital-sync-sooty.vercel.app
