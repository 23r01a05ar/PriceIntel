# 11 — Security Review

---

## CRITICAL Vulnerabilities (Fix Immediately)

### SEC-001: API Keys in Source Code
- **Location:** `backend/config.py`, `backend/serpapi_fetch.py`
- **Impact:** Attacker can exhaust your API quota, incur charges, or steal data
- **Fix:** Rotate keys NOW. Use `.env` + `python-dotenv`

### SEC-002: Database Committed to Repository
- **Location:** `backend/price_intelligence.db`
- **Impact:** User emails, usernames, wishlist data exposed publicly
- **Fix:** Remove from git history. Add to `.gitignore`.

### SEC-003: No Authentication on Protected Endpoints
- **Location:** All Flask routes
- **Impact:** Any caller can read/write any user's wishlist, history, profile by guessing `user_id`
- **Example:** `GET /api/wishlist/1` returns user #1's wishlist without any auth check
- **Fix:** Verify JWT token on every protected route; use Supabase RLS

### SEC-004: CORS Allows All Origins
- **Location:** `app.py` — `CORS(app)`
- **Impact:** Any website can make API calls on behalf of users
- **Fix:** `CORS(app, origins=["https://yourproductiondomain.com"])`

---

## HIGH Vulnerabilities

### SEC-005: User ID from Request Body (Not From Token)
- `/api/wishlist` takes `user_id` from POST body
- Attacker sends `{"user_id": 1, ...}` to add to admin's wishlist
- **Fix:** Get user identity from JWT only

### SEC-006: No Input Validation
- Product name passed directly to external APIs
- Long strings, special chars, injection attempts not blocked
- **Fix:** Validate + sanitize all inputs; max length on strings

### SEC-007: Google OAuth CLIENT_ID Placeholder
- `"YOUR_GOOGLE_CLIENT_ID"` means OAuth is non-functional
- If someone bypasses this in a fork, auth state is trivially spoofable
- **Fix:** Real CLIENT_ID in environment variable

### SEC-008: No Rate Limiting
- `/api/compare-prices` fetches from 3 external APIs per call
- No limit → attacker can exhaust RapidAPI quota in seconds
- **Fix:** Implement rate limiting (Vercel middleware or Upstash Redis)

---

## MEDIUM Issues

| Issue | Impact | Fix |
|-------|--------|-----|
| No HTTPS enforcement | Data interception | Vercel enforces HTTPS automatically |
| localStorage auth | XSS can steal session | httpOnly cookies or Supabase session |
| No Content Security Policy | XSS risk | Add `next.config.js` headers |
| Uploaded files served directly | Path traversal potential | Supabase Storage handles this |
| Bare `except:` blocks | Error details hidden from logs | Proper logging |

---

## Security Checklist for v2.0

- [ ] All secrets in `.env.local` only
- [ ] `.env` added to `.gitignore`
- [ ] API keys rotated after cleanup
- [ ] Supabase RLS enabled on all user tables
- [ ] JWT validated on every protected API route
- [ ] Input validation on all endpoints (Zod)
- [ ] Rate limiting on search + upload endpoints
- [ ] CORS restricted to production domain
- [ ] No user PII in logs
- [ ] SQL injection impossible (Supabase parameterized queries)
- [ ] File upload: type check + size limit (5MB max)
- [ ] HTTPS only (Vercel default)
