# Unimate

Unimate is a full-stack campus services platform built with a React client and a Node.js/Express backend. It includes student-facing and admin/staff-facing flows for major university services such as canteen services, Lost & Found, Sports, and Clubs.

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
- Can access student features such as canteen, Lost & Found, Sports, and Clubs
- Feature-specific pages depend on what is enabled in the current branch

### Staff users
- Are redirected to `/staff`

### Clubs admin users
A Clubs admin must satisfy both of these conditions:
- `role === "admin"`
- `permissions` includes `"clubs_admin"`

When such a user logs in, they are redirected to:

```text
/clubs/admin
```

A normal admin without the `clubs_admin` permission should not access the Clubs admin dashboard.

### Sports admin users
A Sports admin must satisfy both of these conditions:
- `role === "admin"`
- `permissions` includes `"sports_admin"`

When such a user logs in or accesses Sports admin routes, they should be allowed into:

```text
/sports/admin
```

A normal admin without the `sports_admin` permission should not access Sports admin pages.

---

## Sports Feature Notes

The Sports feature is fully integrated into the main Unimate app and uses the shared app authentication/session flow.

### Student-side Sports routes
- `/sports`
- `/sports/book/facilities`
- `/sports/book/services`
- `/sports/my-bookings`

### Sports admin routes
- `/sports/admin`
- `/sports/admin/facilities`
- `/sports/admin/bookings`
- `/sports/admin/slots`
- `/sports/admin/reports`
- `/sports/admin/priority`
- `/sports/admin/occupancy`

### Sports admin access rule
Only users with both:

```js
role === "admin" && permissions.includes("sports_admin")
```

should be able to access Sports admin pages.

### Sports setup notes
Initial Sports testing usually requires:
- creating at least one Sports facility
- creating at least one Sports service
- generating slots before testing booking flows

### Sports feature notes
- Student pages and admin pages use the shared Sports layout/navbar
- Student Sports pages should show student navigation only
- Sports admin pages should show admin navigation only
- The logout confirmation modal is shared through the Sports navbar

---

## Clubs Feature Notes

The Clubs feature is integrated into the main Unimate app rather than running as a separate mini-app.

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

## Lost & Found Feature Notes

Lost & Found is integrated into the main Unimate app. Student-facing Lost & Found pages use the shared main app authentication flow, while Lost & Found admin access currently uses a separate admin session flag stored in localStorage.

### Student-side Lost & Found routes
- `/lost-found`
- `/lost-found/report-lost`
- `/lost-found/report-found`
- `/lost-found/browse`
- `/lost-found/item/:id`
- `/lost-found/claim/:id`
- `/lost-found/my-reports`
- `/lost-found/messages`
- `/lost-found/submission-success`

### Admin-side Lost & Found routes
- `/lost-found/admin-login`
- `/lost-found/admin`

### Routing and auth notes
- Student Lost & Found pages are wrapped with `ProtectedRoute allowedRoles={["student"]}`
- Student Lost & Found pages use `LostFoundLayout`
- `/lost-found/admin` is protected by `LostFoundAdminRouteGuard`
- if Lost & Found admin authentication is missing, users are redirected to `/lost-found/admin-login`
- the attempted route is preserved in router state for post-login redirect
- Lost & Found admin authentication is currently checked using a separate localStorage flag:
  - key: `lf_admin_auth`
  - authenticated value: `"true"`
- Lost & Found also stores a current user email separately in localStorage:
  - key: `lf_user_email`

### Typical Lost & Found student usage
Students should be able to:
- access the Lost & Found entry point from the dashboard or main navigation
- create lost item reports
- create found item reports
- browse item listings
- view item details and status
- access claim flows
- view their own reports and messages

### Typical Lost & Found admin usage
Depending on your branch implementation, Lost & Found admins may be able to:
- review submitted reports
- update report status
- mark items as claimed/resolved
- manage listings or moderation actions

### Lost & Found testing notes
When testing Lost & Found on a fresh setup, verify:
- `/lost-found` loads correctly
- report lost and report found flows work
- browse page loads correctly
- item detail page loads correctly
- claim flow works if applicable
- my reports and messages pages load correctly
- uploaded images or attachments work if supported
- item status updates persist after refresh
- authenticated Lost & Found admin can access `/lost-found/admin`
- unauthenticated access to `/lost-found/admin` redirects to `/lost-found/admin-login`
- Lost & Found admin login correctly sets `lf_admin_auth` in localStorage

