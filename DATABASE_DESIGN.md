# 🗄️ Database Design — Collections, Relationships & Examples

## Collection Overview

| # | Collection | Model File | Purpose |
|---|-----------|-----------|---------|
| 1 | users | User.js | All system users and their roles |
| 2 | rooms | Room.js | Hotel rooms with details and status |
| 3 | roombookings | RoomBooking.js | Room reservations |
| 4 | weddinghalls | WeddingHall.js | Wedding/event venues |
| 5 | weddingbookings | WeddingBooking.js | Wedding venue reservations |
| 6 | menuitems | MenuItem.js | Restaurant menu items |
| 7 | orders | Order.js | Food orders (with embedded items) |
| 8 | inventories | Inventory.js | Hotel stock/supplies |
| 9 | payments | Payment.js | All payments across the system |
| 10 | poolbookings | PoolBooking.js | Swimming pool reservations |

> **Note:** MongoDB automatically creates collection names as the lowercase, plural version of the model name (e.g., `User` → `users`, `MenuItem` → `menuitems`).

---

## Relationships Diagram

```
┌──────────┐
│   User   │──────────────────────────────────────────────────────────┐
│ (users)  │                                                          │
└────┬─────┘                                                          │
     │ 1 user can have many...                                        │
     │                                                                │
     ├──── RoomBookings ──── links to ──── Room                      │
     │     (who booked)                   (which room)               │
     │                                                                │
     ├──── WeddingBookings ── links to ── WeddingHall                │
     │     (who booked)                   (which hall)               │
     │                                                                │
     ├──── Orders ─────────── contains ── OrderItems (embedded)      │
     │     (who ordered)                  (what was ordered)         │
     │                                    └── links to MenuItem      │
     │                                                                │
     ├──── PoolBookings                                              │
     │     (who booked the pool)                                     │
     │                                                                │
     └──── Payments ──────── links to ── Any booking/order           │
           (who paid)       (processedBy = which cashier) ───────────┘
```

### Relationship Types Used

| Type | Example | Explanation |
|------|---------|-------------|
| **Reference (ObjectId)** | `RoomBooking.user → User._id` | Stores the `_id` of another document. Use `.populate()` to fetch the full document. |
| **Embedded (Subdocument)** | `Order.items[]` | Stores the data directly inside the parent. No separate collection needed. |
| **Flexible Reference** | `Payment.referenceId` | Points to different collections based on `paymentFor` field. |

---

## Example Documents

