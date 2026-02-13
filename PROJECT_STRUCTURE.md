# StudentConnect - Project Structure Overview

## Complete Project Layout

```
StudentConnect/
│
├── backend/                          # Express.js Node server
│   ├── config/
│   │   ├── database.js              # MongoDB connection
│   │   └── multer.js                # File upload config
│   │
│   ├── controllers/
│   │   ├── authController.js        # Auth logic (register, login, verify)
│   │   ├── chatController.js        # Chat logic (friends, reports, blocks)
│   │   └── adminController.js       # Admin operations
│   │
│   ├── models/
│   │   ├── User.js                  # User schema with anonymous name generation
│   │   ├── Chat.js                  # Chat room and message history
│   │   └── Report.js                # Report and moderation records
│   │
│   ├── routes/
│   │   ├── authRoutes.js            # /api/auth/* routes
│   │   ├── chatRoutes.js            # /api/chat/* routes
│   │   └── adminRoutes.js           # /api/admin/* routes
│   │
│   ├── middleware/
│   │   ├── auth.js                  # JWT authentication & authorization
│   │   └── errorHandler.js          # Centralized error handling
│   │
│   ├── utils/
│   │   ├── emailService.js          # Email sending (Nodemailer)
│   │   ├── badWordFilter.js         # Content moderation
│   │   └── matchingQueue.js         # Random chat matching algorithm
│   │
│   ├── socket/
│   │   └── socketHandler.js         # Socket.io event handlers
│   │
│   ├── uploads/                     # User-uploaded student IDs
│   │   └── .gitkeep                 # Directory placeholder
│   │
│   ├── server.js                    # Main Express app
│   ├── package.json                 # Dependencies
│   ├── .env.example                 # Environment template
│   ├── .gitignore                   # Git ignore rules
│   └── README.md                    # Backend-specific docs
│
├── frontend/                         # React + Vite app
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # App navigation bar
│   │   │   └── Navbar.css           # Navbar styles
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Auth state management
│   │   │   └── SocketContext.jsx    # Socket.io state management
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Landing page
│   │   │   ├── Register.jsx         # Registration page
│   │   │   ├── Login.jsx            # Login page
│   │   │   ├── VerifyEmail.jsx      # Email verification
│   │   │   ├── Dashboard.jsx        # User dashboard
│   │   │   ├── Chat.jsx             # Random chat interface
│   │   │   ├── Friends.jsx          # Friend management
│   │   │   ├── PrivateChat.jsx      # Private messaging (WIP)
│   │   │   ├── UploadStudentId.jsx  # Student ID upload
│   │   │   ├── AdminDashboard.jsx   # Admin panel
│   │   │   └── *.css                # Page-specific styles
│   │   │
│   │   ├── services/                # API calls (expandable)
│   │   ├── hooks/                   # Custom React hooks (expandable)
│   │   ├── socket/                  # Socket helpers (expandable)
│   │   │
│   │   ├── App.jsx                  # Main app component with routing
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Global styles
│   │
│   ├── index.html                   # HTML template
│   ├── vite.config.js               # Vite configuration
│   ├── package.json                 # Dependencies
│   ├── .gitignore                   # Git ignore rules
│   └── README.md                    # Frontend-specific docs
│
├── README.md                        # Main project documentation
├── QUICKSTART.md                    # Quick setup guide
├── DEPLOYMENT.md                    # Production deployment guide
├── PROJECT_STRUCTURE.md             # This file
└── TROUBLESHOOTING.md              # Common issues & solutions
```

## Data Flow Diagrams

### Authentication Flow

```
User Registration
    ↓
Validate student email
    ↓
Hash password with bcrypt
    ↓
Save to MongoDB
    ↓
Send verification email with token
    ↓
User clicks verification link
    ↓
Verify token and set isVerified=true
    ↓
Upload student ID
    ↓
Wait for admin approval
    ↓
Admin approves → isApproved=true
    ↓
User can now login and access chat
```

### Chat Matching Flow

```
User joins queue
    ↓
Socket.io adds user to matchingQueue
    ↓
Check if 2 users waiting
    ↓
   YES → Create chat room (Socket.io room)
     ↓
     Emit match_found to both users
     ↓
     Users enter Chat component
     ↓
     Messages exchange via Socket.io
     ↓
     User clicks "Next" or "End"
     ↓
     Leave room, rejoin queue (if Next)

   NO → Wait in queue
     ↓
     Other users join
     ↓
     Match triggered when 2nd user joins
```

### Friend Request Flow

```
User A in chat with User B
    ↓
User A clicks "Send Friend Request"
    ↓
Socket sends friend request
    ↓
Request saved: A → friendRequestsSent, B → friendRequestsReceived
    ↓
User B sees pending request notification
    ↓
User B clicks "Accept"
    ↓
Both added to friends array
    ↓
Request record deleted
    ↓
Can now start private chats
```

## API Endpoints Summary

### Authentication (Public)

