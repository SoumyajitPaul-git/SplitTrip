# ✈️ SplitTrip — Group Tour Expense Tracker & Splitter

<div align="center">
  <img src="https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Backend-Express.js-blue?style=for-the-badge&logo=node.js" />
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Database-MongoDB-green?style=for-the-badge&logo=mongodb" />
</div>

> A hassle-free way to split expenses, track payments, and finalize balances after a tour — all in one elegant interface.

---

## 📸 Preview

> Coming Soon: Screenshots and demo GIFs of the UI, final report, and expense flow.

---

## 🌟 Key Features

- 🔐 **User Auth** – Register/Login with secure JWT tokens
- 🧳 **Tour Dashboard** – Create or join tours with members and dates
- 💵 **Expense Manager** – Add expenses, auto split between selected members
- 📊 **Final Report** – Shows who paid how much, who owes whom, and net balance
- ✉️ **Invite Link** – Let friends join a tour via a link
- 🔒 **Protected APIs** – Using middleware for secured access

---

## 🗂 Project Structure

```
SplitTrip/
│
├── frontend/               # React-based frontend
│   └── ...
│
├── backend/                # Node.js + Express backend
│   ├── models/             # Mongoose models: User, Tour, Expense
│   ├── routes/             # API routes: /auth, /tours, /expenses
│   ├── middleware/         # Auth middleware (JWT verification)
│   └── server.js           # Server entry point
│
├── .gitignore
└── README.md
```

---

## ⚙️ Tech Stack

| Layer        | Technology              |
|--------------|--------------------------|
| Frontend     | React.js (Vite/CRA)      |
| Backend      | Node.js, Express.js      |
| Database     | MongoDB with Mongoose    |
| Auth         | JWT (JSON Web Tokens)    |
| Dev Tools    | Nodemon, dotenv, CORS    |

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/SoumyajitPaul-git/SplitTrip.git
cd SplitTrip
```

### 2. Setup Backend

```bash
cd backend
npm install
```

🔐 Create a `.env` file in `backend/`:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

Then run:

```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
npm start
```

---

## 📈 Final Report (Auto Calculated)

The **Tour Report** shows:

- ✅ **Total Tour Budget**
- 💰 **Per Person Share**
- 💳 **How much each member paid**
- 🧾 **How much they owe or are owed**

---

## ✅ Sample API Routes

- `POST /api/auth/register` – Register user  
- `POST /api/auth/login` – Login user  
- `POST /api/tours/create` – Create new tour  
- `POST /api/expenses/add` – Add new expense  

_All protected routes require Authorization header with JWT token._

---

## 🧪 Testing the API

Use Postman or Thunder Client to test endpoints with headers:

```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

---

## 📝 License

MIT License.  
Made with ❤️ by [Soumyajit Paul](https://github.com/SoumyajitPaul-git)

---
