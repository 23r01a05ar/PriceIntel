# 02 — Tech Debt Report

**Project:** Online Product Price Intelligence System  
**Severity Levels:** CRITICAL | HIGH | MEDIUM | LOW

---

## CRITICAL Debt

### TD-001 — API Keys Hardcoded in Source Code
**File:** `backend/config.py`, `backend/serpapi_fetch.py`  
**Risk:** Credential exposure, financial damage if keys stolen  
**Fix:** Move all keys to `.env`, use `python-dotenv`. Rotate exposed keys immediately.

```python
# CURRENT — DANGEROUS
AMAZON_KEY = "fb2b92412cmsh8e4041d5e17a96fp190184jsn15f3f7612335"

# TARGET
AMAZON_KEY = os.getenv("RAPIDAPI_KEY")
```

### TD-002 — SQLite Database Committed to Repository
**File:** `backend/price_intelligence.db`  
**Risk:** User PII (emails, usernames) exposed in public repo  
**Fix:** Add to `.gitignore`, delete from git history with `git filter-branch` or BFG

### TD-003 — User Image Uploads Committed to Repository
**File:** `backend/uploads/` (40+ files)  
**Risk:** Privacy violation, repo bloat  
**Fix:** Add `uploads/` to `.gitignore`, remove from history, migrate to Supabase Storage

### TD-004 — No Authentication Tokens
**File:** `backend/app.py`, all frontend components  
**Risk:** Any user can call any API endpoint with any `user_id` param. No session validation.  
**Fix:** Implement JWT (PyJWT) or migrate to Supabase Auth

### TD-005 — Google OAuth CLIENT_ID is Placeholder
**File:** `backend/app.py` line 34, `frontend/src/App.js` line 42  
**Risk:** OAuth completely non-functional in current state  
**Fix:** Configure real CLIENT_ID via environment variable

---

## HIGH Debt

### TD-006 — Duplicate Database Schema Conflict
**Files:** `backend/database.py` vs `backend/db_models.py`  
**Problem:** Two completely separate ORM systems. `db_models.py` never used by the app but defines conflicting table structures.  
**Fix:** Remove `db_models.py` entirely. Migrate to Supabase.

### TD-007 — Broken Deal Score Algorithm
**File:** `backend/comparison_engine.py`  
```python
# BROKEN: $100 item → score = 100 - (100 * 0.01) + 30 = 129 → capped at 100
# BROKEN: $5000 item → score = 100 - (5000 * 0.01) + 30 = 80
# A $5000 Amazon item can outscore a $10 Walmart item
score = 100 - (price * 0.01)
```
**Fix:** Use percentile-based scoring relative to result set

### TD-008 — Frontend API URLs Hardcoded to localhost
**Files:** All frontend components  
```javascript
// Found in: ComparePage.js, Login.js, Signup.js, History.js, Wishlist.js, Profile.js
fetch("http://127.0.0.1:5000/api/...")
```
**Count:** 15+ hardcoded localhost URLs  
**Fix:** Single `REACT_APP_API_URL` env variable or migrate to Supabase

### TD-009 — Bare `except:` Blocks
**File:** `backend/product_search.py` (3x), `backend/scrapers/amazon_scraper.py` (2x)  
**Problem:** Silently swallows all errors including keyboard interrupts  
**Fix:** Catch specific exceptions, log errors properly

### TD-010 — Missing requirements.txt Entries
**File:** `backend/requirements.txt`  
**Current:**
```
flask
flask-cors
tensorflow
numpy
pillow
python-dotenv
```
**Missing:** `flask-sqlalchemy`, `flask-caching`, `google-auth`, `google-auth-oauthlib`, `werkzeug`, `requests`, `beautifulsoup4`, `scikit-learn`, `opencv-python-headless`, `PyJWT`

