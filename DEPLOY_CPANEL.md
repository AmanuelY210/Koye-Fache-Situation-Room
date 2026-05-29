# Koye Fache Prosperity Party - Live Electors Count
## cPanel Deployment Guide

---

## PREREQUISITES

- cPanel with **Node.js Selector** (Setup Node.js App) enabled
- **MySQL** database (create via cPanel MySQL Wizard)
- Domain or subdomain (e.g., `electors.yourparty.com`)

---

## STEP 1: Create MySQL Database

1. Log into **cPanel**
2. Go to **MySQL Databases** (or MySQL Database Wizard)
3. Create a new database: `party_electors`
4. Create a database user with a strong password
5. Add the user to the database with **ALL PRIVILEGES**
6. Note down database name, username, password, and host (usually `localhost`)

---

## STEP 2: Upload Files

### Option A: cPanel File Manager
1. In cPanel, open **File Manager**
2. Navigate to your domain's root (e.g., `public_html`)
3. Upload the `deploy` folder contents
4. Extract if using ZIP

### Option B: FTP
1. FTP to your cPanel account
2. Upload the entire project to a folder like `electors/`
3. Recommended structure:
```
home/youruser/
  └── electors/
      ├── backend/        (Node.js API)
      ├── frontend/build/ (React static files)
      ├── setup.bat
      └── start.bat
```

---

## STEP 3: Configure Environment

1. Open `backend/.env` file
2. Update with your MySQL credentials:
```
PORT=5000
DB_HOST=localhost
DB_USER=your_cpanel_mysql_user
DB_PASSWORD=your_cpanel_mysql_password
DB_NAME=party_electors
JWT_SECRET=your_strong_random_secret_key
JWT_EXPIRES_IN=24h
```

---

## STEP 4: Setup Node.js App in cPanel

1. In cPanel, go to **Setup Node.js App** (under Software)
2. Click **Create Application**
3. Fill in:
   - **Node.js version**: Select 18.x or 20.x
   - **Application mode**: Production
   - **Application root**: `electors/backend` (or your path)
   - **Application URL**: your domain/subdomain
   - **Application startup file**: `server.js`
   - **Passenger log file**: (auto-filled)
   - **Environment variables**: Add these:
     - `PORT` = `5000`
     - `DB_HOST` = `localhost`
     - `DB_USER` = (your MySQL user)
     - `DB_PASSWORD` = (your MySQL password)
     - `DB_NAME` = `party_electors`
     - `JWT_SECRET` = (your secret key)
4. Click **Create**

---

## STEP 5: Install Dependencies

After creating the Node.js app:

1. In the **Setup Node.js App** page, find your app
2. Click **Run npm install**
3. Wait for installation to complete

Or via SSH:
```bash
cd ~/electors/backend
npm install --production
```

---

## STEP 6: Import Database Schema

### Via phpMyAdmin:
1. In cPanel, open **phpMyAdmin**
2. Select your database: `party_electors`
3. Click **Import** tab
4. Choose file: `backend/config/schema.sql`
5. Click **Go**

### Via SSH:
```bash
mysql -u youruser -p party_electors < ~/electors/backend/config/schema.sql
```

---

## STEP 7: Start the Application

1. In **Setup Node.js App**, click **Start App** (or Restart)
2. Wait for the status to show **Running**

---

## STEP 8: Verify Deployment

### Test API:
Visit `https://yourdomain.com/api/health`
- Expected: `{"status":"OK","message":"Live Electors API is running."}`

### Test Frontend:
Visit `https://yourdomain.com/`
- Expected: Login page loads

### Test Live Display:
Visit `https://yourdomain.com/live-display`
- Expected: Full-screen live counter

---

## TROUBLESHOOTING

### ❌ 500 Internal Server Error
- Check Node.js app logs in cPanel (Setup Node.js App → Logs)
- Ensure `.env` has correct database credentials
- Run `npm install` again

### ❌ Cannot GET / (Blank Page)
- Make sure the frontend build exists at `frontend/build/`
- Check that `server.js` can find the build path
- Try restarting the Node.js app

### ❌ Database Connection Error
- Verify MySQL host, user, password in `.env`
- Make sure the database was created with the schema
- Check if MySQL is running in cPanel

### ❌ Socket.IO / Real-time Not Working
- cPanel may need WebSocket support enabled
- Contact your hosting provider to enable WebSockets
- Port 5000 must be accessible for Socket.IO

### ❌ File Upload Not Working
- Check `uploads/` folder permissions (755)
- Ensure the directory exists
- Max upload size may be limited by cPanel

---

## ADMIN ACCESS

After deployment:
- **URL**: `https://yourdomain.com/login`
- **Username**: `admin`
- **Password**: `admin123`

> ⚠️ **IMPORTANT**: Change the admin password immediately after first login!

---

## MAINTENANCE

### Update Frontend:
```bash
cd ~/electors/frontend
npm run build
```

### Restart App:
In cPanel **Setup Node.js App** → click **Restart**

### View Logs:
In cPanel **Setup Node.js App** → click **Logs**

---

## SUPPORT

Developed By **Amanuel ICT Solution**

For support, contact your system administrator.
