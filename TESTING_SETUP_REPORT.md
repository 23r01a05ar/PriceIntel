# TESTING & SETUP REPORT
*First-Time Setup Guide for PriceIntel v2.0*

---

### 1. Supabase Setup

**Project Creation:**
1. Go to [Supabase](https://supabase.com/) and create a new project.
2. Navigate to **SQL Editor** in the dashboard.
3. Open and run the migration file from your repository: `supabase/migrations/20260531000000_init_schema.sql` to generate all required tables and RLS policies.

**Authentication Settings:**
1. Navigate to **Authentication > Providers**.
2. Enable **Email/Password** (Disable "Confirm email" for initial local testing, or keep it enabled to test the full flow).
3. Enable **Google** (Configure OAuth Client ID and Secret if testing Google login).
4. Under **URL Configuration**, set the Site URL to `http://localhost:3000`.

---

### 2. Storage Configuration

**Bucket Creation:**
1. Navigate to **Storage** in the Supabase dashboard.
2. Click **New Bucket**.
3. **Exact Bucket Name:** `product-images`
4. **Public/Private:** Set to **Public**.
5. **Bucket Policies:** The migration script (`20260531000000_init_schema.sql`) automatically provisions the required RLS policies allowing authenticated users to upload and anyone to read. Ensure these policies appear under the bucket configuration.

---

### 3. RapidAPI Setup

**Folder Location:**
All API snippets must be pasted into the following exact path:
`frontend/src/config/rapidapi/snippets/`

**Snippet Format:**
Copy the exact **Node.js (fetch)** snippet directly from RapidAPI. Do not modify or extract environment variables from it.

**Example Snippet (`amazon-1.txt`):**
```javascript
const url = 'https://real-time-amazon-data.p.rapidapi.com/search?query=YOUR_QUERY';
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': 'ACTUAL_KEY',
		'x-rapidapi-host': 'real-time-amazon-data.p.rapidapi.com'
	}
};

try {
	const response = await fetch(url, options);
	const result = await response.text();
	console.log(result);
} catch (error) {
	console.error(error);
}
```

**Validation Commands:**
After adding a new `.txt` snippet, run:
```bash
npm run validate-snippets
npm run audit-providers
```
This automatically extracts your keys, runs heuristic mappings, and updates `generatedProviders.ts`.

---

### 4. Environment Variables

Create a `frontend/.env.local` file. It should contain **only** these variables:

| Variable Name | Purpose | Example Value |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Routes frontend requests to your Supabase project. | `https://xyz.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public key for Supabase Auth and Storage. | `eyJhbGciOiJIUzI1Ni...` |

*(Note: RapidAPI keys are inherently extracted from your snippets. Do NOT add them here).*

---

### 5. Local Development Commands

Run these inside the `frontend/` directory:

| Action | Command |
| --- | --- |
| **Install Dependencies** | `npm install` |
| **Generate Providers** | `npm run validate-snippets` |
| **Run Validations** | `npm run audit-providers` |
| **Security Checks** | `npm run security-audit` |
| **Run Development Server** | `npm run dev` |
| **Build Production Version** | `npm run build` |

---

### 6. Expected Working Pages

The following pages will render and route successfully immediately after setup:
- `/` (Landing Page)
- `/search` (Text & Image Search Interface)
- `/login` (Authentication Interface)
- `/signup` (Authentication Interface)
- `/dashboard` (User Dashboard)
- `/profile` (User Settings)
- `/wishlist` (Saved Products)
- `/history` (Recent Searches)
- `/alerts` (Price Drop Alerts)
- `/product/[slug]` (Product Details View)

---

### 7. Features Requiring Configurations

**Depends on Supabase Auth:**
- Logging in/Signing up
- Accessing `/dashboard`, `/profile`, `/wishlist`, `/alerts`, `/history`

**Depends on Supabase Storage:**
- Uploading images for Visual Search via Google Lens.

**Depends on RapidAPI Providers:**
- **Text Search:** Requires Amazon, Walmart, or Flipkart snippets.
- **Visual Search:** Requires Google Lens snippet.
- **Price History:** Requires Amazon/Walmart snippets.

---

### 8. End-to-End Testing Checklist

1. [ ] **Signup:** Create a new account at `/signup`. *(Expected: Success message or redirection).*
2. [ ] **Email Verification:** Click link in email (if enabled). *(Expected: Redirects to login).*
3. [ ] **Login:** Sign in at `/login`. *(Expected: Redirects to `/dashboard`).*
4. [ ] **Dashboard:** Navigate to `/dashboard`. *(Expected: Displays user stats and recent activity).*
5. [ ] **Profile:** Navigate to `/profile`. *(Expected: Displays correct user email).*
6. [ ] **Text Search:** Go to `/search`, type "Laptop". *(Expected: RapidAPI fetches and displays ranked deals).*
7. [ ] **Wishlist:** Click "Heart" on a search result. Go to `/wishlist`. *(Expected: Product appears).*
8. [ ] **Alerts:** Add a target price alert for a wishlist item. Go to `/alerts`. *(Expected: Alert is listed).*
9. [ ] **History:** Go to `/history`. *(Expected: "Laptop" appears in recent searches).*
10. [ ] **Product Details:** Click on a search result. *(Expected: Routes to `/product/...` showing extended details and charts).*
11. [ ] **Image Search:** Go to `/search`, upload a photo. *(Expected: Uploads to Supabase, queries Google Lens, displays visually similar products).*
12. [ ] **Logout:** Click "Sign Out". *(Expected: Redirects to `/` and clears session).*

---

### 9. Known Limitations

- **Email Verification Flow:** Full redirect handling for email confirmations is pending completion in Phase 7.
- **Price Alerts:** Currently configured in the DB but lacks the background CRON job to auto-send emails.
- **RapidAPI Quotas:** If using the basic tier, visual searches (Google Lens) can rapidly exhaust the monthly free limit.
- **Fallback Mappings:** Certain obscure item structures might trigger a `requires_review: true` mapping stub.

---

### 10. Production Readiness Verification

Before deployment, verify the following commands succeed in the `frontend` directory:

- [x] `npm run build` (Passes with 0 errors)
- [x] `npm run lint` (Passes with 0 warnings)
- [x] `npx tsc --noEmit` (Passes with 0 type errors)
- [x] `npm run validate-snippets` (Extracts keys seamlessly)
- [x] `npm run audit-providers` (Passes registry integrity check)
- [x] `npm run security-audit` (Passes with 0 exposed secrets)
- [x] **Deployment Readiness:** Ready for Vercel deployment.
