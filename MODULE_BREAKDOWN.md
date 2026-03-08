# 🧩 Hotel & Event Management System — Module Breakdown

This document explains every module in the system, what it does, and how the
pieces connect. Think of modules as **building blocks** — each one handles a
specific responsibility.

---

## 1. Authentication Module

### What It Does
Handles user registration, login, and role-based access control.

### Key Concepts for Beginners

**JWT (JSON Web Token)** — A string that proves who you are. Like a hotel key card:
- You get it when you check in (login)
- You show it to access your room (protected routes)
- It expires after a set time

**bcrypt** — A library that turns passwords into unreadable text (hashing).
Even if someone steals the database, they can't read passwords.

```
Password: "myPassword123"
After bcrypt: "$2b$10$X4kv7j5ZcG8FnPmH..."  ← Can't reverse this!
```

### Files & What They Do

| File | Purpose |
|------|---------|
| `models/User.js` | Defines what a user looks like in the database |
| `controllers/authController.js` | Logic for register, login, get profile |
| `routes/authRoutes.js` | Maps URLs to controller functions |
| `middleware/auth.js` | Checks JWT token on protected routes |
| `middleware/roleCheck.js` | Checks if user has the right role |
| `utils/generateToken.js` | Creates JWT tokens |
| `context/AuthContext.jsx` | Shares login state across React app |

### Data Flow: Registration

```
1. User fills form (name, email, password, phone)
2. React sends POST /api/auth/register
3. authController.register() runs:
   a. Check if email already exists
   b. Hash password with bcrypt
   c. Save user to MongoDB
   d. Generate JWT token
   e. Send token back to React
4. React stores token in localStorage
5. User is now logged in!
```

---

## 2. Room Management Module

### What It Does
Manages hotel rooms and room bookings (reservations).

### Key Concepts

**Room Status Flow:**
```
Available → Booked → Occupied → Available
    │                    │
    └── (customer books) └── (guest checks out)
```

### Files & What They Do

| File | Purpose |
|------|---------|
| `models/Room.js` | Room schema — number, type, price, status, amenities |
| `models/Booking.js` | Booking schema — guest, room, dates, status |
| `controllers/roomController.js` | CRUD for rooms (Admin) |
| `controllers/bookingController.js` | Create/manage bookings, check-in/out |
| `routes/roomRoutes.js` | Room endpoints |
| `routes/bookingRoutes.js` | Booking endpoints |
| `pages/public/Rooms.jsx` | Public room browsing |
| `pages/customer/BookRoom.jsx` | Booking form for customers |
| `pages/admin/ManageRooms.jsx` | Admin room management table |
| `pages/staff/CheckIn.jsx` | Staff check-in interface |
| `pages/staff/CheckOut.jsx` | Staff check-out interface |

### Room Types

| Type | Description |
|------|------------|
| Single | 1 bed, 1 guest |
| Double | 1 large bed, 2 guests |
| Twin | 2 separate beds, 2 guests |
| Suite | Luxury room, multiple rooms |
| Family | Large room, 4+ guests |

### Booking Status Flow

```
Pending → Confirmed → Checked-In → Checked-Out
   │          │
   └→ Cancelled └→ No-Show
```

---

## 3. Wedding Management Module

### What It Does
Manages wedding venue packages and bookings.

### Files & What They Do

| File | Purpose |
|------|---------|
| `models/Wedding.js` | Wedding package schema — venue, capacity, price, services |
| `controllers/weddingController.js` | CRUD for packages + booking logic |
| `routes/weddingRoutes.js` | Wedding endpoints |
| `pages/public/Weddings.jsx` | Public wedding packages browsing |
| `pages/customer/BookWedding.jsx` | Wedding booking form |
| `pages/admin/ManageWeddings.jsx` | Admin wedding management |

### Wedding Package Example