### TD-011 — Price Alert System Non-Functional
**File:** `backend/app.py` — `run_price_alert_check()`  
```python
# "Alert" just prints to console
print(f"!!! PRICE ALERT TRIGGERED for {alert.user_email} !!!")
```
**Fix:** Implement email via SendGrid/SMTP or Supabase Edge Functions

### TD-012 — No CORS Restriction
**File:** `backend/app.py`  
```python
CORS(app)  # Allows ALL origins
```
**Fix:** `CORS(app, origins=["https://yourdomain.com"])`

---

## MEDIUM Debt

### TD-013 — Duplicate Frontend Apps
**Files:** `frontend/frontend-app/` (complete CRA app inside frontend/)  
**Fix:** Delete `frontend/frontend-app/` entirely

### TD-014 — Dead HTML Prototype
**Files:** `frontend-html/index.html`, `frontend-html/script.js`  
**Fix:** Delete or archive

### TD-015 — Disconnected `app/` Refactor
**Files:** `backend/app/__init__.py`, `backend/app/routes/upload.py`  
**Problem:** Partial Blueprint refactor never connected to main app.py  
**Fix:** Either complete the refactor or remove; currently dead code

### TD-016 — Duplicate Image Preprocessing
**Files:** `backend/preprocessing.py` vs `backend/preprocessing/image_preprocessing.py`  
**Fix:** Keep one, delete other

### TD-017 — Scrapers Dead Code
**Files:** `backend/scrapers/amazon_scraper.py`, `backend/scrapers/ebay_scraper.py`  
**Problem:** Selenium scraper blocked by Amazon. RapidAPI replaced it but scrapers not removed.  
**Fix:** Remove scrapers. RapidAPI is the correct approach.

### TD-018 — Debug Files in Main Codebase
**Files:** `backend/ebay_test.py`, `backend/scraper_test.py`, `backend/upc_test.py`, `backend/temp_image.jpg`  
**Fix:** Delete all

### TD-019 — Node.js package.json in Python Backend
**File:** `backend/package.json`  
**Problem:** Single express/nodemon dependency in a Flask backend directory  
**Fix:** Delete

### TD-020 — MobileNetV2 Returns ImageNet Labels
**Problem:** `predict_product()` returns labels like "notebook_computer" from ImageNet. These are not shopping-friendly product names for store API queries.  
**Fix:** Post-process labels OR replace with Google Vision API / Gemini Vision for product-specific recognition

### TD-021 — No Input Validation
**Files:** All Flask routes  
**Problem:** No validation on request body fields (lengths, types, SQL injection via query strings)  
**Fix:** Use `marshmallow` or `pydantic` for request validation

### TD-022 — `app.py` is a God File
**File:** `backend/app.py` (13KB, 300+ lines, all routes + logic)  
**Fix:** Split into Flask Blueprints: auth, search, wishlist, alerts, profile

---

## LOW Debt

### TD-023 — No TypeScript in Frontend
**Problem:** React app is plain JS, no type safety  
**Fix:** Migrate to TypeScript (target stack requires it)

### TD-024 — `App.js` Root Level in `frontend-app/`
**File:** `frontend/frontend-app/App.js` (90 bytes, stub)  
**Fix:** Delete with entire `frontend-app/` folder

### TD-025 — No `.env.example` File
**Fix:** Create `.env.example` with all required variable names (no values)

### TD-026 — localStorage Auth Storage
**Problem:** User object in localStorage; no expiry, no token rotation  
**Fix:** JWT with httpOnly cookies or Supabase session management

### TD-027 — `price.store` field conflict
**File:** `database.py` Wishlist model uses `store = db.Column(String(50))`, but Price model uses `store_name`  
**Fix:** Standardize to `store_name` across all models

---

## Debt Summary

| Severity | Count | Must Fix Before |
|----------|-------|-----------------|
| CRITICAL | 5 | Immediate (before any public commit) |
| HIGH | 7 | Before PHASE 3 |
| MEDIUM | 9 | Before PHASE 5 |
| LOW | 5 | Before PHASE 8 |
