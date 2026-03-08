# 🗂️ Hotel & Event Management System — Folder Structure

## Why This Structure?

We use a **feature-based** organization. This means related files live together,
making it easy to find what you need. This is the industry standard for MERN apps.

```
Hotel-System/
│
├── 📄 ARCHITECTURE.md          ← System architecture docs (you're reading one!)
├── 📄 ROADMAP.md               ← Development roadmap
├── 📄 FOLDER_STRUCTURE.md      ← This file
├── 📄 MODULE_BREAKDOWN.md      ← Detailed module breakdown
├── 📄 README.md                ← Project overview
├── 📄 docker-compose.yml       ← Runs all services with one command
├── 📄 .gitignore               ← Files Git should ignore
│
├── 📁 backend/                 ← Node.js + Express server
│   ├── 📄 package.json         ← Backend dependencies
│   ├── 📄 server.js            ← Entry point — starts the server
│   ├── 📄 Dockerfile           ← Docker config for backend
│   ├── 📄 .env.example         ← Environment variables template
│   │
│   ├── 📁 config/              ← Configuration files
│   │   └── 📄 db.js            ← MongoDB connection setup
│   │
│   ├── 📁 models/              ← Database schemas (what data looks like)
│   │   ├── 📄 User.js          ← User schema (name, email, password, role)
│   │   ├── 📄 Room.js          ← Room schema (number, type, price, status)
│   │   ├── 📄 Booking.js       ← Booking schema (guest, room, dates)
│   │   ├── 📄 Wedding.js       ← Wedding package schema
│   │   ├── 📄 MenuItem.js      ← Menu item schema (name, price, category)
│   │   ├── 📄 Order.js         ← Food order schema
│   │   ├── 📄 PoolSlot.js      ← Pool slot schema
│   │   ├── 📄 Payment.js       ← Payment schema
│   │   └── 📄 Delivery.js      ← Delivery schema
│   │
│   ├── 📁 routes/              ← URL endpoints (where requests go)
│   │   ├── 📄 authRoutes.js    ← /api/auth/*
│   │   ├── 📄 roomRoutes.js    ← /api/rooms/*
│   │   ├── 📄 bookingRoutes.js ← /api/bookings/*
│   │   ├── 📄 weddingRoutes.js ← /api/weddings/*
│   │   ├── 📄 menuRoutes.js    ← /api/menu/*
│   │   ├── 📄 orderRoutes.js   ← /api/orders/*
│   │   ├── 📄 poolRoutes.js    ← /api/pool/*
│   │   ├── 📄 paymentRoutes.js ← /api/payments/*
│   │   ├── 📄 deliveryRoutes.js← /api/deliveries/*
│   │   └── 📄 userRoutes.js    ← /api/users/*
│   │
│   ├── 📁 controllers/         ← Business logic (what happens at each route)
│   │   ├── 📄 authController.js
│   │   ├── 📄 roomController.js
│   │   ├── 📄 bookingController.js
│   │   ├── 📄 weddingController.js
│   │   ├── 📄 menuController.js
│   │   ├── 📄 orderController.js
│   │   ├── 📄 poolController.js
│   │   ├── 📄 paymentController.js
│   │   ├── 📄 deliveryController.js
│   │   └── 📄 userController.js
│   │
│   ├── 📁 middleware/           ← Code that runs BEFORE controllers
│   │   ├── 📄 auth.js           ← Checks if user is logged in (JWT verify)
│   │   ├── 📄 roleCheck.js      ← Checks if user has the right role
│   │   └── 📄 errorHandler.js   ← Catches errors & sends clean responses
│   │
│   └── 📁 utils/                ← Helper functions
│       └── 📄 generateToken.js  ← Creates JWT tokens
│
├── 📁 frontend/                 ← React application
│   ├── 📄 package.json          ← Frontend dependencies
│   ├── 📄 vite.config.js        ← Vite build tool config
│   ├── 📄 index.html            ← Root HTML file
│   ├── 📄 Dockerfile            ← Docker config for frontend
│   │
│   ├── 📁 public/               ← Static files (images, favicon)
│   │   └── 📄 favicon.ico
│   │
│   └── 📁 src/                  ← All React source code
│       ├── 📄 main.jsx          ← Entry point — renders <App />
│       ├── 📄 App.jsx           ← Main component — sets up routes
│       ├── 📄 index.css         ← Global styles
│       │
│       ├── 📁 api/              ← Functions to call backend API
│       │   └── 📄 axios.js      ← Axios instance with base URL & auth header
│       │
│       ├── 📁 context/          ← React Context (global state)
│       │   └── 📄 AuthContext.jsx ← Login state shared across app
│       │
│       ├── 📁 components/       ← Reusable UI pieces
│       │   ├── 📄 Navbar.jsx
│       │   ├── 📄 Footer.jsx
│       │   ├── 📄 Sidebar.jsx
│       │   ├── 📄 ProtectedRoute.jsx  ← Blocks pages if not logged in
│       │   ├── 📄 LoadingSpinner.jsx
│       │   └── 📄 Modal.jsx
│       │
│       ├── 📁 pages/            ← Full pages (one per route)
│       │   │
│       │   ├── 📁 public/       ← Pages anyone can see
│       │   │   ├── 📄 Home.jsx
│       │   │   ├── 📄 Rooms.jsx
│       │   │   ├── 📄 Weddings.jsx
│       │   │   ├── 📄 Restaurant.jsx
│       │   │   ├── 📄 Pool.jsx
│       │   │   ├── 📄 Contact.jsx
│       │   │   ├── 📄 Login.jsx
│       │   │   └── 📄 Register.jsx
│       │   │
│       │   ├── 📁 customer/     ← Customer-only pages
│       │   │   ├── 📄 Dashboard.jsx
│       │   │   ├── 📄 BookRoom.jsx
│       │   │   ├── 📄 BookWedding.jsx
│       │   │   ├── 📄 OrderFood.jsx
│       │   │   ├── 📄 BookPool.jsx
│       │   │   ├── 📄 MyBookings.jsx
│       │   │   ├── 📄 MyPayments.jsx
│       │   │   └── 📄 Profile.jsx
│       │   │
│       │   ├── 📁 admin/        ← Admin-only pages
│       │   │   ├── 📄 Dashboard.jsx
│       │   │   ├── 📄 ManageRooms.jsx
│       │   │   ├── 📄 ManageWeddings.jsx
│       │   │   ├── 📄 ManageRestaurant.jsx
│       │   │   ├── 📄 Reports.jsx
│       │   │   └── 📄 ManageUsers.jsx
│       │   │
│       │   ├── 📁 staff/        ← Staff-only pages
│       │   │   ├── 📄 Dashboard.jsx
│       │   │   ├── 📄 CheckIn.jsx
│       │   │   ├── 📄 CheckOut.jsx
│       │   │   └── 📄 Bookings.jsx
│       │   │
│       │   ├── 📁 cashier/      ← Cashier-only pages
│       │   │   ├── 📄 POS.jsx
│       │   │   ├── 📄 Payments.jsx
│       │   │   └── 📄 Receipts.jsx
│       │   │
│       │   └── 📁 delivery/     ← Delivery person pages
│       │       ├── 📄 Dashboard.jsx
│       │       ├── 📄 Orders.jsx
│       │       └── 📄 Earnings.jsx
│       │
│       └── 📁 hooks/            ← Custom React hooks
│           └── 📄 useAuth.js    ← Easy access to AuthContext
│
└── 📁 docker/                   ← Docker-related files
    └── 📄 mongo-init.js         ← Seeds initial data into MongoDB
```

## How Requests Flow Through the Code

Here's the path a request takes when a customer books a room:

```
1. Customer clicks "Book Room" button
   └── frontend/src/pages/customer/BookRoom.jsx

2. React calls the API
   └── frontend/src/api/axios.js → POST /api/bookings

3. Express receives the request
   └── backend/routes/bookingRoutes.js

4. Middleware runs first
   ├── backend/middleware/auth.js        → Is the user logged in?
   └── backend/middleware/roleCheck.js   → Is the user a customer?

5. Controller handles the logic
   └── backend/controllers/bookingController.js
       ├── Check if room is available
       ├── Create booking record
       └── Update room status

6. Model talks to MongoDB
   ├── backend/models/Booking.js  → Save new booking
   └── backend/models/Room.js     → Update room to "booked"

7. Response sent back to React
   └── Customer sees "Booking Confirmed!" message
```
