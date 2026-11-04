-- Migration to add missing instagram_url to profiles table if it doesn't exist

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='profiles' AND column_name='instagram_url') THEN
        ALTER TABLE profiles ADD COLUMN instagram_url VARCHAR(255);
    END IF;
END $$;
