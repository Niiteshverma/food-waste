# 🍲 FoodSave — Surplus Food Rescue & Community Distribution Platform

FoodSave is a modern full-stack web application designed to combat food waste and address hunger in India by establishing a real-time, zero-waste supply chain between **Restaurants & Food Vendors**, **Eco-conscious Consumers**, and **Non-Governmental Organizations (NGOs)**.

---

## 🌟 Key Features

- **📱 Consumers:** Real-time impact dashboard (CO₂ & kg saved), listings browser with filters (dietary, distance, expiry), free food claims, and order history.
- **🏪 Restaurants:** Surplus inventory posting, expiry countdown timers, pickup slot scheduling, and real-time order tracking.
- **🏛️ NGOs:** Bulk surplus donation claiming, beneficiary tracking, and scheduled distribution logs.
- **⚡ 1-Click Demo Login:** Instant auto-fill on the login page for Consumer, Restaurant, and NGO roles (ideal for portfolios & live demos).

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, React Router DOM v7, Axios, Lucide React, Recharts
- **Backend:** Node.js, Express.js (ES Modules), Prisma ORM, PostgreSQL (Neon / Local)
- **Authentication:** JWT (JSON Web Tokens), bcryptjs

---

## 🚀 Quick Start (Single Command)

### 1. Install Dependencies
Dependencies for both Frontend and Backend are already installed. If ever needed:
```bash
npm install
npm --prefix Backend install
npm --prefix Frontend install
```

### 2. Configure Environment (`Backend/.env`)
Edit `Backend/.env` with your PostgreSQL database URL (Free Neon Cloud DB or Local PostgreSQL):
```env
PORT=8080
DATABASE_URL="postgresql://<user>:<password>@<host>:5432/<database>?sslmode=require"
JWT_SECRET="foodsave_super_secure_jwt_secret_key_2026_xyz"
FRONTEND_URL="http://localhost:5173"
```

### 3. Setup Database Schema & Seed Sample Data
Run the migrations and load demo restaurants, listings, and users:
```bash
npx --prefix Backend prisma migrate deploy
npm run seed
```

### 4. Run the Full Application (Frontend + Backend)
Run both servers together with one command from the project root:
```bash
npm run dev
```

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000/api](http://localhost:5000/api)
- **API Swagger Docs:** [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

---

## 🔑 Demo Login Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **Consumer** | `consumer@foodsave.org` | `password123` |
| **Restaurant** | `spicecraft@foodsave.org` | `password123` |
| **NGO** | `ngo@foodsave.org` | `password123` |

*(You can also click the 1-Click Demo Login buttons directly on the Login page!)*

---

## 📂 Project Structure

```bash
Food-Waste-Reduction/
├── Backend/
│   ├── controllers/        # Business logic controllers
│   ├── routes/             # REST API routes
│   ├── prisma/             # Prisma schema, migrations & seed script
│   ├── uploads/            # Uploaded business and food images
│   ├── server.js           # Express app entrypoint
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── components/     # UI components & shared widgets
│   │   ├── context/        # Auth & Cart context providers
│   │   ├── pages/          # Consumer, Restaurant, NGO & Public pages
│   │   └── lib/api.js      # Dynamic Axios API client
│   ├── package.json
│   └── vite.config.js
├── package.json            # Root launcher for Frontend + Backend
└── README.md
```
