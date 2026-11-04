# TASK_000 — MASTER TRACKER

**Project:** PriceIntel v2.0  
**Total Tasks:** 55  
**Status Legend:** `[ ]` TODO · `[→]` IN PROGRESS · `[✓]` DONE · `[!]` BLOCKED

---

## PHASE 0 — Emergency Cleanup (Do First, Unblocks Everything)

| Task | Title | Priority | Status |
|------|-------|----------|--------|
| TASK_001 | Rotate exposed API keys | CRITICAL | [✓] |
| TASK_002 | Remove secrets from git history | CRITICAL | [✓] |
| TASK_003 | Update .gitignore | CRITICAL | [✓] |
| TASK_004 | Remove committed DB + uploads from repo | CRITICAL | [✓] |

---

## PHASE 1 — Repository Cleanup

| Task | Title | Priority | Status |
|------|-------|----------|--------|
| TASK_005 | Delete dead Python files | HIGH | [✓] |
| TASK_006 | Delete duplicate frontend apps | HIGH | [✓] |
| TASK_007 | Create .env.example | HIGH | [✓] |
| TASK_008 | Fix requirements.txt | HIGH | [✓] |
| TASK_009 | Update README.md | MEDIUM | [✓] |

---

## PHASE 2 — Existing Project Improvements (Pre-Migration)

| Task | Title | Priority | Status |
|------|-------|----------|--------|
| TASK_010 | Fix deal score algorithm | HIGH | [✓] |
| TASK_011 | Add proper exception handling to product_search.py | HIGH | [✓] |
| TASK_012 | Fix CORS to allow specific origins | HIGH | [✓] |
| TASK_013 | Add input validation to Flask routes | HIGH | [✓] |
| TASK_014 | Make parallel API calls in compare endpoint | MEDIUM | [✓] |
| TASK_015 | Fix price alert email (currently console.log only) | MEDIUM | [✓] |

---

## PHASE 3 — Next.js Project Initialization

| Task | Title | Priority | Status |
|------|-------|----------|--------|
| TASK_016 | Initialize Next.js 14 + TypeScript + Tailwind | HIGH | [✓] |
| TASK_017 | Install and configure shadcn/ui | HIGH | [✓] |
| TASK_018 | Install Framer Motion, Recharts, Zustand, SWR | HIGH | [✓] |
| TASK_019 | Set up ESLint + Prettier + Husky | MEDIUM | [✓] |
| TASK_020 | Create folder structure (app/, components/, lib/, types/) | HIGH | [✓] |


| Task | Title | Priority | Status |
|------|-------|----------|--------|
| TASK_027 | Port product_search.py → lib/productSearch.ts | HIGH | [✓] |
| TASK_028 | Port comparison_engine.py → lib/comparisonEngine.ts (fix scoring) | HIGH | [✓] |
| TASK_029 | Build GET /api/search route | HIGH | [✓] |
| TASK_030 | Build POST /api/upload route + Google Vision integration | HIGH | [v] |
| TASK_031 | Build GET /api/price-history route | MEDIUM | [✓] |
| TASK_032 | Build GET+POST+DELETE /api/wishlist routes | HIGH | [✓] |
| TASK_033 | Build GET+POST+PATCH+DELETE /api/alerts routes | HIGH | [✓] |
| TASK_034 | Build GET+PATCH /api/profile routes | MEDIUM | [✓] |
| TASK_035 | Build GET+DELETE /api/history routes | MEDIUM | [✓] |
| TASK_036 | Add Zod validation to all API routes | HIGH | [✓] |
| TASK_037 | Add rate limiting middleware | MEDIUM | [✓] |

---

## PHASE 6 — Frontend: Next.js Pages + Components

