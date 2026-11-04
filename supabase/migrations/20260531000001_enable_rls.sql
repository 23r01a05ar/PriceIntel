-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- =========================================================================
-- PROFILES POLICIES
-- =========================================================================
-- Anyone can view profiles, but users can only modify their own.
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE USING (auth.uid() = id);

-- =========================================================================
-- PRODUCTS & PRICES POLICIES
-- =========================================================================
-- Products and prices are globally readable. 
-- Mutations (inserts/updates) will be handled securely via backend Service Role key.
CREATE POLICY "Products are viewable by everyone" 
ON products FOR SELECT USING (true);

CREATE POLICY "Prices are viewable by everyone" 
ON prices FOR SELECT USING (true);

-- =========================================================================
-- SEARCH HISTORY POLICIES
-- =========================================================================
-- Users have exclusive access to their own search history.
CREATE POLICY "Users can view own search history" 
ON search_history FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own search history" 
ON search_history FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own search history" 
ON search_history FOR DELETE USING (auth.uid() = user_id);

-- =========================================================================
-- PRICE ALERTS POLICIES
-- =========================================================================
-- Users have exclusive access to their own price alerts.
CREATE POLICY "Users can view own price alerts" 
ON price_alerts FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own price alerts" 
ON price_alerts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own price alerts" 
ON price_alerts FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own price alerts" 
ON price_alerts FOR DELETE USING (auth.uid() = user_id);

-- =========================================================================
-- WISHLIST POLICIES
-- =========================================================================
-- Users have exclusive access to their own wishlist.
CREATE POLICY "Users can view own wishlist" 
ON wishlist FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wishlist" 
ON wishlist FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own wishlist" 
ON wishlist FOR DELETE USING (auth.uid() = user_id);
