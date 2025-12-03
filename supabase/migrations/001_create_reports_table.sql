-- Migration: Create reports table
-- Created: 2024-12-03
-- Description: Initial schema for StrayWatch reports

CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('sighting', 'bite', 'garbage')),
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  count INTEGER DEFAULT 1 NOT NULL,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high') OR severity IS NULL),
  notes TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create index for faster queries by type
CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(type);

-- Create index for faster queries by user
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);

-- Create index for faster queries by location (for potential geo queries)
CREATE INDEX IF NOT EXISTS idx_reports_location ON reports(lat, lng);

-- Create index for faster queries by date
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);

-- Add comment to table
COMMENT ON TABLE reports IS 'Stores community reports for stray dogs, bites, and garbage hotspots in Leh, Ladakh';
