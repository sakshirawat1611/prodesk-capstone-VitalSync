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
