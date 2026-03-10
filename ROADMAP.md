# 🗺️ Hotel & Event Management System — Development Roadmap

## How This Roadmap Works

Each phase builds on the previous one. Complete them in order.
**Estimated total time: 8–12 weeks** (working part-time as a beginner).

---

## Phase 1: Project Setup & Foundation (Week 1)

> **Goal:** Get the project structure ready and running locally.

- [ ] Initialize Git repository
- [ ] Create backend folder with `npm init`
- [ ] Install core backend packages: `express`, `mongoose`, `dotenv`, `cors`, `bcryptjs`, `jsonwebtoken`
- [ ] Install dev packages: `nodemon`
- [ ] Create frontend with Vite: `npm create vite@latest frontend -- --template react`
- [ ] Install frontend packages: `axios`, `react-router-dom`
- [ ] Set up Docker with `docker-compose.yml` (MongoDB + backend + frontend)
- [ ] Create `.gitignore`, `.env.example`
- [ ] Create `server.js` with basic Express setup
- [ ] Connect to MongoDB using Mongoose
- [ ] Test that all services start correctly

**Deliverable:** Running dev environment with empty Express server connected to MongoDB.

---

## Phase 2: Authentication System (Week 2)

> **Goal:** Users can register, login, and stay authenticated.

- [ ] Create User model (name, email, password, role, phone)
- [ ] Create auth controller:
  - [ ] Register — hash password with bcrypt, save user
  - [ ] Login — verify password, generate JWT
  - [ ] Get current user profile
- [ ] Create auth middleware — verify JWT from headers
- [ ] Create role-check middleware — restrict routes by role
- [ ] Create error-handling middleware
- [ ] Create auth routes
- [ ] Test all auth endpoints with Postman or curl
- [ ] Create frontend Login page
- [ ] Create frontend Register page
- [ ] Create AuthContext for global auth state
- [ ] Create ProtectedRoute component
- [ ] Create useAuth custom hook

**Deliverable:** Working login/register system with role-based route protection.

---

## Phase 3: Room Management Module (Week 3)

> **Goal:** Admin can manage rooms, customers can browse and book.

- [ ] Create Room model (number, type, price, capacity, status, amenities, images)
- [ ] Create Booking model (guest, room, checkIn, checkOut, status, totalPrice)
- [ ] Create room controller (CRUD operations)
- [ ] Create booking controller (create, list, update, check-in, check-out)
- [ ] Create room routes and booking routes
- [ ] Frontend: Public Rooms page (browse rooms)
- [ ] Frontend: Admin — ManageRooms page (CRUD table)
- [ ] Frontend: Customer — BookRoom page (date picker, room selection)
- [ ] Frontend: Customer — MyBookings page
- [ ] Frontend: Staff — CheckIn / CheckOut pages

**Deliverable:** Complete room booking flow from browsing to check-out.

---

## Phase 4: Wedding Management Module (Week 4)

> **Goal:** Admin manages wedding packages, customers can book.

- [ ] Create Wedding model (package name, venue, capacity, price, services, availability)
- [ ] Create wedding controller (CRUD + booking)
- [ ] Create wedding routes
- [ ] Frontend: Public Weddings page (browse packages)
- [ ] Frontend: Admin — ManageWeddings page
- [ ] Frontend: Customer — BookWedding page

**Deliverable:** Working wedding package browsing and booking.

---

## Phase 5: Restaurant & Menu Module (Week 5–6)

> **Goal:** Menu management, food ordering, and cashier POS.

- [ ] Create MenuItem model (name, description, price, category, image, available)
- [ ] Create Order model (customer, items, total, status, type: dine-in/takeaway/delivery)
- [ ] Create menu controller (CRUD)
- [ ] Create order controller (create, update status, list)
- [ ] Create menu routes and order routes
- [ ] Frontend: Public Restaurant page (browse menu)
- [ ] Frontend: Admin — ManageRestaurant page (menu CRUD)
- [ ] Frontend: Customer — OrderFood page
- [ ] Frontend: Cashier — POS page (create orders, process payments)
- [ ] Frontend: Cashier — Receipts page

