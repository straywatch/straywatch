-- Migration: Create statistics view
-- Created: 2024-12-03
-- Description: View for aggregated report statistics

-- Create view for report statistics
CREATE OR REPLACE VIEW report_stats AS
SELECT
  type,
  COUNT(*) as total_count,
  SUM(count) as total_items,
  COUNT(DISTINCT user_id) as unique_reporters,
  MIN(created_at) as first_report,
  MAX(created_at) as latest_report
FROM reports
GROUP BY type;

-- Create view for daily report trends
CREATE OR REPLACE VIEW daily_report_trends AS
SELECT
  DATE(created_at) as report_date,
  type,
  COUNT(*) as report_count,
  SUM(count) as item_count
FROM reports
GROUP BY DATE(created_at), type
ORDER BY report_date DESC;

-- Create view for severity distribution
CREATE OR REPLACE VIEW severity_distribution AS
SELECT
  type,
  severity,
  COUNT(*) as count
FROM reports
WHERE severity IS NOT NULL
GROUP BY type, severity
ORDER BY type, severity;