### 1. users

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Krishan Kumar",
  "email": "krishan@example.com",
  "password": "$2b$10$X4kv7j5ZcG8FnPmH...",
  "phone": "0771234567",
  "role": "customer",
  "address": "123 Main Street, Colombo",
  "isActive": true,
  "createdAt": "2026-03-08T08:00:00.000Z",
  "updatedAt": "2026-03-08T08:00:00.000Z"
}
```

**Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | String | ✅ | User's full name (max 50 chars) |
| email | String | ✅ | Unique, lowercase, validated format |
| password | String | ✅ | bcrypt hashed (min 6 chars, hidden from queries) |
| phone | String | ❌ | Contact number |
| role | String | ❌ | `customer`, `admin`, `staff`, `cashier`, `delivery` (default: customer) |
| address | String | ❌ | Home/office address |
| isActive | Boolean | ❌ | Account status (default: true) |

---

### 2. rooms

```json
{
  "_id": "507f1f77bcf86cd799439022",
  "roomNumber": "101",
  "type": "double",
  "description": "Spacious double room with ocean view",
  "price": 15000,
  "capacity": 2,
  "amenities": ["WiFi", "AC", "TV", "Mini Bar", "Balcony"],
  "images": ["/uploads/room101-1.jpg", "/uploads/room101-2.jpg"],
  "floor": 1,
  "status": "available",
  "isActive": true,
  "createdAt": "2026-03-01T10:00:00.000Z",
  "updatedAt": "2026-03-01T10:00:00.000Z"
}
```

**Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| roomNumber | String | ✅ | Unique room identifier (e.g., "101") |
| type | String | ✅ | `single`, `double`, `twin`, `suite`, `family` |
| description | String | ❌ | Room details |
| price | Number | ✅ | Price per night (min: 0) |
| capacity | Number | ✅ | Max guests (min: 1) |
| amenities | [String] | ❌ | List of room features |
| images | [String] | ❌ | Image URLs |
| floor | Number | ❌ | Floor number (default: 1) |
| status | String | ❌ | `available`, `occupied`, `maintenance`, `reserved` |
| isActive | Boolean | ❌ | Soft delete flag (default: true) |

---

### 3. roombookings

```json
{
  "_id": "507f1f77bcf86cd799439033",
  "user": "507f1f77bcf86cd799439011",
  "room": "507f1f77bcf86cd799439022",
  "checkIn": "2026-03-15T14:00:00.000Z",
  "checkOut": "2026-03-18T11:00:00.000Z",
  "numberOfGuests": 2,
  "totalPrice": 45000,
  "status": "confirmed",
  "specialRequests": "Extra pillows, late check-out",
  "isPaid": true,
  "paymentId": "507f1f77bcf86cd799439099",
  "createdAt": "2026-03-08T09:00:00.000Z",
  "updatedAt": "2026-03-08T09:30:00.000Z"
}
```

**Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| user | ObjectId → User | ✅ | Who made the booking |
| room | ObjectId → Room | ✅ | Which room is booked |
| checkIn | Date | ✅ | Check-in date/time |
| checkOut | Date | ✅ | Check-out date/time |
| numberOfGuests | Number | ✅ | How many guests (min: 1) |
| totalPrice | Number | ✅ | Total cost for the stay |
| status | String | ❌ | `pending`, `confirmed`, `checked-in`, `checked-out`, `cancelled`, `no-show` |
| specialRequests | String | ❌ | Any special needs |
| isPaid | Boolean | ❌ | Payment status (default: false) |
| paymentId | ObjectId → Payment | ❌ | Link to payment record |

---

### 4. weddinghalls

```json
{
  "_id": "507f1f77bcf86cd799439044",
  "name": "Grand Ballroom",
  "description": "Elegant ballroom with crystal chandeliers",
  "capacity": 500,
  "pricePerDay": 250000,
  "location": "Ground Floor - East Wing",
  "services": ["Decoration", "Catering", "Photography", "DJ", "Lighting"],
  "images": ["/uploads/ballroom-1.jpg"],
  "isAvailable": true,
  "isActive": true,
  "createdAt": "2026-03-01T10:00:00.000Z",
  "updatedAt": "2026-03-01T10:00:00.000Z"
}
```

**Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | String | ✅ | Unique hall name |
| description | String | ❌ | Hall details |
| capacity | Number | ✅ | Max guests (min: 10) |
| pricePerDay | Number | ✅ | Cost per day |
| location | String | ❌ | Where in the hotel |
| services | [String] | ❌ | Available add-on services |
| images | [String] | ❌ | Image URLs |
| isAvailable | Boolean | ❌ | Currently bookable (default: true) |
| isActive | Boolean | ❌ | Soft delete flag (default: true) |

---

### 5. weddingbookings

```json
{
  "_id": "507f1f77bcf86cd799439055",
  "user": "507f1f77bcf86cd799439011",
  "weddingHall": "507f1f77bcf86cd799439044",
  "eventDate": "2026-06-15T00:00:00.000Z",
  "eventType": "wedding",
  "expectedGuests": 300,
  "selectedServices": ["Decoration", "Catering", "Photography"],
  "totalPrice": 350000,
  "status": "confirmed",
  "specialRequests": "Flower arch at entrance",
  "contactPhone": "0771234567",
  "isPaid": false,
  "createdAt": "2026-03-08T10:00:00.000Z",
  "updatedAt": "2026-03-08T10:00:00.000Z"
}
```

**Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| user | ObjectId → User | ✅ | Who booked |
| weddingHall | ObjectId → WeddingHall | ✅ | Which hall |
| eventDate | Date | ✅ | When the event is |
| eventType | String | ❌ | `wedding`, `reception`, `engagement`, `birthday`, `conference`, `other` |
| expectedGuests | Number | ✅ | Estimated attendance |
| selectedServices | [String] | ❌ | Chosen add-on services |
| totalPrice | Number | ✅ | Total cost |
| status | String | ❌ | `pending`, `confirmed`, `completed`, `cancelled` |
| contactPhone | String | ❌ | Phone for coordination |

---

### 6. menuitems

```json
{
  "_id": "507f1f77bcf86cd799439066",
  "name": "Grilled Chicken Rice",
  "description": "Tender grilled chicken with fragrant rice and salad",
  "price": 1200,
  "category": "main-course",
  "image": "/uploads/chicken-rice.jpg",
  "isAvailable": true,
  "preparationTime": 20,
  "isVegetarian": false,
  "isActive": true,
  "createdAt": "2026-03-01T12:00:00.000Z",
  "updatedAt": "2026-03-01T12:00:00.000Z"
}
```

**Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | String | ✅ | Dish name |
| description | String | ❌ | Dish details |
| price | Number | ✅ | Price per serving |
| category | String | ✅ | `appetizer`, `main-course`, `dessert`, `beverage`, `snack` |
| image | String | ❌ | Photo URL |
| isAvailable | Boolean | ❌ | Currently available (default: true) |
| preparationTime | Number | ❌ | Minutes to prepare (default: 15) |
| isVegetarian | Boolean | ❌ | Vegetarian flag (default: false) |

---

### 7. orders

```json
{
  "_id": "507f1f77bcf86cd799439077",
  "user": "507f1f77bcf86cd799439011",
  "items": [
    {
      "menuItem": "507f1f77bcf86cd799439066",
      "name": "Grilled Chicken Rice",
      "quantity": 2,
      "price": 1200
    },
    {
      "menuItem": "507f1f77bcf86cd799439067",
      "name": "Mango Juice",
      "quantity": 2,
      "price": 350
    }
  ],
  "orderType": "dine-in",
  "subtotal": 3100,
  "tax": 310,
  "totalPrice": 3410,
  "status": "preparing",
  "tableNumber": "T5",
  "notes": "No onions on the rice",
  "isPaid": false,
  "createdAt": "2026-03-08T12:30:00.000Z",
  "updatedAt": "2026-03-08T12:35:00.000Z"
}
```

**Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| user | ObjectId → User | ✅ | Who ordered |
| items | [OrderItem] | ✅ | Embedded array of ordered items (min 1) |
| items[].menuItem | ObjectId → MenuItem | ✅ | Reference to menu item |
| items[].name | String | ✅ | Item name (captured at order time) |
| items[].quantity | Number | ✅ | How many (min: 1) |
| items[].price | Number | ✅ | Price at order time |
| orderType | String | ❌ | `dine-in`, `takeaway`, `room-service`, `delivery` |
| subtotal | Number | ✅ | Sum before tax |
| tax | Number | ❌ | Tax amount |
| totalPrice | Number | ✅ | Final total |
| status | String | ❌ | `placed`, `preparing`, `ready`, `served`, `delivered`, `cancelled` |

---

### 8. inventories

```json
{
  "_id": "507f1f77bcf86cd799439088",
  "name": "Basmati Rice",
  "description": "Premium quality basmati rice for restaurant",
  "category": "kitchen",
  "quantity": 50,
  "unit": "kg",
  "minimumStock": 20,
  "unitPrice": 450,
  "supplier": "Lanka Rice Suppliers",
  "stockStatus": "in-stock",
  "lastRestocked": "2026-03-01T08:00:00.000Z",
  "isActive": true,
  "createdAt": "2026-03-01T08:00:00.000Z",
  "updatedAt": "2026-03-08T10:00:00.000Z"
}
```

**Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | String | ✅ | Item name |
| category | String | ✅ | `kitchen`, `housekeeping`, `toiletries`, `maintenance`, `office`, `other` |
| quantity | Number | ✅ | Current stock (min: 0) |
| unit | String | ✅ | Measurement unit (kg, liters, pieces, etc.) |
| minimumStock | Number | ❌ | Alert threshold (default: 10) |
| unitPrice | Number | ❌ | Price per unit |
| supplier | String | ❌ | Supplier name |
| stockStatus | String | ❌ | Auto-calculated: `in-stock`, `low-stock`, `out-of-stock` |
| lastRestocked | Date | ❌ | When stock was last added |

---

### 9. payments

```json
{
  "_id": "507f1f77bcf86cd799439099",
  "user": "507f1f77bcf86cd799439011",
  "paymentFor": "room-booking",
  "referenceId": "507f1f77bcf86cd799439033",
  "amount": 45000,
  "method": "card",
  "status": "completed",
  "receiptNumber": "RCP-20260308-A3B7K2",
  "notes": "Paid in full",
  "processedBy": "507f1f77bcf86cd799439012",
  "createdAt": "2026-03-08T09:30:00.000Z",
  "updatedAt": "2026-03-08T09:30:00.000Z"
}
```

**Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| user | ObjectId → User | ✅ | Who paid |
| paymentFor | String | ✅ | `room-booking`, `wedding-booking`, `food-order`, `pool-booking` |
| referenceId | ObjectId | ✅ | ID of the booking/order being paid for |
| amount | Number | ✅ | Amount paid |
| method | String | ✅ | `cash`, `card`, `bank-transfer` |
| status | String | ❌ | `pending`, `completed`, `failed`, `refunded` |
| receiptNumber | String | auto | Auto-generated (e.g., RCP-20260308-A3B7K2) |
| processedBy | ObjectId → User | ❌ | Which cashier processed it |

---

### 10. poolbookings

```json
{
  "_id": "507f1f77bcf86cd799439100",
  "user": "507f1f77bcf86cd799439011",
  "date": "2026-03-15T00:00:00.000Z",
  "timeSlot": "10:00 AM - 12:00 PM",
  "numberOfPersons": 3,
  "pricePerPerson": 500,
  "totalPrice": 1500,
  "status": "confirmed",
  "isPaid": true,
  "paymentId": "507f1f77bcf86cd799439101",
  "createdAt": "2026-03-08T11:00:00.000Z",
  "updatedAt": "2026-03-08T11:00:00.000Z"
}
```

**Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| user | ObjectId → User | ✅ | Who booked |
| date | Date | ✅ | Booking date |
| timeSlot | String | ✅ | Time range (e.g., "10:00 AM - 12:00 PM") |
| numberOfPersons | Number | ✅ | How many people (min: 1) |
| pricePerPerson | Number | ✅ | Cost per person |
| totalPrice | Number | ✅ | numberOfPersons × pricePerPerson |
| status | String | ❌ | `pending`, `confirmed`, `completed`, `cancelled` |
| isPaid | Boolean | ❌ | Payment status (default: false) |
| paymentId | ObjectId → Payment | ❌ | Link to payment record |

---

## Special Features in the Models

| Feature | Model | What It Does |
|---------|-------|-------------|
| **Pre-save password hashing** | User | Auto-hashes password with bcrypt before saving |
| **comparePassword method** | User | Instance method to verify login passwords |
| **Embedded subdocuments** | Order | Items stored directly inside order (not referenced) |
| **Auto stock-status** | Inventory | Pre-save hook computes `in-stock`/`low-stock`/`out-of-stock` |
| **Auto receipt number** | Payment | Pre-save hook generates unique receipt numbers |
| **Flexible references** | Payment | `paymentFor` + `referenceId` links to different collections |
