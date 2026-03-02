<p align="center">
  <a href="https://vitejs.dev" target="blank"><img src="https://vitejs.dev/logo.svg" width="100" alt="Vite Logo" /></a>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://nestjs.com" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="100" alt="NestJS Logo" /></a>
</p>

<h1 align="center">FinFive</h1>

<p align="center">
  A modern full-stack financial application built with <a href="https://vitejs.dev" target="_blank">Vite + React</a> on the frontend and <a href="https://nestjs.com" target="_blank">NestJS</a> on the backend.
</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/vite.svg" alt="Vite Version" />
  <img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NestJS Version" />
  <img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="License" />
  <img src="https://img.shields.io/badge/stack-Vite%20%2B%20NestJS-brightgreen" alt="Stack" />
  <img src="https://img.shields.io/badge/styling-TailwindCSS-38bdf8" alt="Tailwind" />
</p>

---

## 📁 Project Structure

```
FinFive/
├── client/                  # Frontend — Vite + React + Tailwind
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
└── server/                  # Backend — NestJS + MongoDB
    ├── src/
    │   ├── auth/
    │   │   ├── auth.controller.ts
    │   │   ├── auth.service.ts
    │   │   └── auth.module.ts
    │   ├── users/
    │   │   ├── dto/
    │   │   │   ├── create-user.dto.ts
    │   │   │   └── update-user.dto.ts
    │   │   ├── schemas/
    │   │   │   └── user.schema.ts
    │   │   ├── users.controller.ts
    │   │   ├── users.service.ts
    │   │   └── users.module.ts
    │   ├── app.module.ts
    │   ├── app.controller.ts
    │   ├── app.service.ts
    │   └── main.ts
    ├── test/
    ├── nest-cli.json
    ├── tsconfig.json
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/FinFive.git
cd FinFive
```

---

### 2. Setup the Backend (NestJS)

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/finfive
JWT_SECRET=your_jwt_secret_here
```

```bash
# development
npm run start

# watch mode (recommended)
npm run start:dev

# production
npm run start:prod
```

Backend runs on: `http://localhost:3000`

---

### 3. Setup the Frontend (Vite + React)

```bash
cd client
npm install
```

Create a `.env` file in the `client/` directory:

```env
VITE_API_URL=http://localhost:3000
```

```bash
# development with HMR
npm run dev

# production build
npm run build

# preview production build
npm run preview
```

Frontend runs on: `http://localhost:5173`

---

## 🔐 Auth API

Base URL: `http://localhost:5000`

#### Register

```http
POST /users
```

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Login

```http
POST /users
```

```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 👤 Users API

> All `/users` routes require a Bearer token in the `Authorization` header.

```
Authorization: Bearer <access_token>
```

| Method   | Endpoint      | Description        |
|----------|---------------|--------------------|
| `GET`    | `/users`      | Get all users      |
| `GET`    | `/users/:id`  | Get user by ID     |
| `POST`   | `/users`      | Create a new user  |
| `PATCH`  | `/users/:id`  | Update a user      |
| `DELETE` | `/users/:id`  | Delete a user      |

#### Get All Users

```http
GET /users
```

**Response** `200 OK`

```json
[
  {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Create User

```http
POST /users
```

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "securepassword"
}
```

#### Update User

```http
PATCH /users/:id
```

```json
{
  "name": "Jane Updated"
}
```

#### Delete User

```http
DELETE /users/:id
```

**Response** `200 OK`

```json
{
  "message": "User deleted successfully."
}
```

---

## 🧪 Running Tests

### Backend

```bash
cd server

# unit tests
npm run test

# e2e tests
npm run test:e2e

# coverage
npm run test:cov
```

### Frontend

```bash
cd client
npm run test
```

---

## 🛠️ Tech Stack

| Layer      | Technology                          |
|------------|--------------------------------------|
| Frontend   | React, Vite, Tailwind CSS            |
| Backend    | NestJS, TypeScript                   |
| Database   | MongoDB (Mongoose)                   |
| Auth       | JWT (JSON Web Tokens)                |
| Linting    | ESLint, Prettier                     |

---

## 📦 Deployment

### Frontend (Vercel / Netlify)

```bash
cd client
npm run build
# Deploy the dist/ folder
```

### Backend (AWS via Mau)

```bash
cd server
npm install -g @nestjs/mau
mau deploy
```

---

## 📄 License

This project is [MIT licensed](./LICENSE).

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

---

<p align="center">Built with ❤️ using Vite + NestJS</p>
