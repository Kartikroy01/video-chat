# 🎓 StudentConnect - Complete Installation & Setup Guide

## What You've Received

A **production-ready full-stack web application** that allows verified students to chat anonymously with other students. This is a complete implementation similar to Omegle, tailored specifically for student verification and safety.

### ✅ What's Included

**Backend (Node.js + Express)**

- ✓ User authentication (registration, email verification, login)
- ✓ Student verification system (email + ID upload)
- ✓ Admin approval workflow
- ✓ Real-time random chat matching with Socket.io
- ✓ Friend system with requests/acceptance
- ✓ Report & block user features
- ✓ Admin dashboard with analytics
- ✓ Bad word filter & rate limiting
- ✓ Production-ready security (JWT, bcrypt, CORS, Helmet)

**Frontend (React + Vite)**

- ✓ Beautiful, responsive UI (mobile-friendly)
- ✓ User registration & email verification
- ✓ Student ID upload interface
- ✓ Real-time chat interface
- ✓ Friend management UI
- ✓ Admin dashboard
- ✓ Socket.io integration
- ✓ Modern React patterns (Context API, custom hooks)

**Database (MongoDB)**

- ✓ User schema with anonymous names
- ✓ Chat & message storage
- ✓ Report system
- ✓ Proper indexing & relationships

## 📦 Installation (Step-by-Step)

### Prerequisites

1. **Install Node.js** (v16+)
   - Download from https://nodejs.org/
   - Verify: `node --version` and `npm --version`

2. **Install MongoDB** (v4.4+)
   - **Option A**: Local - https://docs.mongodb.com/manual/installation/
   - **Option B**: Cloud - https://www.mongodb.com/cloud/atlas (Free)

3. **Text Editor**
   - VS Code (recommended) - https://code.visualstudio.com/

### Step 1: Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Edit backend/.env with your details:**

```
MONGODB_URI=mongodb://localhost:27017/studentconnect
JWT_SECRET=your_super_secret_key_change_this_12345
JWT_EXPIRE=7d

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password

PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

**Gmail Setup for Email:**

1. Enable 2-Factor Authentication on Gmail account
2. Go to https://myaccount.google.com/apppasswords
3. Generate App Password
4. Use this password in EMAIL_PASSWORD

### Step 2: Setup Frontend

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install
```

Frontend doesn't need additional config - it uses environment defaults.

### Step 3: Start Services

**Terminal 1 - Start MongoDB:**

```bash
mongod
```

(If using MongoDB Atlas, skip this step)

**Terminal 2 - Start Backend:**

```bash
cd backend
npm run dev
```

Backend runs on: **http://localhost:5000**

**Terminal 3 - Start Frontend:**

```bash
cd frontend
npm run dev
```

Frontend runs on: **http://localhost:5173**

## 🚀 Testing the Application

### 1. Create Test Account

1. Go to http://localhost:5173
2. Click "Register"
3. Use email with .edu domain
   - Example: `testuser@university.edu`
   - Or: `student@youruni.ac.in`

### 2. Verify Email

- Check spam/inbox for verification email
- Click verification link in email
- Or copy token and paste in verification form

### 3. Upload Student ID

- Upload any image as "student ID"
- (For testing, any .jpg/.png works)

### 4. Wait for Admin Approval

- Or manually approve yourself in MongoDB:

```javascript
use studentconnect

db.users.updateOne(
  { email: "testuser@university.edu" },
  { $set: { isApproved: true } }
)
```

### 5. Go to Dashboard & Chat

- Click "Start Random Chat"
- Open another browser/incognito and register another account
- Both should match and can chat!

## 🎮 Key Features to Test

1. **Random Chat**: Start chat → get matched → send messages → next chat
2. **Friend System**: Send request → other user receives → accept → added to friends
3. **Admin Panel**: Register with admin account → approve users → view reports
4. **Blocking**: Block users during chat → can't receive messages
5. **Reporting**: Report misbehavior → admin reviews → can ban user
6. **Anonymous Names**: See auto-generated names like "SilentTiger42"

## 📁 Important Files & Customization

### Backend Configuration

- **Database models**: `backend/models/*.js` - Modify user schema here
- **Email templates**: `backend/utils/emailService.js` - Customize emails
- **Bad words**: `backend/utils/badWordFilter.js` - Add more words
- **Matching logic**: `backend/utils/matchingQueue.js` - Change algorithm