---

## Uploads Directory

If the project uses payment slip uploads, make sure this folder exists:

```bash
mkdir -p server/uploads/payment-slips
```

If Lost & Found or other features use uploads in your branch, make sure the required upload folders also exist and are served correctly.

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
3. Student can open Clubs pages:
   - `/clubs`
   - `/clubs/my-applications`
   - `/clubs/advisor`
   - `/clubs/chat`
4. Clubs admin with correct permission is redirected to `/clubs/admin`
5. Non-clubs-admin users cannot access `/clubs/admin`
6. Student can open Sports pages:
   - `/sports`
   - `/sports/book/facilities`
   - `/sports/book/services`
   - `/sports/my-bookings`
7. Sports admin with correct permission can access:
   - `/sports/admin`
   - `/sports/admin/facilities`
   - `/sports/admin/bookings`
   - `/sports/admin/slots`
   - `/sports/admin/reports`
   - `/sports/admin/priority`
   - `/sports/admin/occupancy`
8. Non-sports-admin users cannot access Sports admin pages
9. Student can open Lost & Found pages:
   - `/lost-found`
   - `/lost-found/report-lost`
   - `/lost-found/report-found`
   - `/lost-found/browse`
   - `/lost-found/my-reports`
   - `/lost-found/messages`
10. Student can open Lost & Found item and claim flows if test data exists:
    - `/lost-found/item/:id`
    - `/lost-found/claim/:id`
11. Lost & Found admin login page loads:
    - `/lost-found/admin-login`
12. Authenticated Lost & Found admin can access:
    - `/lost-found/admin`
13. Unauthenticated access to `/lost-found/admin` redirects to `/lost-found/admin-login`

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

### Uploaded files are not opening
Check:
- backend is serving upload directories statically
- required upload folders exist

### Clubs admin login does not redirect correctly
Check:
- login response includes `permissions`
- the stored `user` object in localStorage includes `permissions`
- the user has both:
  - `role: "admin"`
  - `permissions: ["clubs_admin"]`

### Sports admin navbar shows student links
Check:
- `SportsLayout` passes the stored `user` object into `Navbar`
- the stored `user` object in localStorage includes `permissions`
- the user has both:
  - `role: "admin"`
  - `permissions: ["sports_admin"]` or `permissions: "sports_admin"`

### Sports admin access does not work
Check:
- route guards are using strict Sports admin logic
- the logged-in user includes the `sports_admin` permission
- localStorage `user` matches the backend login response

### Sports booking creation fails on cancel deadline
Check:
- Sports global rules model/defaults are correct
- cancellation rule fields exist and are numeric
- booking date/time parsing is valid in the booking controller

### Lost & Found admin access does not work
Check:
- `lf_admin_auth` exists in localStorage
- `lf_admin_auth` is exactly `"true"`
- unauthenticated users should be redirected to `/lost-found/admin-login`
- Lost & Found admin auth is separate from the main app admin permission model

### Theme looks inconsistent on integrated pages
Check:
- page-specific CSS was updated to use the shared theme variables
- old standalone light-theme CSS was not left behind in integrated pages

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
9. Test Clubs student routes if relevant to your branch
10. Test Clubs admin access if relevant to your branch
11. Test Sports student routes if relevant to your branch
12. Test Sports admin access if relevant to your branch
13. Test Lost & Found flows if relevant to your branch

---

## Git Workflow

After completing changes:

```bash
git status
git add .
git commit -m "Your commit message"
git push origin <your-branch-name>
```

Examples:

```bash
git commit -m "Integrate clubs feature with main app auth and routing"
git commit -m "Complete sports feature integration and admin workflow"
```

---

## Notes

- Keep backend auth responses consistent with frontend needs. If role-based frontend routing depends on fields like `permissions` or `staffType`, make sure those are returned in the login/profile payloads.
- If you reseed the database, ensure any Clubs admin test user includes the `clubs_admin` permission.
- If you reseed the database, ensure any Sports admin test user includes the `sports_admin` permission.
- If frontend routing depends on `permissions`, make sure the stored `user` object in localStorage includes those values.
- For Sports testing, create facilities/services and generate slots before testing bookings.
- Lost & Found admin access currently uses a separate localStorage-based admin session flag (`lf_admin_auth`) rather than the shared Clubs/Sports role-permission model.