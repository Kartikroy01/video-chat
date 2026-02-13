# StudentConnect - Verified Anonymous Student Chat Platform

StudentConnect is a full-stack web application that allows verified students to connect anonymously through text and video chat. It's similar to Omegle but exclusively for students with valid college email addresses.

## 🎯 Key Features

### 🔐 Verification System

- Student email verification (.edu, .ac.in, university domains)
- Student ID card upload for verification
- Admin approval system before chat access
- Two-factor authentication ready

### 🕶️ Anonymous Identity

- Auto-generated anonymous names (e.g., `SilentTiger42`)
- Real names and personal information kept private during chats
- Institution name visible for context
- Identity protection is the core feature

### 💬 Chat Features

- **Random Matching**: Meet random verified students instantly
- **Text Chat**: Real-time messaging with Socket.io
- **Typing Indicators**: See when others are typing
- **Next Button**: Skip to the next match without awkwardness
- **Video Chat**: WebRTC integration for face-to-face calls (framework ready)

### 👥 Friend System

- Send friend requests after chats
- Accept/reject pending requests
- View friend list
- Private messaging with friends
- Still maintain anonymous identities

### 🛡️ Safety Features

- Report inappropriate users
- Block users
- Bad word filter
- Rate limiting
- Admin ban system
- Auto-disconnect on multiple reports

### 🧑‍💼 Admin Panel

- Approve/reject student verifications
- View uploaded student IDs
- Ban misbehaving users
- View and resolve reports
- Monitor active chats
- Dashboard with platform analytics

## 🛠 Tech Stack

### Frontend

- **React 18** with Vite
- **Socket.io Client** for real-time communication
- **Axios** for API calls
- **React Router DOM** for navigation
- **CSS3** for responsive design

### Backend

- **Node.js** with Express.js
- **MongoDB** for data persistence
- **Socket.io** for real-time events
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Nodemailer** for email verification
- **Multer** for file uploads
- **Express Validator** for input validation
- **Helmet** for security headers
- **Express Rate Limit** for DDoS protection

## 📂 Project Structure

```
studentconnect/
├── backend/
│   ├── config/
│   │   ├── database.js
│   │   └── multer.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── chatController.js
│   │   └── adminController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Chat.js
│   │   └── Report.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── chatRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── utils/
│   │   ├── emailService.js
│   │   ├── badWordFilter.js
│   │   └── matchingQueue.js
│   ├── socket/
│   │   └── socketHandler.js
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── Navbar.css
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── SocketContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── VerifyEmail.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Chat.jsx
│   │   │   ├── Friends.jsx
│   │   │   ├── PrivateChat.jsx
│   │   │   ├── UploadStudentId.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── (all corresponding CSS files)
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .gitignore
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- MongoDB 4.4+
- Git

### Backend Setup

1. **Navigate to backend directory**

```bash
cd backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment variables**

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```
MONGODB_URI=mongodb://localhost:27017/studentconnect
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

4. **Start MongoDB**

```bash
mongod
```

5. **Start the server**

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**

```bash
cd frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the development server**

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📚 API Documentation

### Authentication Endpoints

#### Register

```
POST /api/auth/register
Body: {
  name: string,
  email: string (student email),
  password: string,
  institutionName: string,
  course: string,
  year: string (1st-5th)
}
```

#### Login

```
POST /api/auth/login
Body: {
  email: string,
  password: string
}
Response: {
  token: JWT,
  user: { id, name, email, anonymousName, institutionName, role }
}
```

#### Verify Email

```
POST /api/auth/verify-email
Body: {
  token: string
}
```

#### Upload Student ID

```
POST /api/auth/upload-student-id
Headers: Authorization: Bearer {token}
Body: FormData with file: studentId.jpg
```

### Chat Endpoints

#### Report User

```
POST /api/chat/report
Headers: Authorization: Bearer {token}
Body: {
  reportedUserId: string,
  reason: string (Harassment|Inappropriate Content|Spam|Hate Speech|Other),
  description: string
}
```

#### Block User

```
POST /api/chat/block-user
Headers: Authorization: Bearer {token}
Body: {
  blockedUserId: string
}
```

#### Send Friend Request

```
POST /api/chat/send-friend-request
Headers: Authorization: Bearer {token}
Body: {
  recipientId: string
}
```

#### Get Friends

```
GET /api/chat/friends
Headers: Authorization: Bearer {token}
```

### Admin Endpoints

#### Get Dashboard

```
GET /api/admin/dashboard
Headers: Authorization: Bearer {token}
```

#### Get Pending Approvals

```
GET /api/admin/pending-approvals
Headers: Authorization: Bearer {token}
```

#### Approve User

```
POST /api/admin/approve-user
Headers: Authorization: Bearer {token}
Body: {
  userId: string
}
```

#### Get Reports

```
GET /api/admin/reports
Headers: Authorization: Bearer {token}
Query: ?status=pending|reviewed|action-taken|dismissed
```

#### Resolve Report

```
POST /api/admin/resolve-report
Headers: Authorization: Bearer {token}
Body: {
  reportId: string,
  status: string,
  adminNotes: string
}
```

## 🔌 Socket.io Events

