# 🏨 Hotel & Event Management System

A full-stack **MERN** (MongoDB, Express, React, Node.js) web application for managing hotel operations including room bookings, wedding events, restaurant orders, pool reservations, payments, and deliveries.

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite) |
| Backend | Node.js + Express |
| Database | MongoDB |
| Auth | JWT + bcrypt |
| Containers | Docker |

## 👥 System Roles

| Role | Access |
|------|--------|
| **Admin** | Full system management — rooms, weddings, restaurant, users, reports |
| **Staff** | Check-in/check-out, booking management |
| **Cashier** | POS orders, payments, receipts |
| **Customer** | Book rooms/weddings/pool, order food, view bookings |
| **Delivery** | Manage deliveries, update status, view earnings |

## 📖 Documentation

| Document | Description |
|----------|------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System design, auth flow, API endpoints |
| [ROADMAP.md](./ROADMAP.md) | 12-phase development plan |
| [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) | Complete project directory layout |
| [MODULE_BREAKDOWN.md](./MODULE_BREAKDOWN.md) | Detailed module explanations |

## 🏗️ Project Structure

```
Hotel-System/
├── backend/          ← Node.js + Express API server
│   ├── config/       ← Database configuration
│   ├── models/       ← MongoDB schemas
│   ├── routes/       ← API route definitions
│   ├── controllers/  ← Business logic
│   ├── middleware/    ← Auth, role checks, error handling
│   └── utils/        ← Helper functions
├── frontend/         ← React (Vite) client app
│   └── src/
│       ├── api/          ← API client setup
│       ├── components/   ← Reusable UI components
│       ├── context/      ← Global state (AuthContext)
│       ├── hooks/        ← Custom React hooks
│       └── pages/        ← Page components by role
└── docker/           ← Docker configuration
```

## 🚦 Getting Started

_Coming soon — see [ROADMAP.md](./ROADMAP.md) for development phases._

## 📄 License

This project is for educational purposes.
