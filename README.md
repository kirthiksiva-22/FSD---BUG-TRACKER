# FSD---BUG-TRACKER
# Bug Reporting and Issue Tracking System

A full stack web application to report bugs, assign priority, update status and maintain a complete issue history.

## Features
- Register and login with two roles: **Reporter** and **Developer**
- Report a bug with title, description and priority (Low / Medium / High / Critical)
- View all bugs and filter by status and priority
- Developers can change status, priority and assign bugs to developers
- Bug life cycle: Open → In Progress → Resolved → Closed
- **Issue history:** every change is saved with who changed it, old value, new value and time
- Secure login using JWT, with passwords stored as bcrypt hashes

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React, Vite, React Router |
| Backend | Node.js, Express |
| Database | SQLite (better-sqlite3) |
| Auth | JWT, bcryptjs |

## Project Structure
```
bug-tracker
├── server
│   ├── db.js          database and tables
│   ├── server.js      API routes
│   └── test.js        API test script
└── client
    └── src
        ├── pages      Login, BugList, ReportBug, BugDetail
        ├── api.js
        ├── Navbar.jsx
        └── App.jsx
```

## How to Run

**Requirements:** Node.js 18 or higher

1. Clone the repository
   ```
   git clone https://github.com/<your-username>/bug-tracker.git
   cd bug-tracker
   ```
2. Start the server
   ```
   cd server
   npm install
   node server.js
   ```
   The server runs on http://localhost:5000
3. Start the client (in a new terminal)
   ```
   cd client
   npm install
   npm run dev
   ```
   Open http://localhost:5173

## API Endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/auth/register | Create a user |
| POST | /api/auth/login | Login and get token |
| GET | /api/users | List developers |
| POST | /api/bugs | Report a bug |
| GET | /api/bugs | List bugs (filters: status, priority) |
| GET | /api/bugs/:id | Bug details with history |
| PUT | /api/bugs/:id | Update bug and log history |

## Database Tables
- **users**: id, name, email, password, role
- **bugs**: id, title, description, priority, status, reported_by, assigned_to, created_at
- **history**: id, bug_id, changed_by, field, old_value, new_value, changed_at

## Screenshots
Add your screenshots here.

## Future Scope
Comments, file attachments, email notifications, dashboard charts, admin role, online hosting.

## Author
Kirthik Siva T.
