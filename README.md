# 🏛️ CampusOne (CMRS)
> **Unified Campus Service & e-Governance Portal**  
> *Developed for GENESIS'26 Hackathon — Amrita Vishwa Vidyapeetham*

---

## 📂 Project Architecture: Frontend & Backend Separation

The project has been separated into clean `frontend/` and `backend/` directories, with classified subfolders:

```
CampusOne/
├── frontend/                          # Client-side React Application
│   ├── src/
│   │   ├── components/                # Classified Component Subfolders
│   │   │   ├── layout/                # Navigation & Persona Switching
│   │   │   │   ├── Navbar.jsx         # Header & Tab Navigation
│   │   │   │   └── RoleSwitcherModal.jsx # 1-Click Judge Role Switcher
│   │   │   ├── feed/                  # Problem Feed & Swipe Deck
│   │   │   │   ├── SwipeCardFeed.jsx  # Tinder-style Right/Left Swipe Voting
│   │   │   │   └── TicketDetailModal.jsx # Lifecycle & Comments Modal
│   │   │   ├── wizard/                # Grievance Triage Wizard
│   │   │   │   └── RaiseIssueModal.jsx # Decision Tree & AI Duplicate Detection
│   │   │   ├── verification/          # Closed-Loop Accountability
│   │   │   │   └── StudentVerificationBanner.jsx # Two-Way Student Confirmation
│   │   │   ├── admin/                 # Domain Operations Console
│   │   │   │   └── AdminDashboard.jsx # Electrical/Carpentry/Mess ETA Updates
│   │   │   ├── advisor/               # Faculty Supervisory Desk
│   │   │   │   └── AdvisorDashboard.jsx # CSE-B Class Advisor Endorsements
│   │   │   └── analytics/             # Quantitative Metrics
│   │   │       └── CampusAnalytics.jsx # Real-time SLA & Turnaround Stats
│   │   ├── context/
│   │   │   └── AppContext.jsx         # Global State & Client Cache
│   │   ├── data/
│   │   │   └── mockData.js            # Initial Amrita University Demo Entities
│   │   ├── styles/
│   │   │   └── index.css              # Tailwind Directives & Custom Animations
│   │   ├── App.jsx                    # Root App Router
│   │   └── main.jsx                   # Entry Point
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/                           # Server-side API & Microservices
│   ├── src/
│   │   ├── controllers/               # Business Logic Controllers
│   │   │   ├── ticketController.js    # CRUD, Voting, Comments, Verification
│   │   │   ├── authController.js      # User Personas & Permissions
│   │   │   └── analyticsController.js # SLA Metrics & Turnaround Calculation
│   │   ├── routes/                    # RESTful Endpoints
│   │   │   ├── ticketRoutes.js        # /api/tickets
│   │   │   ├── authRoutes.js          # /api/auth
│   │   │   └── analyticsRoutes.js     # /api/analytics
│   │   ├── services/                  # Intelligent Services
│   │   │   ├── aiDuplicateService.js  # Keyword Similarity Matching Algorithm
│   │   │   └── priorityService.js     # Dynamic Severity Formula Engine
│   │   ├── middleware/                # Security & Privacy Gates
│   │   │   └── scopeAuthMiddleware.js # Class vs Dept vs Campus Authorization
│   │   ├── models/                    # Data Models
│   │   │   └── ticketModel.js         # Schema & In-Memory Store
│   │   └── server.js                  # Express API Server Entry Point
│   └── package.json
│
└── README.md
```

---

## ⚡ Quick Start: Running Both Servers

### 1. Frontend (UI & Interactive Swipe Deck)
```bash
cd frontend
npm install
npm run dev
```
👉 Accessible at: **`http://localhost:3000`**

### 2. Backend (REST API, AI Duplicate Matcher & Services)
```bash
cd backend
npm install
npm start
```
👉 Accessible at: **`http://localhost:5000`**  
👉 Health check: **`http://localhost:5000/api/health`**
