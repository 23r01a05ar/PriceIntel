# PROJECT_KNOWLEDGE_BASE — PriceIntel v2.0

This knowledge base serves as the single source of truth for the **PriceIntel v2.0** project. It is updated at the end of every completed project phase.

---

## 🏗️ Repository Structure

The cleaned and modernized repository structure consists of the following layout:

```
product-price-intelligence-main/
├── .git/                               ← Git repository metadata
├── .gitignore                          ← Repository-wide Git ignore rules
├── .vscode/                            ← VS Code project configurations
├── Internship_Completion_Report.docx   ← Documentation report
├── README.md                           ← Main developer and setup documentation
├── UI PHOTOS/                          ← UI screenshots
├── backend/                            ← Flask Python backend service
│   ├── .env                            ← Local environment variables (git-ignored)
│   ├── .env.example                    ← Template config for environment variables
│   ├── app.py                          ← Main Flask entry point and REST API routes
│   ├── comparison_engine.py            ← Deal scoring and deal ranking formulas
│   ├── config.py                       ← App configuration and env loaders
│   ├── crud.py                         ← SQLite database CRUD operations helper
│   ├── database.py                     ← SQLAlchemy models (users, wishlist, alerts, etc.)
│   ├── model_integration.py            ← MobileNetV2 image classifier integration
│   ├── preprocessing.py                ← OpenCV/Pillow image preprocessing utility
│   ├── product_search.py               ← RapidAPI integrations (Amazon, Walmart, Flipkart)
│   ├── requirements.txt                ← Declared Python dependencies
│   ├── serpapi_fetch.py                ← SerpAPI search integration utility
│   ├── uploads/                        ← Directory for temporary local image uploads (git-ignored)
│   └── price_intelligence.db           ← SQLite development database (git-ignored)
├── frontend/                           ← React 18 frontend dashboard
│   ├── package.json                    ← Node.js package configurations
│   ├── package-lock.json               ← Version-locked Node.js dependencies
│   ├── public/                         ← Static public files (HTML entry, icons)
│   └── src/                            ← React source code
│       ├── App.css                     ← Glassmorphism & dark/light theme styling
│       ├── App.js                      ← App router, Navbar, and theme context
│       ├── index.css                   ← Global style entry point
│       ├── index.js                    ← React DOM mounting entry point
│       └── components/                 ← React UI views
│           ├── ComparePage.css
│           ├── ComparePage.js          ← Real-time comparison search view
│           ├── History.css
│           ├── History.js              ← Search logs viewer
│           ├── HomePage.css
│           ├── HomePage.js             ← Landing page dashboard
│           ├── Login.js                ← Password/OAuth login portal
│           ├── Profile.js              ← Social profile settings editor
│           ├── Signup.js               ← Registration view
│           └── Wishlist.js             ← Saved deals vault
└── top/                                ← System documentation and blueprints
    ├── 01_CURRENT_STATE_ANALYSIS.md    ← Audit of initial project code
    ├── 02_TECH_DEBT_REPORT.md          ← Tracking structural, code, and security debt
    ├── 05_SYSTEM_ARCHITECTURE.md      ← Layout of Next.js + Supabase Target Stack
    ├── 11_SECURITY_REVIEW.md           ← Critical, High, and Medium vulnerabilities catalog
    ├── PROJECT_KNOWLEDGE_BASE.md       ← Active architectural knowledge base (this file)
    └── TASK_000_MASTER_TRACKER.md      ← Master TODO task tracker and checklist
```

---

## 🛠️ Module Inventory

### Backend Modules

| File | Description | Status |
|------|-------------|--------|
| `backend/app.py` | Central Flask entry point. Hosts all REST endpoints, hooks, and simple cache. | **ACTIVE** |
| `backend/config.py` | Dynamic environment configuration loader; handles fallback variables. | **ACTIVE** |
| `backend/database.py` | Defines Flask-SQLAlchemy models for all 6 tables. | **ACTIVE** |
| `backend/crud.py` | Implements database log helpers like `save_search_query` and `add_product_with_prices`. | **ACTIVE** |
| `backend/product_search.py` | Integrates Amazon, Walmart, and Flipkart search APIs via RapidAPI. | **ACTIVE** |
| `backend/serpapi_fetch.py` | Integrates SerpAPI shopping search tool. | **ACTIVE** |
| `backend/comparison_engine.py` | Contains pricing logic for deal scoring and ranking of multiple results. | **ACTIVE** |
| `backend/preprocessing.py` | Standardizes user-uploaded images using OpenCV (resize, blur, scale). | **ACTIVE** |
| `backend/model_integration.py` | Loads a pre-trained MobileNetV2 network for local ImageNet label classification. | **ACTIVE** |

