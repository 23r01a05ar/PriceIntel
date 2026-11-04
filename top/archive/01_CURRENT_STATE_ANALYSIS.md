# 01 — Current State Analysis

**Project:** Online Product Price Intelligence System  
**Audited:** 2026-05-30  
**Auditor:** Principal Architecture Review

---

## Repository Structure

```
product-price-intelligence/
├── backend/
│   ├── app.py                          ← Main Flask app (monolithic, 13KB)
│   ├── app/                            ← Partial refactor attempt (disconnected)
│   │   ├── __init__.py
│   │   └── routes/upload.py
│   ├── config.py                       ← API keys hardcoded in plaintext ❌ CRITICAL
│   ├── database.py                     ← Flask-SQLAlchemy models (ACTIVE)
│   ├── db_models.py                    ← Duplicate raw SQLAlchemy models (DEAD CODE)
│   ├── crud.py                         ← DB CRUD helpers
│   ├── model_integration.py            ← MobileNetV2 TF inference
│   ├── preprocessing.py                ← OpenCV preprocessing pipeline
│   ├── preprocessing/                  ← Duplicate preprocessing module
│   ├── comparison_engine.py            ← Price scoring & ranking
│   ├── product_search.py               ← RapidAPI integrations (Amazon/Walmart/Flipkart)
│   ├── serpapi_fetch.py                ← SerpAPI with hardcoded key ❌ CRITICAL
│   ├── price_compare.py                ← Duplicate/orphaned compare logic
│   ├── scrapers/                       ← Selenium + BS4 scrapers (replaced but not removed)
│   │   ├── amazon_scraper.py
│   │   ├── ebay_scraper.py
│   │   └── utils.py
│   ├── ebay_test.py                    ← Debug file in main repo ❌
│   ├── scraper_test.py                 ← Debug file in main repo ❌
│   ├── upc_test.py                     ← Debug file in main repo ❌
│   ├── image_recognition.py            ← Orphaned early prototype
│   ├── run.py                          ← Duplicate app runner
│   ├── requirements.txt                ← Incomplete (missing flask-sqlalchemy etc.)
│   ├── package.json                    ← Node.js file inside Python backend ❌ WRONG
│   ├── price_intelligence.db           ← SQLite DB committed to repo ❌ CRITICAL
│   └── uploads/                        ← User image uploads committed to repo ❌ CRITICAL
├── frontend/
│   ├── src/
│   │   ├── App.js                      ← Router + Navbar (React 18)
│   │   ├── App.css                     ← Glassmorphism dark/light theme
│   │   └── components/
│   │       ├── ComparePage.js          ← Main search + results (24KB, monolithic)
│   │       ├── HomePage.js             ← Landing page
│   │       ├── Login.js                ← Email + Google OAuth login
│   │       ├── Signup.js               ← Registration
│   │       ├── History.js              ← Search history
│   │       ├── Wishlist.js             ← Saved products
│   │       └── Profile.js              ← User profile edit
│   ├── package.json                    ← React 18 + Bootstrap 5 + Chart.js
│   └── frontend-app/                   ← DUPLICATE React app (dead code) ❌
├── frontend-html/                      ← Old HTML prototype (dead code) ❌
│   ├── index.html
│   └── script.js
└── UI PHOTOS/                          ← Screenshots committed to repo
```

---

## Module Status

### Backend Modules

| Module | Status | Grade | Notes |
|--------|--------|-------|-------|
| `app.py` — Main Flask | WORKS | C | Monolithic, all routes in one file, no JWT |
| `database.py` — Models | WORKS | C+ | Functional but duplicated by db_models.py |
| `db_models.py` — Models | DEAD CODE | F | Never imported by app.py, schema conflicts |
| `product_search.py` — RapidAPI | WORKS PARTIALLY | C | API keys exposed, bare excepts |
| `comparison_engine.py` — Scoring | WORKS PARTIALLY | C- | Scoring formula broken (see Tech Debt) |
| `model_integration.py` — AI | WORKS | B- | MobileNetV2 ImageNet labels — not product-specific |
| `preprocessing.py` — Image | WORKS | B | Solid pipeline, duplicated in subfolder |
| `crud.py` — DB Helpers | WORKS | C | Tied to Flask-SQLAlchemy, not reusable |
| `scrapers/` — Selenium+BS4 | BROKEN | D | Amazon blocks Selenium; replaced by RapidAPI but not removed |
| `serpapi_fetch.py` — SerpAPI | WORKS | D | Key hardcoded, not integrated into main app |
| `config.py` | CRITICAL ISSUE | F | All API keys in plaintext, committed |
| `app/` — Partial refactor | ORPHANED | F | Never connected to main app.py |
| Test files (3x) | DEAD CODE | F | ebay_test, scraper_test, upc_test in root |