```json
{
  "name": "Grand Ballroom Package",
  "venue": "Grand Ballroom",
  "capacity": 500,
  "price": 250000,
  "services": ["Decoration", "Catering", "Photography", "DJ"],
  "availableDates": ["2026-06-15", "2026-06-22"]
}
```

---

## 4. Restaurant & Menu Module

### What It Does
Manages the restaurant menu and food orders.

### Key Concepts

**Order Types:**
- **Dine-in** — Eat at the restaurant
- **Takeaway** — Pick up food
- **Room Service** — Deliver to hotel room
- **Delivery** — Deliver to external address

### Files & What They Do

| File | Purpose |
|------|---------|
| `models/MenuItem.js` | Menu item schema — name, price, category, image |
| `models/Order.js` | Order schema — items, total, status, type |
| `controllers/menuController.js` | CRUD for menu items (Admin) |
| `controllers/orderController.js` | Create/manage orders |
| `routes/menuRoutes.js` | Menu endpoints |
| `routes/orderRoutes.js` | Order endpoints |
| `pages/public/Restaurant.jsx` | Public menu browsing |
| `pages/customer/OrderFood.jsx` | Customer ordering page |
| `pages/cashier/POS.jsx` | Cashier point-of-sale |
| `pages/admin/ManageRestaurant.jsx` | Admin menu management |

### Order Status Flow

```
Placed → Preparing → Ready → Served/Picked-Up/Delivered
  │
  └→ Cancelled
```

### Menu Categories

| Category | Examples |
|----------|---------|
| Appetizers | Soup, Salad, Spring Rolls |
| Main Course | Rice, Pasta, Steak |
| Desserts | Ice Cream, Cake, Pudding |
| Beverages | Juice, Coffee, Cocktails |

---

## 5. Pool Management Module

### What It Does
Manages swimming pool time slots and bookings.

### Files & What They Do

| File | Purpose |
|------|---------|
| `models/PoolSlot.js` | Pool slot schema — date, time, capacity, price |
| `controllers/poolController.js` | CRUD for slots + booking |
| `routes/poolRoutes.js` | Pool endpoints |
| `pages/public/Pool.jsx` | Public pool information |
| `pages/customer/BookPool.jsx` | Customer pool booking |

### Pool Slot Example

```json
{
  "date": "2026-03-15",
  "timeSlot": "10:00 AM - 12:00 PM",
  "maxCapacity": 20,
  "currentBookings": 5,
  "pricePerPerson": 500
}
```

---

## 6. Payment Module

### What It Does
Tracks all payments across the system — rooms, weddings, food, pool.

### Key Concepts

**Payment Types:**
| Type | For |
|------|-----|
| Room Booking | Room reservations |
| Wedding Booking | Wedding packages |
| Food Order | Restaurant orders |
| Pool Booking | Pool slot reservations |

### Files & What They Do

| File | Purpose |
|------|---------|
| `models/Payment.js` | Payment schema — amount, type, method, status |
| `controllers/paymentController.js` | Create payment, list, get receipt |
| `routes/paymentRoutes.js` | Payment endpoints |
| `pages/customer/MyPayments.jsx` | Customer payment history |
| `pages/cashier/Payments.jsx` | Cashier payment processing |
| `pages/cashier/Receipts.jsx` | Receipt viewing/printing |

### Payment Methods

- Cash
- Credit/Debit Card
- Bank Transfer

---

## 7. Delivery Module

### What It Does
Manages food delivery assignments and tracking.

### Files & What They Do

| File | Purpose |
|------|---------|
| `models/Delivery.js` | Delivery schema — order, driver, status, address |
| `controllers/deliveryController.js` | List deliveries, update status |
| `routes/deliveryRoutes.js` | Delivery endpoints |
| `pages/delivery/Dashboard.jsx` | Delivery person dashboard |
| `pages/delivery/Orders.jsx` | Delivery assignment list |
| `pages/delivery/Earnings.jsx` | Delivery earnings tracking |

### Delivery Status Flow