| Task | Title | Priority | Status |
|------|-------|----------|--------|
| TASK_038 | Build shared Navbar + Footer | HIGH | [✓] |
| TASK_039 | Build Landing Page (/) | HIGH | [✓] |
| TASK_040 | Build Search Page (/search) — text search + results | HIGH | [✓] |
| TASK_041 | Build ImageUploadZone component | HIGH | [✓] |
| TASK_042 | Build PriceCard component | HIGH | [✓] |
| TASK_043 | Build PriceHistoryChart component (Recharts) | HIGH | [✓] |
| TASK_044 | Build Login + Signup pages (Supabase Auth) | HIGH | [✓] |
| TASK_045 | Build Wishlist page | HIGH | [✓] |
| TASK_046 | Build History page | MEDIUM | [✓] |
| TASK_047 | Build Price Alerts page | HIGH | [✓] |
| TASK_048 | Build Profile page | MEDIUM | [✓] |
| TASK_049 | Build Dashboard page | MEDIUM | [✓] |
| TASK_050 | Build Product Detail page (/product/[slug]) | MEDIUM | [✓] |
| TASK_051 | Implement dark/light theme toggle (Tailwind) | LOW | [✓] |
| TASK_052 | Responsive design audit + mobile fixes | HIGH | [✓] |

---

## PHASE 7 — Testing

| Task | Title | Priority | Status |
|------|-------|----------|--------|
| TASK_053 | Write unit tests for comparisonEngine.ts | HIGH | [ ] |
| TASK_054 | Write unit tests for productSearch.ts | HIGH | [ ] |
| TASK_055 | Write component tests for PriceCard, SearchBar | MEDIUM | [ ] |

---

## PHASE 8 — Deployment

| Task | Title | Priority | Status |
|------|-------|----------|--------|
| TASK_056 | Create vercel.json + GitHub Actions CI/CD | HIGH | [ ] |
| TASK_057 | Set all env vars in Vercel dashboard | CRITICAL | [ ] |
| TASK_058 | First production deploy + smoke test | CRITICAL | [ ] |
| TASK_059 | Update README with live demo link + badges | HIGH | [ ] |

---

## PHASE 9 — Production Readiness

| Task | Title | Priority | Status |
|------|-------|----------|--------|
| TASK_061 | Add Sentry error tracking | MEDIUM | [ ] |
| TASK_062 | Enable Vercel Analytics | LOW | [ ] |
| TASK_063 | Write final API documentation | MEDIUM | [ ] |
| TASK_064 | Portfolio + LinkedIn update with live project | HIGH | [ ] |

---

## Dependency Graph (Critical Path)

```
TASK_001-004 (Security)
    ↓
TASK_005-009 (Cleanup)
    ↓
TASK_016-020 (Next.js init)
    ↓
TASK_021-026 (Supabase) ← PARALLEL with TASK_027-028 (port logic)
    ↓
TASK_027-037 (API routes)
    ↓
TASK_038-052 (Frontend pages)
    ↓
TASK_053-055 (Tests)
    ↓
TASK_056-059 (Deploy)
    ↓
TASK_060-063 (Polish)
```

---

## Notes for Implementation Agents

1. **Work one task at a time.** Complete + mark done before starting next.
2. **Never skip dependencies.** See Dependency Graph above.
3. **Never modify files outside active task's scope.**
4. **TASK_001-004 are BLOCKERS.** Nothing else matters until secrets are secured.
5. **Approval required for:** database schema changes, auth provider changes, major folder restructures.
6. **After each task, update:** Status, Files Created, Files Modified, Files Removed, Next Task.

---

## 🔬 Validation Records

# TASK_000 — MASTER TRACKER

**Project:** PriceIntel v2.0  
**Total Tasks:** 55  
**Status Legend:** `[ ]` TODO · `[→]` IN PROGRESS · `[✓]` DONE · `[!]` BLOCKED

---

## PHASE 0 — Emergency Cleanup (Do First, Unblocks Everything)

| Task | Title | Priority | Status |
|------|-------|----------|--------|
| TASK_001 | Rotate exposed API keys | CRITICAL | [✓] |
| TASK_002 | Remove secrets from git history | CRITICAL | [✓] |
| TASK_003 | Update .gitignore | CRITICAL | [✓] |
| TASK_004 | Remove committed DB + uploads from repo | CRITICAL | [✓] |

---

