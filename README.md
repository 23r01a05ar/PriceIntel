# 🚀 Online Product Price Intelligence System

### **Infosys Springboard Virtual Internship 6.0 | Batch-13**

A high-performance, professional price comparison and intelligence platform. It aggregates real-time data from major e-commerce stores using professional API engines (Amazon, Flipkart, Walmart) and **AI-assisted image recognition for product matching** to provide users with the best deals and market insights.

---

## 🎯 Problem Statement & Solution

**The Problem:**
In today's fragmented e-commerce market, shoppers struggle to find the best prices manually. Dynamic pricing and varying product descriptions across stores (Amazon, Flipkart, Walmart) make manual comparison time-consuming and often inaccurate.

**The Solution:**
This platform automates the entire process. By combining multi-source real-time API integrations with **AI-driven image analysis**, we provide a unified **Glassmorphism dashboard** where users can instantly compare prices, track historical trends via charts, and get smart recommendations based on visual similarity.

---

## ✨ Key Features

* 🔍 Multi-platform real-time price comparison (Amazon, Flipkart, Walmart APIs)
* 🤖 AI-powered product matching using image recognition (MobileNetV2)
* 📊 Price history tracking with interactive charts
* ❤️ Wishlist system ("Intelligence Vault")
* 🌙 Dark mode + Glassmorphism UI
* 🔐 Google OAuth authentication
* ⚡ Fast API responses with server-side caching

---

## 🔄 Data Flow

* **Frontend:** User submits a search query or uploads a product image
* **Flask API:** Handles requests, authenticates sessions, and manages API dispatches
* **API Engines:** Fetch real-time product prices from multiple platforms securely
* **AI Layer:** Identifies product details using TensorFlow (MobileNetV2)
* **Database:** Stores results in SQLite via SQLAlchemy
* **Response:** Returns structured JSON to the frontend dashboard

---

## 🏗️ System Architecture

* **Frontend:** React + Vite (Glassmorphism UI, Dark/Light Mode)
* **Backend:** Flask (Secure API endpoints, AI processing, caching)
* **Database:** SQLite (SQLAlchemy ORM)
* **Authentication:** Google OAuth + Werkzeug secure hashing

---

## 🛠️ Technology Stack

| Category | Technologies |
| -------- | ----------------------------------- |
| Frontend | React, Bootstrap 5, Chart.js, Axios |
| Backend  | Flask, Flask-CORS, Flask-Caching, python-dotenv |
| AI       | TensorFlow, OpenCV, NumPy, Pillow |
| APIs     | RapidAPI (Amazon, Walmart, Flipkart), SerpAPI |
| Database | SQLite, SQLAlchemy |
| Tools    | Git, GitHub, VS Code, Postman |

---

## ✅ Pre-run Checklist

* Python 3.9+ installed
* Node.js installed
* Ports available:
  * Frontend → `5173`
  * Backend → `5000`

---

## 🔑 Environment Variables

To configure local environment variables securely:
1. Navigate to `/backend`.
2. Copy `.env.example` to a new file named `.env`:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and fill in your actual credentials (the `.env` file is ignored by Git to prevent credential leaks):
   ```env
   # API Keys
   RAPIDAPI_KEY=your_rapidapi_key_here
   SERPAPI_KEY=your_serpapi_key_here

   # OAuth Client ID
   GOOGLE_CLIENT_ID=your_google_id_here
   ```

---

## 🚀 Quick Start

### 1️⃣ Backend Setup

```bash
cd backend
python -m venv venv
# On Windows
venv\Scripts\activate
# On Linux/macOS
source venv/bin/activate

pip install -r requirements.txt
python app.py
```

---

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 📡 API Endpoints

* `GET /api/compare-prices?product=laptop` — Compare real-time prices across stores
* `POST /api/upload-image` — Upload product image for AI-driven search
* `GET /api/price-history?product_id=1` — Retrieve historical prices for charting
* `POST /api/wishlist` — Add a product to the user's wishlist vault
* `GET /api/wishlist/<user_id>` — Fetch the user's vault
* `DELETE /api/wishlist/<wish_id>` — Remove a product from the wishlist

---

## 📸 Screenshots

The user interface mockups and dashboards can be viewed in:
- [UI PHOTOS Directory](file:///e:/product-price-intelligence-main/UI%20PHOTOS) in the repository workspace.

---

## 🤝 Contribution Guidelines

* Branch naming → `feature/your-name`
* Commit format → `Milestone: Description`
* Follow PEP8 (Python) & ESLint (React)

---

## 👨‍💻 Author

**K.S.S. Vallabha**  
Infosys Springboard Internship – Batch 13  
Project modernized and updated under secure development standards.
