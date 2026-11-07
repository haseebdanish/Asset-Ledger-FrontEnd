
# 💰 AssetLedger – Frontend

A personal finance and net-worth tracking application built with React. AssetLedger allows users to securely manage their assets, monitor their portfolio, and get an overview of their financial position through an interactive dashboard.

## 🚀 Live Application

- **Frontend:** https://asset-ledger-front-end.vercel.app
- **Backend API:** https://asset-ledger-backend.onrender.com
- **Backend Repository:** https://github.com/haseebdanish/Asset-Ledger-Backend
- **API Documentation:** https://asset-ledger-backend.onrender.com/swagger-ui/index.html

## ✨ Features

### 🔐 User Authentication
- User registration and login.
- JWT-based authentication.
- Secure token storage.
- Protected application routes.

### 📊 Asset Management
- Add and manage financial assets.
- View assets belonging to the authenticated user.
- Update and delete existing assets.
- Support for multiple asset categories.

### 📈 Dashboard & Analytics
- Overview of the user's financial portfolio.
- Net-worth summary based on invested amounts.
- Asset allocation visualization.
- Portfolio analytics and holding insights.

### 🔎 Asset Discovery
- Search assets by keyword.
- Filter assets by category.
- Paginated asset listing.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | Frontend library |
| Vite 8 | Development server and build tool |
| Tailwind CSS 4 | Styling |
| React Router 7 | Client-side routing |
| Axios | HTTP requests and API integration |
| Recharts | Charts and data visualization |
| Lucide React | Icons |
| Vercel | Frontend deployment |

## 🏗️ Application Architecture

The frontend communicates with the Spring Boot backend through REST APIs.

```text
React Frontend
      |
      | Axios HTTP Requests
      |
      v
Spring Boot REST API
      |
      | JWT Authentication
      |
      v
PostgreSQL Database
```

Authenticated API requests include the JWT token in the Authorization header:

```http
Authorization: Bearer <JWT_TOKEN>
```

## ⚙️ Getting Started

### 📋 Prerequisites

- Node.js
- npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/haseebdanish/Asset-Ledger-FrontEnd.git
```

### 2. Navigate to the project directory

```bash
cd Asset-Ledger-FrontEnd
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env.development` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:8080
```

This points the frontend to the locally running Spring Boot backend.

For production, configure the following environment variable in Vercel:

```env
VITE_API_BASE_URL=https://asset-ledger-backend.onrender.com
```

### 5. Start the development server

```bash
npm run dev
```

The application will be available at:

http://localhost:5173

## 🔗 Backend Integration

AssetLedger uses a separate Spring Boot backend for authentication, asset management, and portfolio analytics.

- **Backend Repository:** https://github.com/haseebdanish/Asset-Ledger-Backend
- **API Documentation:** https://asset-ledger-backend.onrender.com/swagger-ui/index.html

## ☁️ Deployment

The frontend is deployed using **Vercel**.

The production frontend communicates with the backend hosted on **Render**, which connects to a PostgreSQL database hosted on **Neon**.

## 🔮 Future Improvements

- Live market price integration for supported assets.
- Portfolio performance tracking over time.
- Historical net-worth charts.
- Improved dashboard and data visualization.
- Additional financial insights.

## 👨‍💻 Author

**Haseeb Danish**

GitHub: https://github.com/haseebdanish
