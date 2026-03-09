// ============================================
// seed.js — Database Seeder
// ============================================
//
// HOW TO RUN:
//   cd backend
//   node seed.js
//
// WHAT IT CREATES:
//   5 demo users (one per role), 10 rooms, 10 menu items

const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');

async function seed() {
  try {
    // ── Connect ──
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected\n');

    // ── Load models AFTER connecting ──
    const User     = require('./models/User');
    const Room     = require('./models/Room');
    const MenuItem = require('./models/MenuItem');

    // ──────────────────────────────────────────
    // USERS
    // ──────────────────────────────────────────
    const usersToCreate = [
      { name: 'Admin User',    email: 'admin@luxe.com',    rawPwd: 'Admin@123',    role: 'admin',    phone: '+94 77 000 0001' },
      { name: 'Staff Member',  email: 'staff@luxe.com',    rawPwd: 'Staff@123',    role: 'staff',    phone: '+94 77 000 0002' },
      { name: 'Cashier Bob',   email: 'cashier@luxe.com',  rawPwd: 'Cashier@123',  role: 'cashier',  phone: '+94 77 000 0003' },
      { name: 'Rider Ravi',    email: 'delivery@luxe.com', rawPwd: 'Delivery@123', role: 'delivery', phone: '+94 77 000 0004' },
      { name: 'Jane Customer', email: 'customer@luxe.com', rawPwd: 'Customer@123', role: 'customer', phone: '+94 77 000 0005' },
    ];

    console.log('🗑️  Removing old demo users…');
    await User.deleteMany({ email: { $in: usersToCreate.map(u => u.email) } });

    console.log('👥 Creating users…');
    for (const u of usersToCreate) {
      // We hash manually here so we can use insertOne (bypasses the pre-save hook
      // which triggered the 'next is not a function' error in some bcrypt versions)
      const hashedPwd = await bcrypt.hash(u.rawPwd, 10);

      await User.collection.insertOne({
        name:      u.name,
        email:     u.email,
        password:  hashedPwd,
        phone:     u.phone,
        role:      u.role,
        isActive:  true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`   ✅ ${u.role.padEnd(10)} ${u.email}  /  ${u.rawPwd}`);
    }

    // ──────────────────────────────────────────
    // ROOMS
    // ──────────────────────────────────────────
    const rooms = [
      { roomNumber: '101', type: 'single', description: 'Cozy single room with city view',              price:  5000, capacity: 1, floor: 1, amenities: ['WiFi','AC','TV'] },
      { roomNumber: '102', type: 'single', description: 'Compact single room with garden view',          price:  4500, capacity: 1, floor: 1, amenities: ['WiFi','AC'] },
      { roomNumber: '201', type: 'double', description: 'Spacious double room with sea view',             price:  9000, capacity: 2, floor: 2, amenities: ['WiFi','AC','TV','Mini Bar'] },
      { roomNumber: '202', type: 'double', description: 'Double room with balcony',                       price: 10000, capacity: 2, floor: 2, amenities: ['WiFi','AC','TV','Balcony'] },
      { roomNumber: '203', type: 'twin',   description: 'Twin room with two separate beds',               price:  9500, capacity: 2, floor: 2, amenities: ['WiFi','AC','TV'] },
      { roomNumber: '301', type: 'family', description: 'Large family room sleeps 4',                    price: 15000, capacity: 4, floor: 3, amenities: ['WiFi','AC','TV','Mini Bar','Sofa Bed'] },
      { roomNumber: '302', type: 'family', description: 'Family suite with bunk beds',                   price: 16000, capacity: 5, floor: 3, amenities: ['WiFi','AC','TV','Bunk Beds'] },
      { roomNumber: '401', type: 'suite',  description: 'Luxury suite with panoramic ocean view',        price: 30000, capacity: 2, floor: 4, amenities: ['WiFi','AC','TV','Jacuzzi','Balcony','Mini Bar'] },
      { roomNumber: '402', type: 'suite',  description: 'Presidential suite — the finest room',         price: 50000, capacity: 3, floor: 4, amenities: ['WiFi','AC','TV','Private Pool','Jacuzzi','Full Kitchen'] },
      { roomNumber: '103', type: 'double', description: 'Economy double room',                            price:  7500, capacity: 2, floor: 1, amenities: ['WiFi','AC'] },
    ];

    console.log('\n🗑️  Removing old demo rooms…');
    await Room.deleteMany({ roomNumber: { $in: rooms.map(r => r.roomNumber) } });

    console.log('🛏️  Creating rooms…');
    for (const r of rooms) {
      await Room.create({ ...r, status: 'available', isActive: true });
      console.log(`   ✅ Room ${r.roomNumber} (${r.type})  Rs.${r.price}/night`);
    }

    // ──────────────────────────────────────────
    // MENU ITEMS
    // ──────────────────────────────────────────
    const menuItems = [
      { name: 'Club Sandwich',   category: 'snack',       price: 850,  description: 'Triple-decker chicken, cheese and veggies' },
      { name: 'Caesar Salad',    category: 'appetizer',   price: 650,  description: 'Romaine with classic Caesar dressing' },
      { name: 'Grilled Salmon',  category: 'main-course', price: 2200, description: 'Atlantic salmon with lemon butter sauce' },
      { name: 'Beef Burger',     category: 'main-course', price: 1200, description: 'Angus beef patty with fries' },
      { name: 'Chicken Pasta',   category: 'main-course', price: 1100, description: 'Creamy penne with grilled chicken' },
      { name: 'Vegetable Curry', category: 'main-course', price:  900, description: 'Mixed vegetables in coconut curry' },
      { name: 'Chocolate Lava',  category: 'dessert',     price:  700, description: 'Warm chocolate cake with vanilla ice cream' },
      { name: 'Fresh Lime Soda', category: 'beverage',    price:  300, description: 'Refreshing lime soda with mint' },
      { name: 'Masala Tea',      category: 'beverage',    price:  200, description: 'Spiced Indian tea' },
      { name: 'Filter Coffee',   category: 'beverage',    price:  250, description: 'South Indian filter coffee' },
    ];

    console.log('\n🗑️  Removing old menu items…');
    await MenuItem.deleteMany({ name: { $in: menuItems.map(m => m.name) } });

    console.log('🍽️  Creating menu items…');
    for (const item of menuItems) {
      await MenuItem.create({ ...item, isAvailable: true, isActive: true });
      console.log(`   ✅ ${item.name.padEnd(20)} Rs.${item.price}`);
    }

    // ──────────────────────────────────────────
    // DONE
    // ──────────────────────────────────────────
    console.log('\n' + '='.repeat(55));
    console.log('✅  DATABASE SEEDED SUCCESSFULLY!');
    console.log('='.repeat(55));
    console.log('\n📋 DEMO LOGIN CREDENTIALS\n');
    console.log('   Role       Email                     Password');
    console.log('   ─────────  ────────────────────────  ─────────────');
    usersToCreate.forEach(u => {
      console.log(`   ${u.role.padEnd(10)} ${u.email.padEnd(25)} ${u.rawPwd}`);
    });
    console.log('\n🌐 Frontend: http://localhost:5173');
    console.log('🔌 Backend:  http://localhost:5000\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
