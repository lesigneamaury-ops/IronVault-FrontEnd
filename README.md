# IronVault - Frontend

IronVault is a cohort-based image gallery for Ironhack students. This is the frontend (the part users see and interact with), built with React.

## What does the frontend do?

- Lets users sign up, log in, and manage their profile
- Displays a gallery of images shared by students in the same cohort
- Lets users upload images, add captions, react with emojis, and leave comments
- Shows a "Cohort" page where students can see their classmates and social links
- Includes an admin dashboard for managing users and viewing stats
- Fully responsive (works on both desktop and mobile)

## Tech Stack

| Tool | What it does |
|------|-------------|
| **React 19** | JavaScript library for building the user interface |
| **React Router v7** | Handles page navigation without full page reloads (SPA) |
| **Axios** | Makes HTTP requests to the backend API |
| **Vite** | Development server and build tool (very fast) |
| **CSS** | Custom styling with CSS variables, no external UI library |

## Project Structure

```
IronVault-FrontEnd/
├── public/
│   ├── assets/               # Images (logos, backgrounds, default avatar)
│   └── _redirects             # Netlify config for SPA routing
├── src/
│   ├── main.jsx               # Entry point, wraps app with Router + AuthProvider
│   ├── App.jsx                # All routes and route guards
│   ├── App.css                # Global styles, CSS variables, shared classes
│   ├── config/
│   │   └── config.js          # API_URL constant
│   ├── context/
│   │   └── AuthContext.jsx    # Auth state (current user, login check, loading)
│   ├── components/
│   │   ├── Navbar.jsx         # Top navigation bar
│   │   ├── Sidebar.jsx        # Side menu with links
│   │   └── Footer.jsx         # Footer with GitHub link
│   ├── layouts/
│   │   ├── UserLayout.jsx     # Layout for logged-in users (Navbar + Sidebar + Footer)
│   │   ├── AdminLayout.jsx    # Layout for admin pages
│   │   └── AuthLayout.jsx     # Layout for login/signup pages
│   └── pages/
│       ├── auth/
│       │   ├── LoginPage.jsx  # Login form
│       │   └── SignupPage.jsx # Signup form
│       ├── user/
│       │   ├── HomePage.jsx       # Main gallery + upload form
│       │   ├── ProfilePage.jsx    # User profile + social links editor
│       │   ├── CohortPage.jsx     # List of students in your cohort
│       │   ├── ReactedPage.jsx    # Items you reacted to
│       │   └── ItemDetailsPage.jsx # Modal with full image, comments, reactions
│       └── admin/
│           └── AdminDashboard.jsx # Stats + user management (admin only)
```

## Pages Overview

### Login & Signup
- Simple forms with email and password
- Password must be at least 6 characters (signup)
- Shows success messages ("Account created!" / "Login successful!")
- Buttons are disabled while the request is loading to prevent double-clicks
- After login/signup, the user is redirected to the home page

### Home (Gallery)
- Shows all images posted by students in your cohort
- Upload form at the top: choose an image file and add an optional caption
- Click on any image to open a detail modal with comments and reactions

### Item Details (Modal)
- Opens as an overlay on top of the current page
- Shows the full image, caption, who posted it, and when
- Emoji reactions: click to add/remove your reaction
- Comments section: read, add, and delete your own comments
- Edit/delete buttons appear only if you are the author
- Press Escape or click outside to close
- Asks for confirmation before deleting

### Profile
- Shows your avatar, name, email, and cohort
- Edit mode lets you update social links (GitHub, LinkedIn, Instagram, Twitter)
- Upload a new profile picture (sent to Cloudinary)

### Cohort
- Lists all students in your cohort with their profile picture and social links
- Social links are validated to prevent unsafe URLs

### Reacted
- Shows all items you have reacted to
- Same image grid and detail modal as the home page

### Admin Dashboard (Admin only)
- Shows stats: total users, items, and comments
- List of all users with their role and cohort
- Admin can change user roles and assign cohorts
- Admin can delete users

## How Authentication Works (Frontend Side)

1. **AuthContext** wraps the entire app and provides `currentUser`, `isLoading`, and `authenticateUser()`
2. On app load, `authenticateUser()` reads the JWT token from `localStorage` and calls `GET /auth/verify` to check if it's still valid
3. If valid, the user data is stored in state. If not, the token is removed
4. **Route Guards** in App.jsx:
   - `ProtectedRoute`: Only lets logged-in users through. Redirects to `/login` if not authenticated
   - `PublicOnlyRoute`: Only lets non-logged-in users through. Redirects to `/` if already authenticated
   - `AdminRoute`: Only lets users with `role: "ADMIN"` through
5. Every API request sends the token in the `Authorization: Bearer <token>` header

## How to Run Locally

### 1. Clone the repo
```bash
git clone <your-frontend-repo-url>
cd IronVault-FrontEnd
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set the API URL
Open `src/config/config.js` and make sure `API_URL` points to your backend:
```js
export const API_URL = "http://localhost:5005";
```

### 4. Start the dev server
```bash
npm run dev
```

The app will open at `http://localhost:5173`.

### 5. Build for production
```bash
npm run build
```

This creates a `dist/` folder ready to deploy.

## Deployment

The frontend is deployed on **Netlify**. The `public/_redirects` file ensures that all routes are handled by React Router (instead of returning 404 for direct URL access):

```
/*    /index.html   200
```