### Frontend Modules

| File | Description | Status |
|------|-------------|--------|
| `frontend/src/App.js` | Main app container with navigation, Bootstrap grid framework, and dark theme support. | **ACTIVE** |
| `frontend/src/components/HomePage.js` | Landing page of the platform. | **ACTIVE** |
| `frontend/src/components/ComparePage.js` | Unified search, image upload drag-and-drop, and comparison tables. | **ACTIVE** |
| `frontend/src/components/Login.js` | Handles local registration sign-in and Google OAuth hooks. | **ACTIVE** |
| `frontend/src/components/Signup.js` | Form for local account registration. | **ACTIVE** |
| `frontend/src/components/History.js` | Logs the user's historical e-commerce queries. | **ACTIVE** |
| `frontend/src/components/Wishlist.js` | Saved products vault with deep-linking to store pages. | **ACTIVE** |
| `frontend/src/components/Profile.js` | Profile manager with social links. | **ACTIVE** |

---

## 🔄 Import & Dependency Map

```
                    ┌──────────── backend/app.py ────────────┐
                    │               (Imports)                │
                    ├─────────┬─────────┬──────────┬─────────┤
                    ▼         ▼         ▼          ▼         ▼
             config.py    database.py   crud.py    │    product_search.py
                 │            ▲         ▲          │         │
                 ▼            │         │          ▼         ▼
             (load_dotenv)    └─────────┼───── comparison_engine.py
                                        │
             model_integration.py ──────┤
                 │                      │
                 ▼                      │
             preprocessing.py ──────────┘
```

- **Core Web/Database**: `flask`, `flask-cors`, `flask-sqlalchemy`, `flask-caching`, `requests`
- **AI/Preprocessors**: `tensorflow` (loads pre-trained MobileNetV2), `numpy`, `pillow` (PIL), `opencv-python-headless` (cv2)
- **Security & Dotenv**: `python-dotenv`, `google-auth`, `google-auth-oauthlib`, `werkzeug`

---

## 📡 API Inventory

The Flask backend hosts the following REST API endpoints:

| Endpoint | Method | Params / Payload | Description | Handler |
|----------|--------|------------------|-------------|---------|
| `/api/login` | `POST` | `{"email", "password"}` | Authenticates local account credentials. | `login()` |
| `/api/register` | `POST` | `{"username", "email", "password"}` | Registers a new local account. | `register()` |
| `/api/google-login`| `POST` | `{"token"}` | Verifies a Google OAuth client token and creates/resolves profile. | `google_login()` |
| `/api/profile/<id>` | `GET` | None | Retrieves user bio and social media URLs. | `get_profile(id)` |
| `/api/profile/<id>` | `PUT` | `{"username", "bio", "whatsapp_no", ...}` | Updates user bio and social links. | `update_profile(id)` |
| `/api/user-history/<id>`| `GET` | None | Returns the user's last 20 queries. | `get_user_history(id)` |
| `/api/wishlist` | `POST` | `{"user_id", "title", "price", "store", "url", "image"}` | Saves an item to the user's wishlist vault. | `add_to_wishlist()` |
| `/api/wishlist/<id>`| `GET` | None | Returns all saved wishlist items for a user. | `get_wishlist(id)` |
| `/api/wishlist/<id>`| `DELETE` | None | Removes a saved item from the user's wishlist. | `remove_from_wishlist(id)` |
| `/api/compare-prices`| `GET` | `?product=item_name&user_id=1` | Fetches, aggregates, and ranks prices from 3 stores. | `get_compare_prices()` |
| `/api/price-history` | `GET` | `?product_id=name_or_id` | Retrieves historical prices recorded in database. | `get_price_history()` |
| `/api/upload-image` | `POST` | `multipart/form-data` with file `image` & `user_id` | Identifies product via CNN, uploads, and aggregates prices. | `upload_image()` |
| `/api/set-alert` | `POST` | `{"product_name", "target_price", "user_email"}` | Registers a price alarm callback. | `set_alert()` |

