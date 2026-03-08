# NEPSE Portfolio Manager

A premium, modern web application for tracking and managing stock portfolios in the Nepal Stock Exchange (NEPSE). This tool provides real-time market insights, portfolio analytics, and interactive charting to help investors make data-driven decisions.

## 🚀 Features

- **Real-time Market Ticker**: Live stock prices and indices with 10-second auto-refresh during market hours.
- **Portfolio Analytics**: Comprehensive P&L tracking, weighted average cost calculations, and sector-wise distribution.
- **Interactive Charts**: Professional-grade financial charts powered by Lightweight Charts for historical price analysis.
- **Market Movers**: Instant visibility into top gainers and losers in the market.
- **Secure Authentication**: User accounts with JWT-based sessions and Google One Tap login support.
- **Responsive Design**: Premium UI with glassmorphism, animations, and a fully mobile-accessible layout.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js with Vite
- **Styling**: Tailwind CSS for a custom, premium design system
- **State Management**: React Context API
- **Icons & UI**: Lucide React
- **Charts**: Lightweight Charts (TradingView)
- **API Client**: Axios with centralized service architecture

### Backend
- **Runtime**: Node.js & Express
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT & Google OAuth2
- **Automation**: Node-cron for scheduled market data synchronization
- **Architecture**: Service-Controller-Model pattern for high maintainability

## 📁 Project Structure

```text
├── frontend/                # React Frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── services/        # Centralized API service layer
│   │   ├── utils/           # Formatting and helper utilities
│   │   ├── contexts/        # Auth and global state
│   │   └── pages/           # High-level page components
├── backend/                 # Express Backend
│   ├── controllers/         # Request handling logic
│   ├── services/            # Business logic and external API integrations
│   ├── models/              # MongoDB/Mongoose schemas
│   ├── routes/              # API endpoint definitions
│   ├── jobs/                # Background cron tasks
│   └── config/              # Centralized client configurations
```

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB instance

### 1. Clone & Install
```bash
git clone <your-repository-url>
cd Nepse_portfolio
```

### 2. Backend Configuration
Navigate to `backend/` and create a `.env` file:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
FRONTEND_URL=http://localhost:5173
```
Install dependencies and start:
```bash
npm install
npm start
```

### 3. Frontend Configuration
Navigate to `frontend/` and create a `.env` file:
```env
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```
Install dependencies and start:
```bash
npm install
npm run dev
```

## 🛡️ License
Distributed under the MIT License.