**Deliverable:** Complete food ordering system with POS.

---

## Phase 6: Pool Management Module (Week 6)

> **Goal:** Pool slot management and booking.

- [ ] Create PoolSlot model (date, timeSlot, capacity, price, bookedCount)
- [ ] Create pool controller (CRUD + booking)
- [ ] Create pool routes
- [ ] Frontend: Public Pool page
- [ ] Frontend: Admin — pool slot management (inside admin dashboard)
- [ ] Frontend: Customer — BookPool page

**Deliverable:** Working pool slot booking system.

---

## Phase 7: Payment System (Week 7)

> **Goal:** Track payments across all services.

- [ ] Create Payment model (user, amount, type, method, status, reference)
- [ ] Create payment controller (create, list, get receipt)
- [ ] Create payment routes
- [ ] Frontend: Customer — MyPayments page
- [ ] Frontend: Cashier — Payments page
- [ ] Frontend: Cashier — Receipts page (print-ready layout)

**Deliverable:** Unified payment tracking and receipt generation.

---

## Phase 8: Delivery System (Week 8)

> **Goal:** Delivery person can manage assigned deliveries.

- [ ] Create Delivery model (order, deliveryPerson, status, address, estimatedTime)
- [ ] Create delivery controller (list, update status)
- [ ] Create delivery routes
- [ ] Frontend: Delivery — Dashboard
- [ ] Frontend: Delivery — Orders page
- [ ] Frontend: Delivery — Earnings page

**Deliverable:** Working delivery tracking system.

---

## Phase 9: Admin Reports & User Management (Week 9)

> **Goal:** Admin can view reports and manage all users.

- [ ] Create user controller (list, update, delete, change role)
- [ ] Create user routes
- [ ] Create report endpoints (revenue, bookings, occupancy stats)
- [ ] Frontend: Admin — ManageUsers page
- [ ] Frontend: Admin — Reports page (charts and tables)

**Deliverable:** Admin dashboard with insights and user management.

---

## Phase 10: UI Polish & Dashboards (Week 10)

> **Goal:** Beautiful, responsive UI with proper dashboards.

- [ ] Design and implement Navbar, Footer, Sidebar
- [ ] Create role-specific dashboard layouts
- [ ] Add loading spinners and error states
- [ ] Implement responsive design (mobile-friendly)
- [ ] Add toast notifications for success/error feedback
- [ ] Add form validation
- [ ] Review and polish all existing pages

**Deliverable:** Professional-looking, responsive application.

---

## Phase 11: Docker & Deployment (Week 11)

> **Goal:** Containerize and prepare for deployment.

- [ ] Create Dockerfile for backend
- [ ] Create Dockerfile for frontend
- [ ] Create docker-compose.yml (MongoDB + backend + frontend)
- [ ] Add health check endpoints
- [ ] Test full application in Docker
- [ ] Write deployment documentation

**Deliverable:** One-command startup with `docker-compose up`.

---

## Phase 12: Testing & Final Review (Week 12)

> **Goal:** Ensure everything works correctly.

- [ ] Test all API endpoints
- [ ] Test all user flows (register → book → pay → check-in → check-out)
- [ ] Test role-based access (each role can only access their pages)
- [ ] Fix bugs found during testing
- [ ] Code cleanup and comments
- [ ] Final README update

**Deliverable:** Production-ready application.

---

## Visual Roadmap

```
Week 1    ████░░░░░░░░  Setup & Foundation
Week 2    ████████░░░░  Authentication
Week 3    ████████░░░░  Room Management
Week 4    ██████░░░░░░  Wedding Management
Week 5-6  ████████████  Restaurant & Menu
Week 6    ██████░░░░░░  Pool Management
Week 7    ██████░░░░░░  Payment System
Week 8    ██████░░░░░░  Delivery System
Week 9    ██████░░░░░░  Reports & Users
Week 10   ████████░░░░  UI Polish
Week 11   ██████░░░░░░  Docker & Deploy
Week 12   ██████░░░░░░  Testing & Review
```