### Client → Server Events

- `user_online` - User comes online
- `join_queue` - Join random chat queue
- `send_message` - Send a chat message
- `typing` - Notify that user is typing
- `stop_typing` - Notify that user stopped typing
- `next_chat` - Move to next match
- `end_chat` - End current chat
- `private_message` - Send private message to friend
- `webrtc_offer` - WebRTC offer for video call
- `webrtc_answer` - WebRTC answer for video call
- `webrtc_ice_candidate` - WebRTC ICE candidates

### Server → Client Events

- `update_online_count` - Update count of online users
- `match_found` - New user matched
- `receive_message` - Message from other user
- `user_typing` - Other user is typing
- `user_stop_typing` - Other user stopped typing
- `chat_ended` - Chat ended by other user
- `receive_private_message` - Private message from friend
- `receive_webrtc_offer` - WebRTC offer received
- `receive_webrtc_answer` - WebRTC answer received
- `receive_webrtc_ice_candidate` - WebRTC ICE candidate received

## 🔐 Security Features

1. **JWT Authentication** - Secure token-based authentication
2. **Password Hashing** - Bcrypt hashing with salt rounds
3. **Email Verification** - Required before account activation
4. **Admin Approval** - Human verification of student IDs
5. **Rate Limiting** - Protection against brute force attacks
6. **Helmet** - Security headers protection
7. **CORS** - Cross-origin request control
8. **File Upload Validation** - Type and size restrictions
9. **Input Validation** - Express validator on all inputs
10. **Error Handling** - Secure error messages

## 🎨 UI/UX Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark/Light Mode Ready** - CSS variables for easy theme switching
- **Modern Components** - Cards, tabs, buttons with hover effects
- **Loading States** - Spinners and skeleton loaders
- **Error Handling** - User-friendly error messages
- **Accessibility** - Semantic HTML and ARIA labels

## 📊 Database Models

### User

```javascript
{
  name: String (private),
  email: String (private, unique),
  password: String (hashed),
  institutionName: String,
  course: String,
  year: String,
  studentIdImage: {
    filename: String,
    url: String,
    uploadedAt: Date
  },
  anonymousName: String (unique),
  isVerified: Boolean,
  isApproved: Boolean,
  isBanned: Boolean,
  role: String (user|admin),
  friends: [ObjectId],
  friendRequestsSent: [{recipientId, sentAt}],
  friendRequestsReceived: [{senderId, receivedAt}],
  blockedUsers: [ObjectId],
  isOnline: Boolean,
  lastOnline: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Chat

```javascript
{
  participants: [{userId, anonymousName}],
  messages: [{sender, senderAnonymousName, content, timestamp}],
  chatType: String (random|private),
  status: String (active|ended),
  startedAt: Date,
  endedAt: Date,
  duration: Number
}
```

### Report

```javascript
{
  reporter: ObjectId,
  reportedUser: ObjectId,
  reason: String,
  description: String,
  status: String (pending|reviewed|action-taken|dismissed),
  adminNotes: String,
  timestamp: Date
}
```

## 🚀 Deployment

### Backend Deployment (Heroku, Railway, etc.)

1. Add Procfile:

```
web: node server.js
```

2. Set environment variables on hosting platform
3. Deploy using git or platform's CLI

### Frontend Deployment (Vercel, Netlify, etc.)

1. Build production version:

```bash
npm run build
```

2. Deploy the `dist` folder to your hosting platform

## 🔄 Matching Algorithm

The matching system uses a simple FIFO (First In First Out) algorithm:

1. User joins queue
2. When 2 users are waiting, they're matched
3. Matched users enter a chat room
4. Optional: Implement Elo ratings or preference matching for better UX

## 📝 Environment Variables

### Backend (.env)

```
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRE=
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASSWORD=
PORT=5000
NODE_ENV=
FRONTEND_URL=
MAX_FILE_SIZE=
UPLOAD_PATH=
```

## 🐛 Debugging

Enable debug mode:

```bash
DEBUG=* npm run dev  # Backend
```

Check browser console for frontend errors

## 📞 Support

For issues and questions:

1. Check documentation
2. Review code comments
3. Check console errors
4. Review database records

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push and create a Pull Request

## ⚠️ Important Notes

1. This is a production-ready template - ensure you change all default passwords and secrets
2. Email configuration requires Gmail app password or SMTP credentials
3. MongoDB should be secured with authentication in production
4. Use HTTPS in production
5. Implement rate limiting more aggressively in production
6. Add logging and monitoring
7. Regular backup of MongoDB
8. Implement image compression on file uploads

## 🚀 Future Enhancements

- [ ] WebRTC video/audio calls (framework ready)
- [ ] Redis caching for scaling
- [ ] Google OAuth integration
- [ ] Push notifications
- [ ] Chat history export
- [ ] Advanced matching algorithm (Elo rating)
- [ ] Dark mode toggle
- [ ] Mobile app (React Native)
- [ ] Interests-based matching
- [ ] Verified badges
- [ ] In-app support/chat
- [ ] Analytics dashboard

## 📞 Contact

Created with ❤️ by the StudentConnect Team

---

**Enjoy connecting with verified students anonymously! 🎓**
