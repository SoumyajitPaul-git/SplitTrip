# SplitTrip - Group Tour Expense Tracker

A full-stack web application for tracking and settling group tour expenses. Built with modern technologies including **Tailwind CSS** for beautiful, responsive UI.

## ✨ Features

### 🎯 Core Functionality
- **Tour Management**: Create tours with details like destination, dates, and description
- **Unique Join Codes**: Share 8-character codes for others to join your tour  
- **Expense Tracking**: Add expenses with category, amount, payer, and participants
- **Smart Split**: Equal split among selected participants
- **Real-time Updates**: Track expenses as they're added during the tour
- **Settlement Calculator**: Optimized algorithm to minimize number of payments needed
- **Comprehensive Reports**: Detailed breakdown of expenses, balances, and settlements

## 🛠️ Tech Stack

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose** ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **nanoid** for unique join code generation

### Frontend
- **React 18** with **Hooks**
- **Tailwind CSS v3** for styling with custom color variables
- **React Router v6** for navigation
- **Axios** for API calls
- **date-fns** for date formatting
- **Vite** for fast development and building

## 🚀 Quick Start

See [QUICKSTART.md](QUICKSTART.md) for a 5-minute setup guide.

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### Frontend Setup

```bash
cd frontend/viteFr
npm install
npm run dev
```

## 🎨 Tailwind CSS Configuration

Custom theme with semantic color naming:

```javascript
colors: {
  primary: { DEFAULT: '#2563eb', dark: '#1d4ed8' },
  secondary: { DEFAULT: '#10b981', dark: '#059669' },
  danger: { DEFAULT: '#ef4444', dark: '#dc2626' },
  warning: { DEFAULT: '#f59e0b', dark: '#d97706' },
}
```

Custom component classes in `@layer components`:
- Buttons: `.btn`, `.btn-primary`, `.btn-outline`, etc.
- Forms: `.form-control`, `.form-label`, `.form-group`
- Cards: `.card`, `.modal`, `.alert`

For full documentation, see the project READMEs in respective directories.