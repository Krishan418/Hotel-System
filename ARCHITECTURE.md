# 🏨 Hotel & Event Management System — Architecture

## 1. System Architecture Overview

This system follows a **3-tier architecture** — the same pattern used by most professional web applications:

```
┌─────────────────────────────────────────────────────────────────┐
│                        TIER 1: CLIENT                           │
│              (What the user sees in the browser)                │
│                                                                 │
│   React App (Vite)                                              │
│   ├── Public Website (Home, Rooms, Weddings, Restaurant, etc.)  │
│   ├── Customer Dashboard                                        │
│   ├── Admin Dashboard                                           │
│   ├── Staff Dashboard                                           │
│   ├── Cashier POS                                               │
│   └── Delivery Dashboard                                        │
│                                                                 │
│   Communicates via HTTP (REST API) ──────────────────────┐      │
└──────────────────────────────────────────────────────────┼──────┘
                                                           │
┌──────────────────────────────────────────────────────────┼──────┐
│                        TIER 2: SERVER                    │      │
│              (Handles business logic & rules)             │      │
│                                                           ▼      │
│   Node.js + Express                                              │
│   ├── Authentication (JWT + bcrypt)                              │
│   ├── REST API Routes                                            │
│   ├── Controllers (business logic)                               │
│   ├── Middleware (auth, validation, error handling)               │
│   └── Models (database schemas)                                  │
│                                                                   │
│   Communicates via Mongoose ODM ─────────────────────────┐       │
└──────────────────────────────────────────────────────────┼───────┘
                                                           │
┌──────────────────────────────────────────────────────────┼───────┐
│                       TIER 3: DATABASE                   │       │
│                (Stores all persistent data)               ▼       │
│                                                                   │
│   MongoDB                                                         │
│   ├── users                                                       │
│   ├── rooms                                                       │
│   ├── bookings                                                    │
│   ├── weddings                                                    │
│   ├── food_orders                                                 │
│   ├── menu_items                                                  │
│   ├── pool_slots                                                  │
│   ├── payments                                                    │
│   └── deliveries                                                  │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

### How It Works (Simple Explanation)

1. **User opens the website** → React app loads in the browser
2. **User clicks a button** (e.g., "Book a Room") → React sends an HTTP request to the server
3. **Server receives the request** → Express routes it to the right controller
4. **Controller runs business logic** → e.g., checks if the room is available
5. **Controller talks to the database** → MongoDB stores/retrieves data
6. **Server sends a response** → React displays the result to the user

### Key Technologies Explained

| Technology | What It Does | Why We Use It |
|------------|-------------|---------------|
| **React** | Builds the user interface | Component-based, easy to reuse UI pieces |
| **Node.js** | Runs JavaScript on the server | Same language on frontend & backend |
| **Express** | Web framework for Node.js | Simplifies routing & middleware |
| **MongoDB** | NoSQL database | Flexible schema, stores data as JSON-like documents |
| **JWT** | JSON Web Tokens for auth | Stateless authentication, no server-side sessions |
| **bcrypt** | Password hashing | Securely stores passwords (never plain text!) |
| **Docker** | Containerization | Consistent dev environment, easy deployment |

---

## 2. Authentication Flow

```
┌──────────┐      ┌──────────┐      ┌──────────┐
│  Client   │      │  Server   │      │ Database  │
└─────┬────┘      └─────┬────┘      └─────┬────┘
      │                  │                  │
      │  POST /register  │                  │
      │ ────────────────>│                  │
      │                  │  Hash password   │
      │                  │  with bcrypt     │
      │                  │  Store user ────>│
      │                  │                  │
      │  POST /login     │                  │
      │ ────────────────>│                  │
      │                  │  Find user ─────>│
      │                  │  Compare password│
      │                  │  Generate JWT    │
      │  <──── JWT Token │                  │
      │                  │                  │
      │  GET /api/rooms  │                  │
      │  (with JWT)      │                  │
      │ ────────────────>│                  │
      │                  │  Verify JWT      │
      │                  │  Check role      │
      │                  │  Fetch data ────>│
      │  <──── Room data │                  │
```

### Roles & Permissions

| Role | What They Can Do |
|------|-----------------|
| **Admin** | Full access — manage rooms, weddings, restaurant, users, reports |
| **Staff** | Check-in/check-out guests, manage bookings |
| **Cashier** | Process orders, handle payments, print receipts |
| **Customer** | Book rooms/weddings/pool, order food, view own bookings |
| **Delivery Person** | View assigned deliveries, update delivery status |

---

## 3. API Structure

All API endpoints follow RESTful conventions:

```
BASE URL: /api

Authentication:
  POST   /api/auth/register       → Create new account
  POST   /api/auth/login          → Login & get JWT token
  GET    /api/auth/me             → Get current user profile

Rooms:
  GET    /api/rooms               → List all rooms (public)
  GET    /api/rooms/:id           → Get single room
  POST   /api/rooms               → Create room (Admin)
  PUT    /api/rooms/:id           → Update room (Admin)
  DELETE /api/rooms/:id           → Delete room (Admin)

Bookings:
  GET    /api/bookings            → List bookings (filtered by role)
  GET    /api/bookings/:id        → Get single booking
  POST   /api/bookings            → Create booking (Customer)
  PUT    /api/bookings/:id        → Update booking (Staff/Admin)
  PUT    /api/bookings/:id/checkin  → Check-in (Staff)
  PUT    /api/bookings/:id/checkout → Check-out (Staff)

Weddings:
  GET    /api/weddings            → List wedding packages
  POST   /api/weddings            → Create package (Admin)
  POST   /api/weddings/book       → Book wedding (Customer)

Menu:
  GET    /api/menu                → List menu items
  POST   /api/menu                → Add menu item (Admin)
  PUT    /api/menu/:id            → Update menu item (Admin)
  DELETE /api/menu/:id            → Delete menu item (Admin)

Orders:
  GET    /api/orders              → List orders
  POST   /api/orders              → Create order (Customer/Cashier)
  PUT    /api/orders/:id          → Update order status

Pool:
  GET    /api/pool                → List pool slots
  POST   /api/pool                → Create pool slot (Admin)
  POST   /api/pool/book           → Book pool slot (Customer)

Payments:
  GET    /api/payments            → List payments
  POST   /api/payments            → Process payment (Cashier)
  GET    /api/payments/:id/receipt → Get receipt

Deliveries:
  GET    /api/deliveries          → List deliveries
  PUT    /api/deliveries/:id      → Update delivery status (Delivery Person)

Users:
  GET    /api/users               → List all users (Admin)
  PUT    /api/users/:id           → Update user (Admin)
  DELETE /api/users/:id           → Delete user (Admin)
```