## PHASE 1 — Repository Cleanup

| Task | Title | Priority | Status |
|------|-------|----------|--------|
| TASK_005 | Delete dead Python files | HIGH | [✓] |
| TASK_006 | Delete duplicate frontend apps | HIGH | [✓] |
| TASK_007 | Create .env.example | HIGH | [✓] |
| TASK_008 | Fix requirements.txt | HIGH | [✓] |
| TASK_009 | Update README.md | MEDIUM | [✓] |

---

## PHASE 2 — Existing Project Improvements (Pre-Migration)

| Task | Title | Priority | Status |
|------|-------|----------|--------|
| TASK_010 | Fix deal score algorithm | HIGH | [✓] |
| TASK_011 | Add proper exception handling to product_search.py | HIGH | [ ] |
| TASK_012 | Fix CORS to allow specific origins | HIGH | [ ] |
| TASK_013 | Add input validation to Flask routes | HIGH | [ ] |
| TASK_014 | Make parallel API calls in compare endpoint | MEDIUM | [ ] |
| TASK_015 | Fix price alert email (currently console.log only) | MEDIUM | [ ] |

---

## PHASE 3 — Next.js Project Initialization

| Task | Title | Priority | Status |
|------|-------|----------|--------|
| TASK_016 | Initialize Next.js 14 + TypeScript + Tailwind | HIGH | [ ] |
| TASK_017 | Install and configure shadcn/ui | HIGH | [ ] |
| TASK_018 | Install Framer Motion, Recharts, Zustand, SWR | HIGH | [ ] |
| TASK_019 | Set up ESLint + Prettier + Husky | MEDIUM | [ ] |
| TASK_020 | Create folder structure (app/, components/, lib/, types/) | HIGH | [ ] |


| Task | Title | Priority | Status |
|------|-------|----------|--------|
| TASK_027 | Port product_search.py → lib/productSearch.ts | HIGH | [ ] |
| TASK_028 | Port comparison_engine.py → lib/comparisonEngine.ts (fix scoring) | HIGH | [ ] |
| TASK_029 | Build GET /api/search route | HIGH | [ ] |
| TASK_030 | Build POST /api/upload route + Google Vision integration | HIGH | [ ] |
| TASK_031 | Build GET /api/price-history route | MEDIUM | [ ] |
| TASK_032 | Build GET+POST+DELETE /api/wishlist routes | HIGH | [ ] |
| TASK_033 | Build GET+POST+PATCH+DELETE /api/alerts routes | HIGH | [ ] |
| TASK_034 | Build GET+PATCH /api/profile routes | MEDIUM | [ ] |
| TASK_035 | Build GET+DELETE /api/history routes | MEDIUM | [ ] |
| TASK_036 | Add Zod validation to all API routes | HIGH | [ ] |
| TASK_037 | Add rate limiting middleware | MEDIUM | [ ] |

---

## PHASE 6 — Frontend: Next.js Pages + Components

| Task | Title | Priority | Status |
|------|-------|----------|--------|
| TASK_038 | Build shared Navbar + Footer | HIGH | [✓] |
| TASK_039 | Build Landing Page (/) | HIGH | [✓] |
| TASK_040 | Build Search Page (/search) — text search + results | HIGH | [✓] |
| TASK_041 | Build ImageUploadZone component | HIGH | [✓] |
| TASK_042 | Build PriceCard component | HIGH | [✓] |
| TASK_043 | Build PriceHistoryChart component (Recharts) | HIGH | [✓] |
| TASK_044 | Build Login + Signup pages (Supabase Auth) | HIGH | [✓] |
| TASK_045 | Build Wishlist page | HIGH | [✓] |
| TASK_046 | Build History page | MEDIUM | [✓] |
| TASK_047 | Build Price Alerts page | HIGH | [✓] |
| TASK_048 | Build Profile page | MEDIUM | [✓] |
| TASK_049 | Build Dashboard page | MEDIUM | [✓] |
| TASK_050 | Build Product Detail page (/product/[slug]) | MEDIUM | [✓] |
| TASK_051 | Implement dark/light theme toggle (Tailwind) | LOW | [✓] |
| TASK_052 | Responsive design audit + mobile fixes | HIGH | [✓] |

