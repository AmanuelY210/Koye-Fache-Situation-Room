# Koye Fache Prosperity Party — Live Electors Count Management System

A real-time electors/vote counting system with User, Admin, and Live Display dashboards.

## Quick Start

```bash
setup.bat      # Install dependencies
start.bat      # Start backend (port 5000) + frontend (port 3000)
```

## URLs

| Page | URL |
|------|-----|
| Login | `http://localhost:3000/login` |
| Register | `http://localhost:3000/register` |
| Admin Panel | `http://localhost:3000/admin/dashboard` |
| Live Display | `http://localhost:3000/live-display` |

## Admin Credentials

- **Username:** `admin`
- **Password:** `admin123`
- **(Change after first login)**

## Tech Stack

- **Frontend:** React.js, Bootstrap 5, Socket.IO Client
- **Backend:** Node.js, Express, MySQL, Socket.IO
- **Auth:** JWT + bcryptjs
- **Deployment:** cPanel Node.js Selector

## Deployment

See `DEPLOY_CPANEL.md` for cPanel deployment instructions.

---

**Developed By Amanuel ICT Solution**