### Frontend Customization

- **Colors & Theme**: `frontend/src/index.css` - Change CSS variables
- **Pages**: `frontend/src/pages/*.jsx` - All page components
- **Logo**: Update in `Navbar.jsx`
- **Feature text**: Home page content in `frontend/src/pages/Home.jsx`

### Database

- Direct access: MongoDB Compass - https://www.mongodb.com/products/compass
- Inspect users, chats, reports in collections
- Create admin manually if needed

## 🔧 Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"

**Solution:**

- Ensure MongoDB is running (`mongod` in terminal)
- Or check MongoDB Atlas connection string in .env

### Issue: "Email not sending"

**Solution:**

- Verify Gmail app password (not regular password)
- Check EMAIL_USER and EMAIL_PASSWORD in .env
- Enable "Less secure app access" if needed

### Issue: "Socket.io connection error"

**Solution:**

- Ensure backend is running on http://localhost:5000
- Check FRONTEND_URL in backend .env

### Issue: "Blank page on frontend"

**Solution:**

- Check browser console (F12) for errors
- Ensure frontend is running on http://localhost:5173
- Try clearing browser cache

### Issue: "Module not found"

**Solution:**

- Run `npm install` again in the directory
- Delete node_modules and package-lock.json, then reinstall
- Ensure you're in correct directory

## 📚 Documentation Files

- **README.md** - Complete project overview
- **QUICKSTART.md** - 5-minute quick setup
- **DEPLOYMENT.md** - Production deployment guide
- **PROJECT_STRUCTURE.md** - Architecture & data flows
- **This file** - Installation guide

## 🔐 Security Notes

1. **Change JWT_SECRET** - Update to a strong random value
2. **Production Database** - Use MongoDB Atlas, not local
3. **Environment Variables** - Never commit .env file
4. **HTTPS** - Use HTTPS in production
5. **Email Service** - Use SendGrid/Mailgun in production
6. **File Storage** - Use AWS S3 for student IDs in production

## 📊 Database Models

### User

```javascript
{
  name: "John Doe",
  email: "john@university.edu",
  anonymousName: "SilentTiger42",
  institutionName: "University Name",
  isVerified: true,
  isApproved: true,
  role: "user|admin",
  friends: [ObjectId...],
  ...
}
```

### Chat

```javascript
{
  participants: [{userId, anonymousName}, ...],
  messages: [{sender, message, timestamp}, ...],
  status: "active|ended"
}
```

## 🎯 What's Next?

1. **Customize branding** - Update colors, logo, text
2. **Add more features** - Video calls (WebRTC ready), interests matching
3. **Deploy to production** - See DEPLOYMENT.md
4. **Email service** - Switch from Gmail to SendGrid
5. **Monitoring** - Add Sentry/DataDog for error tracking
6. **Database** - Move to MongoDB Atlas or production DB
7. **File storage** - Move uploads to AWS S3

## 💡 Pro Tips

- Use MongoDB Compass GUI for easy database inspection
- Use Postman to test API endpoints
- Test Socket.io in incognito windows (separate sessions)
- Check network tab (F12) to debug Socket.io connections
- Use `npm run dev` for hot reload during development

## 🆘 Need Help?

1. Check the documentation files (README, DEPLOYMENT, PROJECT_STRUCTURE)
2. Review code comments in source files
3. Check browser console for errors (F12)
4. Check backend console for error messages
5. Verify environment variables are correct

## ✨ Production Checklist

Before going live:

- [ ] Change all secrets (JWT_SECRET, etc.)
- [ ] Setup production MongoDB
- [ ] Configure production email service
- [ ] Enable HTTPS
- [ ] Update FRONTEND_URL and API endpoints
- [ ] Test on production domain
- [ ] Setup backups
- [ ] Enable monitoring
- [ ] Update privacy policy & terms
- [ ] Test with actual student emails

## 📞 Support

For questions about setup or architecture:

1. Review documentation files
2. Check code comments
3. Inspect error messages
4. Review Socket.io and Express.js official docs

---

## 🎉 You're All Set!

Your StudentConnect platform is ready to use. Start with testing, customize it for your needs, and deploy to production when ready.

**Happy coding! 🚀**

Created with ❤️ - StudentConnect Team
