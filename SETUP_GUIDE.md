# 🔐 Authentication System Setup Guide

## What You Need to Do

### 1. **Install Node.js** (if not already installed)
Download from: https://nodejs.org/

### 2. **Install MongoDB** (Database)
Download from: https://www.mongodb.com/try/download/community

**OR** use MongoDB Atlas (cloud):
- Create free account: https://www.mongodb.com/cloud/atlas
- Create cluster
- Copy connection string to `.env`

### 3. **Set Up Your Project**

```bash
# Navigate to project folder
cd /path/to/Tai-Chi

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env and add your MongoDB URI
# MONGODB_URI=mongodb://localhost:27017/tai-chi-db
```

### 4. **Start MongoDB**

**On Mac/Linux:**
```bash
mongod
```

**On Windows:**
- Open MongoDB Compass or run MongoDB service

### 5. **Start the Backend Server**

```bash
npm start
# or for development with auto-reload:
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:5000
📊 Admin dashboard: http://localhost:5000/admin
🔐 Login page: http://localhost:5000/login
```

### 6. **Test the Login Page**

Visit: **http://localhost:5000/login**

Create an account or login to test!

---

## 📂 File Structure

```
Tai-Chi/
├── server.js              ← Main backend server
├── userModel.js           ← User database model
├── loginLogModel.js       ← Login tracking model
├── authRoutes.js          ← Login/logout API routes
├── login.html             ← Login page (frontend)
├── adminDashboard.html    ← Admin tracking dashboard
├── package.json           ← Dependencies
└── .env                   ← Environment variables
```

---

## 🔗 Available URLs

| URL | Purpose |
|-----|---------|
| `http://localhost:5000/login` | User login page |
| `http://localhost:5000/admin` | Admin activity dashboard |
| `POST /api/auth/login` | Login API endpoint |
| `POST /api/auth/logout` | Logout API endpoint |
| `GET /api/auth/admin/logs` | View all login logs |
| `GET /api/auth/admin/user-logs/:userId` | View user-specific logs |

---

## 🚀 Deployment

When ready to deploy to production:

1. **Use MongoDB Atlas** (cloud database)
2. **Deploy on Heroku, Railway, or Vercel**
3. **Update `.env` with production URLs**
4. **Set `secure: true` in session cookie**

---

## 📝 Example: Creating a User (via API)

```javascript
// Create user (registration)
POST http://localhost:5000/api/auth/signup
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}

// Login
POST http://localhost:5000/api/auth/login
{
  "email": "john@example.com",
  "password": "SecurePass123"
}

// Logout
POST http://localhost:5000/api/auth/logout
```

---

## ❓ Troubleshooting

### "Cannot find module 'mongoose'"
```bash
npm install
```

### "MongoDB connection refused"
- Make sure MongoDB is running
- Check `.env` MONGODB_URI is correct

### "Port 5000 already in use"
Change in `server.js`:
```javascript
const PORT = process.env.PORT || 3000; // use 3000 instead
```

---

## 🎯 Next Steps

1. ✅ Install Node.js & MongoDB
2. ✅ Run `npm install`
3. ✅ Start MongoDB
4. ✅ Run `npm start`
5. ✅ Visit http://localhost:5000/login
6. ✅ Create test account
7. ✅ View logs at http://localhost:5000/admin

Enjoy! 🎉