### Frontend Modules

| Module | Status | Grade | Notes |
|--------|--------|-------|-------|
| `App.js` — Router + Nav | WORKS | B- | Hardcoded localhost URLs throughout |
| `ComparePage.js` — Core | WORKS | C+ | 24KB monolith, URL hardcoded, no TypeScript |
| `Login.js` | WORKS | C+ | Google OAuth placeholder CLIENT_ID |
| `Signup.js` | WORKS | C | No email verification |
| `History.js` | WORKS | C | Basic, no pagination |
| `Wishlist.js` | WORKS | C | Works but no auth tokens |
| `Profile.js` | WORKS | C | Social links stored but unused |
| `frontend-app/` | DEAD CODE | F | Duplicate CRA app inside frontend/ |
| `frontend-html/` | DEAD CODE | F | Old prototype, 2 files |

---

## What Works

- Text-based product search → RapidAPI → Amazon + Walmart + Flipkart results
- Image upload → MobileNetV2 prediction → price fetch
- User registration + password login (Werkzeug hashed)
- Google OAuth login flow (when CLIENT_ID configured)
- Wishlist add/remove/view
- Search history logging
- Price alert creation (DB only — no actual email)
- Price history chart (Chart.js line chart)
- Dark/light mode toggle
- Basic price comparison + deal scoring

## What Partially Works

- Price alerts → stored in DB but `run_price_alert_check()` only prints to console, never sends email
- Image recognition → returns generic ImageNet labels (e.g., "notebook computer"), not specific product names
- Deal score formula → can produce negative scores for high-priced items; `100 - (price * 0.01)` is broken for items > $100
- Scrapers → Selenium version definitely blocked; BS4 fallback also likely blocked by anti-bot measures

## What Is Broken

- Google OAuth → CLIENT_ID is literal placeholder string `"YOUR_GOOGLE_CLIENT_ID"` in both frontend and backend
- `app/` subfolder routes → completely disconnected, never registered with Flask app
- `db_models.py` → conflicting schema with `database.py` (different column names, no `password_hash` required)
- `requirements.txt` → missing: `flask-sqlalchemy`, `flask-caching`, `google-auth`, `google-auth-oauthlib`, `scikit-learn`, `opencv-python`

## What Is Missing

- JWT / session token auth (no token issued on login)
- Input validation / sanitization
- Rate limiting on API endpoints
- `.env` file / environment variable handling
- Proper CORS configuration (currently `CORS(app)` = allow all origins)
- Error boundaries in React
- Loading states for all async operations
- Email notification system (for price alerts)
- Admin dashboard
- Product detail page
- Responsive mobile design gaps
- CI/CD pipeline
- Any deployment configuration (Vercel, Docker, etc.)

---

## Critical Security Findings

1. **API keys in `config.py`** — RapidAPI key `fb2b92412cmsh8e4041d5e17a96fp190184jsn15f3f7612335` exposed
2. **SerpAPI key in `serpapi_fetch.py`** — `44c501bef36f4414e347944032f8d0c131bfe7c24fb5f7ec8883a4942e6a8183` exposed
3. **SQLite DB committed** — `price_intelligence.db` in repo (user data exposed)
4. **User uploads in repo** — 40+ image files committed
5. **No auth tokens** — login returns user object stored in localStorage; no JWT; any user can call any API with any `user_id`
6. **No input sanitization** — product search params passed directly to external APIs
7. **CORS allows all origins** — `CORS(app)` with no restrictions
