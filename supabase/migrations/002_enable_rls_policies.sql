-- Migration: Enable Row Level Security policies
-- Created: 2024-12-03
-- Description: Security policies for reports table

-- Enable Row Level Security
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to read all reports (public data)
CREATE POLICY "Allow public read access"
  ON reports
  FOR SELECT
  USING (true);

-- Policy: Only authenticated users can create reports
CREATE POLICY "Allow authenticated users to insert"
  ON reports
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Policy: Users can only update their own reports
CREATE POLICY "Allow users to update own reports"
  ON reports
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only delete their own reports
CREATE POLICY "Allow users to delete own reports"
  ON reports
  FOR DELETE
  USING (auth.uid() = user_id);
