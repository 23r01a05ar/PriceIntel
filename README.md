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
* 🤖 AI-powered product matching using image recognition (RapidAPI Google Lens)
* 📊 Price history tracking with interactive charts
* ❤️ Wishlist system ("Intelligence Vault")
* 🌙 Dark mode + Glassmorphism UI
* 🔐 Supabase Authentication (Email & Google OAuth)
* ⚡ Fast Serverless API responses with Edge Rate Limiting

---

## 🔄 Data Flow

* **Frontend:** User submits a search query or uploads a product image via Next.js 14 App Router.
* **API Routes:** Next.js Serverless APIs securely dispatch requests.
* **API Engines:** Fetch real-time product prices from multiple platforms securely.
* **AI Layer:** Identifies product details using Google Lens.
* **Database:** Stores user data, queries, and history securely in Supabase PostgreSQL (secured via RLS).
* **Response:** Returns structured JSON to the frontend dashboard.

---

## 🏗️ System Architecture

* **Frontend:** Next.js 14 App Router (React, Tailwind CSS, Framer Motion)
* **Backend:** Next.js API Routes (`/api/*`)
* **Database:** Supabase PostgreSQL
* **Authentication:** Supabase Auth
* **Storage:** Supabase Storage (For image uploads)

---

## 🛠️ Technology Stack

| Category | Technologies |
| -------- | ----------------------------------- |
| Frontend | Next.js 14, React, Tailwind CSS, shadcn/ui, framer-motion, Recharts |
| Backend  | Next.js API Routes, Edge Middleware |
| AI       | RapidAPI Google Lens |
| APIs     | RapidAPI (Amazon, Walmart, Flipkart) |
| Database | Supabase PostgreSQL |
| Auth     | Supabase Auth |
| Tools    | Git, GitHub, VS Code |

---

## ✅ Pre-run Checklist

* Node.js 18+ installed
* Ports available: `3000`

---

## 🔑 Environment Variables

To configure local environment variables securely:
1. Navigate to `/frontend`.
2. Open `.env.local` and fill in your actual credentials (the `.env.local` file is ignored by Git to prevent credential leaks):
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. For RapidAPI Providers:
   - Navigate to `frontend/src/config/rapidapi/snippets/`
   - Paste the Node.js (fetch) snippet containing your API key into a `.txt` file (e.g. `amazon-1.txt`).
   - Run `npm run validate-snippets`. Your API keys are automatically securely extracted.

---

## 🚀 Quick Start

```bash
cd frontend
npm install
npm run dev
```

Navigate to `http://localhost:3000` to access the application.

---

## 📡 API Endpoints

* `GET /api/search?query=laptop` — Compare real-time prices across stores
* `POST /api/upload` — Upload product image for AI-driven search
* `GET /api/price-history?product_id=1` — Retrieve historical prices for charting
* `POST /api/wishlist` — Add a product to the user's wishlist vault
* `GET /api/wishlist` — Fetch the user's vault
* `DELETE /api/wishlist?wish_id=X` — Remove a product from the wishlist
* `GET /api/history` — Fetch recent user search queries
* `POST /api/alerts` — Create a target price alert

---

## 📸 Screenshots

The user interface mockups and dashboards can be viewed in:
- [UI PHOTOS Directory](file:///e:/product-price-intelligence-main/UI%20PHOTOS) in the repository workspace.

---

## 🤝 Contribution Guidelines

* Branch naming → `feature/your-name`
* Commit format → `Milestone: Description`
* Follow ESLint (React) and Prettier conventions

---

## 👨‍💻 Author

**K.S.S. Vallabha**  
Infosys Springboard Internship – Batch 13  
Project modernized and updated under secure development standards.