---

## PHASE 7 — Testing

| Task | Title | Priority | Status |
|------|-------|----------|--------|
| TASK_053 | Write unit tests for comparisonEngine.ts | HIGH | [✓] |
| TASK_054 | Write unit tests for productSearch.ts | HIGH | [✓] |
| TASK_055 | Eliminate legacy SQLite databases | HIGH | [✓] |
| TASK_056 | Configure generic RapidAPI Engine | HIGH | [✓] |
| TASK_057 | Implement Zero-Config RapidAPI Snippet Parser and Registry Generation | HIGH | [✓] |
| TASK_058 | Pre-Phase 7 Final Security Audit and Repository Cleanup | HIGH | [✓] |

---

## PHASE 8 — Deployment

| Task | Title | Priority | Status |
|------|-------|----------|--------|
| TASK_059 | Create vercel.json + GitHub Actions CI/CD | HIGH | [ ] |
| TASK_060 | Set all env vars in Vercel dashboard | CRITICAL | [ ] |
| TASK_061 | First production deploy + smoke test | CRITICAL | [ ] |
| TASK_062 | Update README with live demo link + badges | HIGH | [ ] |

---

## PHASE 9 — Production Readiness

| Task | Title | Priority | Status |
|------|-------|----------|--------|
| TASK_063 | Add Sentry error tracking | MEDIUM | [ ] |
| TASK_064 | Enable Vercel Analytics | LOW | [ ] |
| TASK_065 | Write final API documentation | MEDIUM | [ ] |
| TASK_066 | Portfolio + LinkedIn update with live project | HIGH | [ ] |

---

## Dependency Graph (Critical Path)

```
TASK_001-004 (Security)
    ↓
TASK_005-009 (Cleanup)
    ↓
TASK_016-020 (Next.js init)
    ↓
TASK_021-026 (Supabase) ← PARALLEL with TASK_027-028 (port logic)
    ↓
TASK_027-037 (API routes)
    ↓
TASK_038-052 (Frontend pages)
    ↓
TASK_053-055 (Tests)
    ↓
TASK_056-059 (Deploy)
    ↓
TASK_060-063 (Polish)
```

---

## Notes for Implementation Agents

1. **Work one task at a time.** Complete + mark done before starting next.
2. **Never skip dependencies.** See Dependency Graph above.
3. **Never modify files outside active task's scope.**
4. **TASK_001-004 are BLOCKERS.** Nothing else matters until secrets are secured.
5. **Approval required for:** database schema changes, auth provider changes, major folder restructures.
6. **After each task, update:** Status, Files Created, Files Modified, Files Removed, Next Task.

---

## 🔬 Validation Records

- **Phase 1 Validation**: Passed `[✓]` (2026-05-30) — Verified successful local installation of all active Python dependencies and smooth execution of active Flask backend routines.


## RAPIDAPI GENERIC REGISTRY UPDATE

**Implementation Details:**
- **Provider Registry**: Built a `providers.ts` registry allowing completely generic RapidAPI setups without modifying code.
- **Priority Fallbacks**: The engine groups providers by `store` and sorts by `priority`. If an API throws an error (e.g. Rate Limit / Quota Exhausted), the generic engine seamlessly reroutes the request to the next available fallback provider for that store.
- **Dynamic Field Mapping**: APIs vary wildly in JSON structure. Providers now declare `responseMapping` with deep object paths, allowing seamless normalization to `ProductResult`.
- **Refactored Routes**: 
  - `/api/search` uses the generic `searchStoreWithFallback(store, query)` mapping over "Amazon", "Walmart", and "Flipkart".
  - `/api/upload` (Google Lens) was refactored to use `searchStoreWithFallback('VisualSearch', imageUrl)`.

**Documentation Added:**
- `frontend/API_SETUP.md` (Detailed provider guide)
- `frontend/QUICK_SETUP.md` (Snippet guide)