---

## 🗄️ Database Inventory

The SQLite database consists of the following 6 active tables managed via SQLAlchemy:

```
┌──────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     users        │       │  price_alerts   │       │  search_history │
├──────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)          │◄──┐   │ alert_id (PK)   │   ┌── │ search_id (PK)  │
│ username         │   └───│ user_id (FK)    │   │   │ user_id (FK)    │
│ email            │   └───│ user_email      │   │   │ query           │
│ password_hash    │       │ product_name    │   │   │ timestamp       │
│ google_id        │       │ target_price    │   │   └─────────────────┘
│ bio              │       │ is_active       │   │
│ whatsapp_no      │       │ timestamp       │   │   ┌─────────────────┐
│ twitter_handle   │       └─────────────────┘   │   │  wishlist       │
│ facebook_url     │                             │   ├─────────────────┤
│ created_at       │       ┌─────────────────┐   │   │ wish_id (PK)    │
└──────────────────┘       │    products     │   └───│ user_id (FK)    │
        ▲                  ├─────────────────┤       │ product_title   │
        │                  │ product_id (PK) │◄──┐   │ price           │
        └──────────────────│ name            │   │   │ store           │
                           │ category        │   │   │ product_url     │
                           │ image_url       │   │   │ image_url       │
                           └─────────────────┘   │   │ timestamp       │
                                    ▲            │   └─────────────────┘
                                    │            │
                           ┌────────┴────────┐   │
                           │     prices      │   │
                           ├─────────────────┤   │
                           │ price_id (PK)   │   │
                           │ product_id (FK) │───┘
                           │ store_name      │
                           │ price           │
                           │ timestamp       │
                           │ product_url     │
                           └─────────────────┘
```

---

## 🌐 Frontend Routes

The active React single-page app (React Router v6) implements the following URL mappings:

- `/` ── Renders `HomePage`: Aggregates the platform description, features, and quick navigation cards.
- `/compare` ── Renders `ComparePage`: Core search engine allowing text input queries and drag-and-drop file uploads for image-based price retrieval.
- `/login` ── Renders `Login`: Validates form entries, processes Google login credentials, and records user info in `localStorage`.
- `/signup` ── Renders `Signup`: Collects user registrations and sends them to the Flask backend.
- `/history` ── Renders `History`: Fetches and lists the user's historical queries.
- `/wishlist` ── Renders `Wishlist`: Loads the user's personal bookmark folder ("Intelligence Vault").
- `/profile` ── Renders `Profile`: Allows users to customize their bios and active social links.

---

## 🔑 Environment Variables

The backend application requires local parameters initialized via `backend/.env`. A template is provided in `backend/.env.example`:

| Variable | Description | Default / Example Value |
|----------|-------------|-------------------------|
| `FLASK_APP` | Path to Flask program entry. | `app.py` |
| `FLASK_ENV` | Mode of operation. | `development` |
| `SECRET_KEY` | Key for session hash signing. | `your_flask_secret_key_here` |
| `RAPIDAPI_KEY` | Unified API credentials for store lookups. | `your_rapidapi_key_here` |
| `AMAZON_API_KEY` | RapidAPI key for Amazon engine (falls back to `RAPIDAPI_KEY`).| `your_amazon_rapidapi_key_here` |
| `WALMART_API_KEY` | RapidAPI key for Walmart engine (falls back to `RAPIDAPI_KEY`).| `your_walmart_rapidapi_key_here` |
| `FLIPKART_API_KEY`| RapidAPI key for Flipkart engine (falls back to `RAPIDAPI_KEY`).| `your_flipkart_rapidapi_key_here` |
| `SERPAPI_KEY` | API key to perform SerpAPI shopping searches. | `your_serpapi_key_here` |
| `GOOGLE_CLIENT_ID`| Client identity used to hook Google Login. | `your_google_oauth_client_id_here` |
| `DATABASE_URL` | URI of database backend (falls back to local SQLite). | `sqlite:///price_intelligence.db` |