- `POST /api/auth/register` - Register new student
- `POST /api/auth/verify-email` - Verify email
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/upload-student-id` - Upload ID (protected)
- `POST /api/auth/logout` - Logout (protected)

### Chat (Protected + Approved)

- `POST /api/chat/report` - Report user
- `POST /api/chat/block-user` - Block user
- `POST /api/chat/unblock-user` - Unblock user
- `GET /api/chat/blocked-users` - Get blocked list
- `GET /api/chat/friends` - Get friends
- `POST /api/chat/send-friend-request` - Send request
- `POST /api/chat/accept-friend-request` - Accept request
- `POST /api/chat/reject-friend-request` - Reject request
- `GET /api/chat/pending-requests` - Get pending requests

### Admin (Protected + Admin Role)

- `GET /api/admin/dashboard` - Get stats
- `GET /api/admin/pending-approvals` - Get unreviewed users
- `POST /api/admin/approve-user` - Approve user
- `POST /api/admin/reject-user` - Reject user
- `POST /api/admin/ban-user` - Ban user
- `POST /api/admin/unban-user` - Unban user
- `GET /api/admin/reports` - Get reports
- `POST /api/admin/resolve-report` - Resolve report
- `GET /api/admin/all-users` - List all users

## Socket.io Event Mappings

### Real-time Chat

```
Client                          Server                         Client
┌─────────┐                  ┌────────┐                    ┌─────────┐
│ User A  │                  │         │                   │ User B  │
└────┬────┘                  └────┬───┘                    └────┬────┘
     │ join_queue                 │                              │
     │────────────────────────→   │                              │
     │                            │ find_match() called          │
     │                            │─────────────────────────────→│
     │                            │                              │
     │←───── match_found ─────────────────────────────────────→ │
     │                            │                              │
     │ send_message              │                    send_message│
     │────────────────────────→   │────────────────────────────→ │
     │                            │                              │
     │←── receive_message ────────────────────────── receive_message│
     │                            │                              │
     │ typing                     │                              │
     │────────────────────────→   │──── user_typing ───────────→│
     │                            │                              │
     │ next_chat                  │                              │
     │────────────────────────→   │ (leave room, rejoin queue)   │
     │                            │                              │
```

## Key Features Implementation Details

### 1. Anonymous Identity System

- Database stores: `name` (private), `anonymousName` (public)
- During chat: Only `anonymousName` + `institutionName` shown
- Anonymous names auto-generated using adjective+animal+number
- Cannot be changed by user to maintain anonymity

### 2. Verification Process

- Email verification: 24-hour token expiration
- Student ID: File upload with image validation
- Admin approval: Manual review process
- Only approved users can chat

### 3. Matching Algorithm

- FIFO queue-based matching
- `matchingQueue` utility class manages queue
- When 2 users join: Create Socket.io room, emit match_found
- Users enter same chat room to exchange messages

### 4. Safety & Moderation

- Bad word filter (can be enhanced)
- Report system with admin review
- Block users feature
- Ban system for misbehavior
- Rate limiting on API endpoints

### 5. Real-time Features

- Socket.io for real-time messaging
- Typing indicators
- Online user count
- Typing state pushed to other user
- 3-second inactivity clears typing status

## Environment Variables

### Backend (.env)

```
MONGODB_URI=mongodb://...
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=app_password
PORT=5000
NODE_ENV=development|production
FRONTEND_URL=http://localhost:5173
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

### Frontend (.env or hardcoded)

```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Performance Considerations

### Database

- Indexes on: email, anonymousName, isApproved, isBanned
- Connection pooling enabled
- Lean queries where applicable

### Frontend

- Code splitting per page
- Lazy loading for routes
- Memoization of components
- Efficient Socket.io listeners

### Backend

- Rate limiting: 100 requests/15 minutes
- Message validation before broadcast
- Efficient queue operations
- Socket.io room management

## Security Layers

1. **Transport**: HTTPS (production)
2. **Authentication**: JWT tokens
3. **Authorization**: Role-based access control
4. **Input Validation**: Express validator
5. **Data Protection**: Password hashing, email validation
6. **File Upload**: Type/size restrictions, virus scan (optional)
7. **Session Management**: Token expiration
8. **Error Handling**: No sensitive data in errors

## Testing Checklist

- [ ] Registration with invalid email
- [ ] Registration with duplicate email
- [ ] Email verification with expired token
- [ ] Login with wrong credentials
- [ ] Join chat queue and match
- [ ] Send and receive messages
- [ ] Typing indicators
- [ ] Next/End chat
- [ ] Send friend request
- [ ] Accept/reject friend request
- [ ] Block user
- [ ] Report user
- [ ] Admin approve user
- [ ] Admin ban user
- [ ] Admin resolve report

## Known Limitations

1. WebRTC video/audio - Framework ready, not implemented
2. Private messaging - UI ready, Socket integration pending
3. Persistence - Chat messages not saved permanently (optional)
4. Scaling - Redis caching not implemented (optional)
5. Image storage - Local filesystem (use S3 for production)

---

For more information, refer to README.md or DEPLOYMENT.md