```
Assigned → Picked Up → In Transit → Delivered
    │
    └→ Cancelled
```

---

## 8. User Management Module

### What It Does
Allows admin to manage all system users.

### Files & What They Do

| File | Purpose |
|------|---------|
| `controllers/userController.js` | List, update, delete users |
| `routes/userRoutes.js` | User management endpoints |
| `pages/admin/ManageUsers.jsx` | Admin user management table |

### Admin Capabilities

- View all users
- Change user roles (promote staff to admin, etc.)
- Deactivate/delete accounts
- Search and filter users

---

## 9. Reports Module

### What It Does
Provides business insights for the admin.

### Report Types

| Report | What It Shows |
|--------|--------------|
| Revenue Report | Total income by period and category |
| Occupancy Report | Room occupancy rates |
| Booking Report | Booking trends and statistics |
| Order Report | Food order statistics |
| User Report | User registration and activity |

### Files & What They Do

| File | Purpose |
|------|---------|
| `pages/admin/Reports.jsx` | Dashboard with charts and tables |
| Backend: aggregation queries in relevant controllers | Data calculations |

---

## 10. Shared/Common Module

### What It Does
Reusable pieces used across the entire application.

### Frontend Components

| Component | Purpose |
|-----------|---------|
| `Navbar.jsx` | Top navigation bar |
| `Footer.jsx` | Page footer |
| `Sidebar.jsx` | Dashboard side navigation |
| `ProtectedRoute.jsx` | Blocks unauthorized access |
| `LoadingSpinner.jsx` | Shows loading state |
| `Modal.jsx` | Popup dialogs (confirm, details) |

### Backend Middleware

| Middleware | Purpose |
|-----------|---------|
| `auth.js` | Verifies JWT token |
| `roleCheck.js` | Checks user role |
| `errorHandler.js` | Catches and formats errors |

---

## Module Dependencies

This diagram shows which modules depend on each other:

```
                    ┌──────────────┐
                    │     Auth     │ ← Everything depends on Auth
                    └──────┬───────┘
                           │
        ┌──────────┬───────┼───────┬──────────┐
        │          │       │       │          │
   ┌────▼───┐ ┌───▼───┐ ┌─▼──┐ ┌──▼──┐ ┌────▼────┐
   │  Room  │ │Wedding│ │Menu│ │Pool │ │  User   │
   │Booking │ │       │ │    │ │     │ │  Mgmt   │
   └────┬───┘ └───┬───┘ └─┬──┘ └──┬──┘ └─────────┘
        │         │       │       │
        │         │   ┌───▼───┐   │
        │         │   │ Order │   │
        │         │   └───┬───┘   │
        │         │       │       │
        └─────┬───┴───┬───┘       │
              │       │           │
         ┌────▼───┐ ┌─▼──────┐   │
         │Payment │ │Delivery│   │
         └────────┘ └────────┘   │
              │                   │
         ┌────▼───────────────────▼──┐
         │        Reports            │
         └───────────────────────────┘
```

---

## Summary

| # | Module | Backend Files | Frontend Pages | Complexity |
|---|--------|--------------|----------------|------------|
| 1 | Auth | 5 | 4 | ⭐⭐⭐ |
| 2 | Rooms & Bookings | 4 | 5 | ⭐⭐⭐⭐ |
| 3 | Weddings | 2 | 3 | ⭐⭐ |
| 4 | Restaurant & Menu | 4 | 4 | ⭐⭐⭐ |
| 5 | Pool | 2 | 2 | ⭐⭐ |
| 6 | Payments | 2 | 3 | ⭐⭐⭐ |
| 7 | Deliveries | 2 | 3 | ⭐⭐ |
| 8 | User Management | 2 | 1 | ⭐⭐ |
| 9 | Reports | 0 | 1 | ⭐⭐⭐ |
| 10 | Shared/Common | 3 | 6 | ⭐⭐ |
| **Total** | | **~26** | **~32** | |