---

## 🤝 Third-Party Services

- **RapidAPI Store Aggregation**:
  - *Amazon API*: `real-time-amazon-data.p.rapidapi.com`
  - *Walmart API*: `real-time-walmart-product-data-api.p.rapidapi.com`
  - *Flipkart API*: `real-time-flipkart-data2.p.rapidapi.com`
- **SerpAPI (Shopping)**: `https://serpapi.com/search.json` (vanilla product searches)
- **Google Authentication**: OAuth client authentication used on the frontend and backend.

---

## ⚡ Architecture Decisions

### 1. Unified Environment Config
To prevent plaintext credential exposures, all secret tokens were extracted out of the repository codebase (`config.py` and `serpapi_fetch.py`) and refactored to read dynamically from `.env` loaded via `python-dotenv`. An environment fallback structure was designed so that service-specific variables (e.g. `AMAZON_API_KEY`) default to a global `RAPIDAPI_KEY` if not explicitly set.

### 2. Robust Ignored Assets
Added a production-grade `.gitignore` containing comprehensive patterns to exclude SQLite database files (`*.db`, `price_intelligence.db`), local uploads directories (`uploads/`, `backend/uploads/`), IDE metadata (`.vscode/`), and local environment secret variables (`.env`, `*.env`).

### 3. Clean Git History Initialization
Because the initial code was shared without a Git history, we initialized Git fresh after completing the credential rotation. This ensures the repository's version history started in a completely secure state with no plaintext API key leaks.

### 4. Aggressive Dead Code Purge
To prepare for Next.js migration and reduce technical debt, we deleted 26 orphaned files/directories. This included a disconnected blueprint refactor (`backend/app/`), duplicate preprocessing folders, legacy blocked Selenium/BS4 scrapers (`backend/scrapers/`), a duplicate CRA application (`frontend/frontend-app/`), and a legacy HTML prototype (`frontend-html/`).

---

## 🛑 Remaining Technical Debt

### 1. Insecure/Basic Authentication
- **Problem**: Login responses return a plaintext User dictionary that is stored directly in frontend `localStorage`. The application has no JWT token issues, no authorization validation headers, and no expiry/refresh routines. Protected endpoints check plain numerical `user_id` query/body parameters, allowing trivial user spoofing.
- **Plan**: Migrate completely to **Supabase Auth** (JWT verified automatically on serverless routes).

### 2. Broken Deal Score Formula
- **Problem**: The current formula inside `backend/comparison_engine.py` is `score = 100 - (price * 0.01)`. For highly priced items (>$100), this produces negative or excessively low rankings, skewing results.
- **Plan**: Refactor comparison scoring to be percentile-based relative to active search result pools.

### 3. Price Alerts Print Only
- **Problem**: The `run_price_alert_check` endpoint merely prints a log string to the server console instead of executing actual email notifications.
- **Plan**: Set up standard email notifications (SendGrid or SMTP) in the Supabase Edge Function stage.

### 4. CORS Open Policy
- **Problem**: The Flask server initializes with `CORS(app)`, enabling any external origin to execute requests on behalf of local clients.
- **Plan**: Lock down origins to specific verified deployment addresses.

### 5. Hardcoded Localhost API URLs
- **Problem**: The React client contains over 15 hardcoded references to `http://127.0.0.1:5000/api/...` throughout its component files, breaking deployment pipelines.
- **Plan**: Establish a single environment configuration parameter (`REACT_APP_API_URL`) or transition to Next.js API serverless routing.

### 6. OpenCV Dependency Overhead
- **Problem**: Python packages `opencv-python-headless` and `tensorflow` create massive deployment package sizes and high resource overhead.
- **Plan**: Rebuild image preprocessing using `sharp` in Node.js serverless functions, and replace MobileNetV2 with Google Vision API.

---

## 🔬 Validation History

### Phase 1 — Repository Cleanup Validation
- **Status**: Passed `[✓]` (2026-05-30)
- **Validation Scope**: Local server execution, dependency resolution, and API route responses.
- **Results**: The active codebase compiles successfully, dependencies are fully installed, and local server execution is verified.
