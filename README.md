# Koye Fache Prosperity Party — Live Electors Count Management System

A real-time electors/vote counting system with User, Admin, and Live Display dashboards.

## Prerequisites

- **Node.js** 18.x or 20.x
- **MySQL** 8.0+
- **npm** 9+

## Setup

### 1. Database
Import the schema into your MySQL database:
```bash
mysql -u root -p < backend/config/schema_complete.sql
```
Or create the database manually and import `backend/config/schema.sql`.

### 2. Environment
```bash
cp backend/.env.example backend/.env
```
Edit `backend/.env` with your MySQL credentials.

### 3. Install
```bash
setup.bat      # Installs dependencies for backend + frontend
```

### 4. Start
```bash
start.bat      # Starts backend (port 5000) + frontend (port 3000)
```

Or individually:
```bash
cd backend && node server.js     # API on :5000
cd frontend && npm start         # UI on :3000
```

## URLs

| Page | URL |
|------|-----|
| Login | `http://localhost:3000/login` |
| Register | `http://localhost:3000/register` |
| User Dashboard | `http://localhost:3000/dashboard` |
| Admin Panel | `http://localhost:3000/admin` |
| Live Display | `http://localhost:3000/live-display` |

## Admin Credentials

- **Username:** `admin`
- **Password:** `admin123`
- **⚠️ Change after first login**

## Tech Stack

- **Frontend:** React.js 18, Bootstrap 5, Socket.IO Client
- **Backend:** Node.js, Express, MySQL 2, Socket.IO
- **Auth:** JWT + bcryptjs
- **Deployment:** cPanel Node.js Selector / Vercel

## Deployment

- **cPanel:** See `DEPLOY_CPANEL.md`
- **Vercel:** Import from GitHub, add `DATABASE_URL` env var (PlanetScale)

---

**Developed By Amanuel ICT Solution**
