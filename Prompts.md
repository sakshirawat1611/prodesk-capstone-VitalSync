AI-Assisted Planning Log (Sprint 13 Capstone Blueprint)

This documents my AI usage during VitalSync's planning phase, per the 
Corporate AI Policy. I used Claude as a strict Socratic mentor throughout — 
asking it to guide my decisions through questions rather than write my PRD, 
wireframes, or schema for me directly.

## 1. Setting the mentorship approach
I asked Claude to act as a strict mentor for the full capstone — pushing 
back on scope creep, asking me to justify decisions instead of accepting 
my first answer, and making me do the actual drafting myself rather than 
generating deliverables on my behalf.

## 2. Project selection
I asked Claude to recommend which of the three RFP options (EduCore, 
VitalSync, TaskMatrix) would best demonstrate skill growth and stand out 
for PPO evaluation. Claude suggested VitalSync, reasoning that RBAC was new 
territory for me and real-time availability would build directly on 
Sprint 12's Socket.io work. I didn't take this at face value — I separately 
researched each project type (typical scope, common pitfalls, what each 
demonstrates to evaluators) before confirming VitalSync as my final choice.

## 3. Tech stack selection
I asked Claude to weigh Next.js vs React (Vite) + Express for the Fullstack 
track. Claude laid out the risk trade-off (learning a new framework vs. the 
hardest project scope, under deadline pressure) and asked me to reason 
through it myself rather than picking for me. Result: React (Vite) + 
Express + MongoDB, chosen consciously.

## 4. Feature scoping (Core Features)
Claude gave me a fill-in-the-blank template across the 5 locked modules 
(RBAC, Appointments, Medical History, Prescriptions, Real-Time) instead of 
listing features for me. When I drifted into scope creep (proposing a 
Department/Room hierarchy), Claude flagged it against FAQ #14 and asked me 
to justify why it was functionally necessary — I couldn't, so we cut it and 
logged it under "Future Enhancements" instead.

## 5. PRD / README authorship
Claude drafted README sections after each decision was locked through 
discussion, and asked me to review the wording myself before pasting it in, 
rather than accepting the draft blindly.

## 6. Figma wireframes — guided, not generated
For each of the 4 screens (Auth, Patient Dashboard, Booking, Doctor 
Dashboard) plus a mobile pass, Claude asked me to state the content list 
in my own words first ("what elements go on this screen?") before giving 
any Figma steps. When I got stuck on layout choices — e.g. specialty cards 
as a scrollable row vs. a wrapping grid — Claude explained the real trade-off 
and asked me to pick, rather than deciding for me.

## 7. Database schema (ERD)
Claude asked me to choose between a single Users collection (role field) 
vs. separate Doctor/Patient collections, explaining the trade-off before 
I answered. Once fields were defined per collection through direct Q&A, 
Claude explained why an ERD is one unified diagram (data relationships) 
rather than four separate ones like the Figma screens (user navigation) — 
a distinction I initially confused.

## Reflection
Working this way took longer than having AI generate the PRD/wireframes/ERD 

## Sprint 14 — Auth Backend & JWT Integration

I used Claude as a strict mentor again for this sprint, with the same 
approach: concepts explained before code, and I wrote/debugged everything 
myself.

- **Password hashing:** Claude explained bcrypt's salt+hash mechanism using 
  a shredder analogy before I wrote the register route, so I understood why 
  hashing is one-way rather than just copying the code.
- **JWT:** Explained via a "concert wristband" analogy — verify once at 
  login, then trust the signed token for subsequent requests instead of 
  re-checking credentials.
- **Debugging:** Worked through several real errors myself with Claude's 
  guidance — a missing `router` import, an empty `User.js` model file, a 
  MongoDB DNS/SRV connection block (fixed by switching to the standard 
  connection string), and a database-name mismatch (`test` vs `vitalsync`).
- **Repo structure:** Decided to keep backend and frontend inside the single 
  existing `prodesk-capstone-VitalSync` repo (not separate repos), merging 
  local and remote git histories with `--allow-unrelated-histories`.
- **Deployment:** Deployed backend to Render (fixing an initial Docker 
  vs. Node environment misconfiguration) and frontend to Vercel, then 
  updated the frontend's API URL to point to the live backend.
outright, but every decision in the final deliverables — topic, stack, 
scope, schema, layout — is one I can actually explain and defend in the 
demo, because I cross-checked suggestions with my own research and reasoned 
through trade-offs rather than accepting a generated answer.
