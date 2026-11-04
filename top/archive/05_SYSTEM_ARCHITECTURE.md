# 05 — System Architecture

**Project:** PriceIntel v2.0

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                              │
│                    Next.js 14 (Vercel)                           │
│                                                                   │
│  Pages: / | /search | /product/[id] | /wishlist | /alerts        │
│  /login | /signup | /profile | /dashboard                        │
│                                                                   │
│  Components: SearchBar, PriceCard, CompareTable, PriceChart,     │
│              WishlistItem, AlertForm, ImageUpload                 │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP / API Routes
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                  NEXT.JS API ROUTES (Vercel)                      │
│                                                                   │
│  /api/search          → Fetch prices from 3 stores               │
│  /api/upload          → Process image → Vision API → search      │
│  /api/wishlist        → CRUD via Supabase                        │
│  /api/alerts          → CRUD via Supabase                        │
│  /api/history         → Read via Supabase                        │
│  /api/profile         → CRUD via Supabase                        │
└────────┬──────────────────┬─────────────────┬───────────────────┘
         │                  │                 │
         ▼                  ▼                 ▼
┌──────────────┐  ┌─────────────────┐  ┌────────────────────────┐
│  RAPIDAPI    │  │  GOOGLE VISION  │  │    SUPABASE            │
│              │  │  API            │  │                        │
│  Amazon      │  │                 │  │  PostgreSQL DB         │
│  Walmart     │  │  Image →        │  │  Auth (Google OAuth)   │
│  Flipkart    │  │  Product Label  │  │  Storage (images)      │
│              │  │                 │  │  Realtime (alerts)     │
└──────────────┘  └─────────────────┘  └───────────┬────────────┘
                                                    │
                                                    ▼
                                        ┌───────────────────────┐
                                        │  SUPABASE EDGE FUNC   │
                                        │  (Background Jobs)    │
                                        │                       │
                                        │  price-alert-checker  │
                                        │  → SendGrid email     │
                                        └───────────────────────┘
```

---

## Data Flow: Text Search

```
User types "iPhone 15 Pro"
    │
    ▼
SearchBar component → POST /api/search { query: "iPhone 15 Pro", userId }
    │
    ▼
/api/search route
    ├── Parallel fetch: getAmazonPrices(query)
    ├── Parallel fetch: getWalmartPrices(query)  
    └── Parallel fetch: getFlipkartPrices(query)
    │
    ▼ Promise.allSettled()
All results aggregated → comparePrices(allDeals) → rank + score
    │
    ▼
Supabase: INSERT search_history + INSERT prices (for history tracking)
    │
    ▼
Return: { product, stats, rankedDeals } → frontend
    │
    ▼
PriceCard grid renders, Chart shows history, BestDeal highlighted
```

---

## Data Flow: Image Upload

```
User drops image file
    │
    ▼
ImageUpload component
    ├── Preview image locally
    └── POST /api/upload (FormData with image)
    │
    ▼
/api/upload route
    ├── Validate file type + size (< 5MB)
    ├── Upload to Supabase Storage → get URL
    ├── Call Google Vision API with URL
    │       └── Returns: labels + confidence scores
    ├── Extract best product label
    └── Call comparePrices(label) → same as text search
    │
    ▼
Return: { prediction, confidence, stats, deals }
    │
    ▼
Frontend shows: "Identified: iPhone 15 Pro (94% confident)" + results
```

---

## Data Flow: Price Alert

```
User sets alert: "iPhone 15 Pro" at target $799
    │
    ▼
AlertForm → POST /api/alerts { userId, productName, targetPrice }
    │
    ▼
Supabase: INSERT price_alerts { user_id, product_name, target_price, is_active: true }
    │
Every search involving "iPhone 15 Pro":
    ├── After fetching prices, check alerts table
    ├── IF lowest_price ≤ target_price AND is_active = true:
    │       ├── UPDATE is_active = false
    │       └── Trigger Supabase Edge Function → SendGrid email
    │
    ▼
User receives email: "iPhone 15 Pro is now $749 on Amazon!"
```

---

## Supabase Schema Overview

```sql
-- Core tables (detailed in 06_DATABASE_DESIGN.md)
users           → Auth managed by Supabase; profile extension
products        → Tracked product catalog
prices          → Time-series price records (with store, timestamp)
search_history  → Per-user query log
price_alerts    → Target price subscriptions
wishlist_items  → User's saved products
```

---

## Deployment Architecture

```
GitHub (main branch push)
    │
    ▼
GitHub Actions
    ├── Run lint + tests
    └── On pass → trigger Vercel deploy
    │
    ▼
Vercel
    ├── Build Next.js app
    ├── Deploy API routes as Vercel Functions (serverless)
    └── Serve static assets from CDN
    │
    ▼
Runtime:
    ├── Vercel Functions → RapidAPI (outbound)
    ├── Vercel Functions → Google Vision API (outbound)
    ├── Vercel Functions → Supabase PostgreSQL
    └── Supabase → Edge Functions (background jobs)
```

---

## Module Classification

| Module | Decision | Rationale |
|--------|----------|-----------|
| Flask app | REPLACE | Next.js API routes serve same purpose + unified deploy |
| SQLite + SQLAlchemy | REBUILD | Supabase PostgreSQL; production-scale |
| Custom auth | REPLACE | Supabase Auth has Google OAuth built-in |
| `product_search.py` logic | KEEP + IMPROVE | Port to TypeScript; fix error handling |
| `comparison_engine.py` | FIX | Fix scoring formula; port to TypeScript |
| `model_integration.py` | REPLACE | MobileNetV2 ImageNet insufficient; use Google Vision |
| `preprocessing.py` | REPLACE | Sharp in Node.js; serverless-compatible |
| Selenium scrapers | REMOVE | RapidAPI replaces; scrapers blocked anyway |
| `db_models.py` | REMOVE | Dead code, conflicts with active schema |
| `frontend-html/` | REMOVE | Old prototype |
| `frontend/frontend-app/` | REMOVE | Duplicate CRA |
| React Router + CRA | REPLACE | Next.js App Router |
| Bootstrap 5 | REPLACE | Tailwind CSS + shadcn/ui |
| Chart.js | REPLACE | Recharts (better React integration) |
