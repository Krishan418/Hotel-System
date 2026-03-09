# 🏨 LuxeHotel — Hotel & Event Management System

A full-stack, production-ready **MERN** (MongoDB, Express, React, Node.js) web application for managing hotel operations. Features a premium luxury design, role-based dashboards, and complete containerization for easy deployment.

## ✨ Key Features

- **Premium UI/UX:** A stunning, modern hotel aesthetic with gold and obsidian accents, glassmorphism, and responsive CSS grid layouts.
- **Role-Based Access Control (RBAC):** Five distinct user tiers with protected JWT API routes.
- **Complete Booking Flow:** Customers can search and book rooms with date validation and capacity checks.
- **Cashier POS:** Point of Sale system for table orders and receipt generation.
- **Robust Error Handling:** Global API error handler that safely catches Mongoose validation/cast errors and JWT expiry issues.
- **Dockerized:** Fully containerized with Docker Compose for seamless 1-click local setup.

## 👥 System Roles & Dashboards

| Role | Access |
|------|--------|
| **Admin** | Full system management — rooms, weddings, restaurant, user accounts, and reports |
| **Staff** | Check-in/check-out and booking management |
| **Cashier** | POS orders, payment processing, and receipts |
| **Customer** | Book rooms, reserve wedding halls, order food, and view personal booking history |
| **Delivery** | Manage restaurant deliveries, update status, and track earnings |

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React (Vite), React Router v6, Context API, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose ODM |
| **Security** | JSON Web Tokens (JWT), bcrypt |
| **Infrastructure** | Docker, Docker Compose |

## 🚦 Getting Started (Local Development)

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Optional, but recommended)

### 2. Standard Setup (Without Docker)

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd Hotel-System
   ```

2. **Setup Backend:**
   ```bash
   cd backend
   npm install
   # Create a .env file based on .env.example
   ```

3. **Seed Database with Demo Data:**
   *This creates 5 demo users, 10 rooms, and 10 menu items.*
   ```bash
   node seed.js
   ```

4. **Start Backend & Frontend:**
   *Open two terminal windows:*
   ```bash
   # Terminal 1 (Backend - runs on port 5000)
   cd backend
   npm run dev
   
   # Terminal 2 (Frontend - runs on port 5173)
   cd frontend
   npm install
   npm run dev
   ```

### 3. Docker Setup (Recommended)

Run the entire application (MongoDB + Backend + Frontend) with one command.

```bash
docker-compose up --build
```
- **Frontend** will be available at: `http://localhost:5173`
- **Backend API** will be available at: `http://localhost:5000`
- **MongoDB** will run internally inside the Docker network.

## 📋 Demo Login Credentials

The `seed.js` script populates the database with the following demo accounts. The password for all accounts is **`Role@123`** (e.g., `Admin@123`).

| Role       | Email                     | Password       |
|------------|---------------------------|----------------|
| **Admin**  | `admin@luxe.com`          | `Admin@123`    |
| **Staff**  | `staff@luxe.com`          | `Staff@123`    |
| **Cashier**| `cashier@luxe.com`        | `Cashier@123`  |
| **Delivery**| `delivery@luxe.com`      | `Delivery@123` |
| **Customer**| `customer@luxe.com`      | `Customer@123` |

## 🏗️ Project Structure

```
Hotel-System/
├── backend/          ← Node.js API (Models, Controllers, Routes)
│   ├── config/       ← DB Config
│   ├── middleware/   ← Auth guards, Error Handler
│   ├── seed.js       ← Database seeder
│   └── server.js     ← Express entry point
├── frontend/         ← React (Vite) App
│   └── src/
│       ├── api/      ← Axios configuration
│       ├── context/  ← AuthContext
│       ├── pages/    ← Role-based Dashboards & Public Pages
│       └── index.css ← Premium luxury design tokens
├── docker-compose.yml← Multi-container orchestration
└── DATABASE_DESIGN...← Schema documentation
```

## 📄 License
This project is for educational purposes.
