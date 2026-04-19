# Unimate

UniMate is a full-stack campus services platform built with a React client and a Node.js/Express backend. It currently includes student-facing and admin/staff-facing flows for features such as canteen services, lost and found, sports, and clubs.

This README explains how to set up the project on a new machine, run both applications locally, understand the main login behavior, and avoid common setup issues.

---

## Tech Stack

### Frontend
- React
- Vite
- React Router

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT-based authentication

---

## Project Structure

```text
unimatecoding/
├── client/     # React frontend
├── server/     # Express backend
└── README.md
```

---

## Getting Started

### 1. Clone the repository

If you are cloning the project for the first time:

```bash
git clone <your-repo-url>
cd unimatecoding
git checkout <your-branch-name>
```

If you already have the repository locally:

```bash
git fetch
git checkout <your-branch-name>
git pull origin <your-branch-name>
```

---

## Install Dependencies

You need to install dependencies separately for the backend and frontend.

### Server

```bash
cd server
npm install
```

### Client

```bash
cd ../client
npm install
```

---

## Environment Variables

You need `.env` files in both the `server` and `client` folders.

### Server environment file

Create:

```text
server/.env
```

Example:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Add any other server environment variables required by your branch.

### Client environment file

Create:

```text
client/.env
```

Example:

```env
VITE_API_BASE_URL=http://127.0.0.1:5001/api
```

---

## Running the Project

### Start the backend

From the `server` folder:

```bash
npm run dev
```

Expected backend URL:

```text
http://127.0.0.1:5001
```

### Start the frontend

Open a second terminal and run:

```bash
cd client
npm run dev
```

Expected frontend URL:

```text
http://localhost:5173
```

### Open the app

Open the frontend in your browser:

```text
http://localhost:5173
```

---

## Login and Routing Behavior

The app uses role-based routing.

### Student users
- Log in to the main dashboard
- Can access student features such as canteen, lost and found, sports, and clubs
- Clubs student pages include routes such as:
  - `/clubs`
  - `/clubs/advisor`
  - `/clubs/chat`
  - `/clubs/my-applications`

### Staff users
- Are redirected to `/staff`

### Clubs admin users
A clubs admin must satisfy both of these conditions:
- `role === "admin"`
- `permissions` includes `"clubs_admin"`

When such a user logs in, they are redirected to:

```text
/clubs/admin
```

A normal admin without the `clubs_admin` permission should not access the Clubs admin dashboard.

---

## Clubs Feature Notes

The Clubs feature is now integrated into the main UniMate app rather than running as a separate mini-app.

### Student-side Clubs routes
- `/clubs`
- `/clubs/advisor`
- `/clubs/chat`
- `/clubs/my-applications`

### Clubs admin route
- `/clubs/admin`

### Clubs auth note
`/clubs/auth` may still exist as a transition route, but Clubs now uses the main app login/session flow.

### Clubs admin access rule
Only users with both:

```js
role === "admin" && permissions.includes("clubs_admin")
```

should be able to access the Clubs admin dashboard.

---

## Uploads Directory

If the project uses payment slip uploads, make sure this folder exists:

```bash
mkdir -p server/uploads/payment-slips
```

---

## MongoDB Setup Notes

### MongoDB Atlas
If you are using MongoDB Atlas, place your Atlas connection string in `server/.env`:

```env
MONGO_URI=your_atlas_connection_string
```

### Local MongoDB
If you are using a local MongoDB instance, make sure MongoDB is running and use something like:

```env
MONGO_URI=mongodb://127.0.0.1:27017/unimatecoding
```

---

## Quick Start

Use this order when setting up the project on a new device:

```bash
git checkout <your-branch-name>

cd server
npm install
# create server/.env
npm run dev

cd ../client
npm install
# create client/.env
npm run dev
```

---

## Suggested Smoke Test After Setup

After starting both apps, verify the following:

1. Student can log in and reach the dashboard
2. Staff user can log in and reach `/staff`
3. Student can open Clubs from the dashboard or header nav
4. Clubs pages load without request loops:
   - `/clubs`
   - `/clubs/my-applications`
   - `/clubs/advisor`
   - `/clubs/chat`
5. Clubs admin with correct permission is redirected to `/clubs/admin`
6. Non-clubs-admin users cannot access `/clubs/admin`

---

## Common Problems

### Port already in use
If port `5001` or `5173` is already in use, stop the existing process or change the port in the relevant config.

### Backend not connecting
Check:
- `MONGO_URI`
- internet connection if using Atlas
- local MongoDB service if using a local database

### Frontend cannot call backend
Check:
- `VITE_API_BASE_URL` in `client/.env`
- backend is running on port `5001`
- there are no typos in the `.env` file

### Uploaded slips are not opening
Check:
- backend is serving `/uploads` statically
- `server/uploads/payment-slips` exists

### Clubs admin login does not redirect correctly
Check:
- login response includes `permissions`
- the stored `user` object in localStorage includes `permissions`
- the user has both:
  - `role: "admin"`
  - `permissions: ["clubs_admin"]`

---

## Recommended Workflow for a New Developer

1. Pull the correct branch
2. Install server dependencies
3. Install client dependencies
4. Add both `.env` files
5. Start the backend
6. Start the frontend
7. Test student login
8. Test staff login
9. Test Clubs student routes
10. Test Clubs admin access if relevant to your branch

---

## Git Workflow

After completing changes:

```bash
git status
git add .
git commit -m "Your commit message"
git push origin <your-branch-name>
```

Example:

```bash
git commit -m "Integrate clubs feature with main app auth and routing"
```

---

## Notes

- Keep backend auth responses consistent with frontend needs. If role-based frontend routing depends on fields like `permissions` or `staffType`, make sure those are returned in the login/profile payloads.
- If you reseed the database, ensure any clubs admin test user includes the `clubs_admin` permission.
```