# M2T — Moto2Travel

Motorcycle ownership management platform. One account, multiple bikes, fuel/service/expense tracking, and analytics.

**Stack:** MERN (MongoDB, Express, React, Node.js)

## Project Structure

```
m2t/
├── client/          React + Vite + Tailwind (frontend)
├── server/          Express + Mongoose (backend API)
└── package.json     Root scripts to run both
```

## Setup

### 1. Install dependencies

From the **project root** (`bevo-shop/`):

```bash
npm run install:all
```

### 2. Configure environment

Copy the example env and add your MongoDB Atlas URI:

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/m2t
JWT_SECRET=your_secret_key_here
```

### 3. Run development

From the **project root** — one command starts both frontend and backend:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

> **Important:** Run `npm run dev` from `bevo-shop/`, not from `client/` or `server/`.
> If you only start one folder, the other won't run and you'll get connection errors.

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register user |
| POST | `/api/auth/login` | No | Login, get JWT |
| POST | `/api/bikes` | Yes | Add bike |
| GET | `/api/bikes` | Yes | Get user's bikes |
| GET | `/api/bikes/:id` | Yes | Get single bike |
| PUT | `/api/bikes/:id` | Yes | Update bike |
| DELETE | `/api/bikes/:id` | Yes | Delete bike |

## Current Status (Level 1)

- [x] Auth (register, login, JWT, bcrypt)
- [x] Bike CRUD (multi-bike per user)
- [x] Landing page (M2T branding, green theme)
- [x] Login / Register pages
- [x] Basic Dashboard + Add Bike
- [ ] Fuel module
- [ ] Service module
- [ ] Expenses
- [ ] Analytics with real data

## Data Model

```
User (1) ──< Bike (many)
                ├── FuelLog
                ├── ServiceLog
                └── Expense
```
# Mototrack
# Mototrack
# Mototrack
