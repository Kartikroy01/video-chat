# Quick Start Guide

This guide will help you get StudentConnect up and running in 5 minutes.

## Prerequisites

- Node.js v16+
- npm or yarn
- MongoDB running locally or access to MongoDB Atlas

## Step 1: Clone and Navigate

```bash
cd backend
cd frontend
```

## Step 2: Install Dependencies

**Backend:**

```bash
cd backend
npm install
```

**Frontend:**

```bash
cd frontend
npm install
```

## Step 3: Configure Environment Variables

**Backend (.env file):**

```bash
cd backend
cp .env.example .env
```

Edit backend/.env:

```
MONGODB_URI=mongodb://localhost:27017/studentconnect
JWT_SECRET=your_secret_key_change_this
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
PORT=5000
FRONTEND_URL=http://localhost:5173
```

## Step 4: Start MongoDB

```bash
mongod
```

## Step 5: Start Backend Server

```bash
cd backend
npm run dev
```

Server will run on http://localhost:5000

## Step 6: Start Frontend Development Server

In a new terminal:

```bash
cd frontend
npm run dev
```

Frontend will be available at http://localhost:5173

## 🎉 You're Ready!

1. Open http://localhost:5173 in your browser
2. Register with a student email (.edu or .ac.in)
3. Verify your email
4. Upload a student ID
5. Wait for admin approval
6. Start chatting!

## Email Configuration (Gmail)

1. Enable 2-Factor Authentication on Gmail
2. Generate App Password
3. Use the app password in .env

## Create Admin User

To create your first admin user, connect to MongoDB and run:

```javascript
use studentconnect

db.users.updateOne(
  { email: "your_email@youruni.edu" },
  { $set: { role: "admin", isApproved: true } }
)
```

## Test Accounts

Create test accounts with emails:

- test1@youruni.edu
- test2@youruni.edu

## Troubleshooting

### MongoDB Connection Error

- Ensure MongoDB is running: `mongod`
- Check connection string in .env

### Email Not Sending

- Verify Gmail app password
- Check EMAIL_USER and EMAIL_PASSWORD in .env

### CORS Error

- Ensure FRONTEND_URL matches your frontend URL
- Check backend CORS configuration

### Socket.io Connection Error

- Ensure backend is running on correct port
- Check socket connection URL in SocketContext

## Commands Reference

**Backend:**

- `npm run dev` - Start development server
- `npm start` - Start production server

**Frontend:**

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Next Steps

1. Set up a proper MongoDB instance (MongoDB Atlas recommended)
2. Configure email service properly
3. Update security settings
4. Deploy to production

For more info, see the main README.md
