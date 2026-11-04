-- Migration: Add full_name and instagram_url to profiles, drop bio

ALTER TABLE profiles DROP COLUMN IF EXISTS bio;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name VARCHAR(150);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS instagram_url VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS facebook_url VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS twitter_handle VARCHAR(100);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS whatsapp_no VARCHAR(20);
