-- Migration: Add cheating detection to meetings table
-- This migration adds AI-powered cheating detection fields to the meetings table

-- Add cheating detection columns if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='meetings' AND column_name='cheating_detected') THEN
        ALTER TABLE meetings ADD COLUMN cheating_detected BOOLEAN DEFAULT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='meetings' AND column_name='cheating_explanation') THEN
        ALTER TABLE meetings ADD COLUMN cheating_explanation TEXT DEFAULT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='meetings' AND column_name='cheating_analyzed_at') THEN
        ALTER TABLE meetings ADD COLUMN cheating_analyzed_at TIMESTAMP DEFAULT NULL;
    END IF;
END $$;

-- Add comments for documentation
COMMENT ON COLUMN meetings.cheating_detected IS 'Boolean indicating if AI detected potential cheating behavior';
COMMENT ON COLUMN meetings.cheating_explanation IS 'AI-generated explanation of detected cheating behavior';
COMMENT ON COLUMN meetings.cheating_analyzed_at IS 'Timestamp when the video was analyzed for cheating';

-- Create index for faster queries on cheating detection
CREATE INDEX IF NOT EXISTS idx_meetings_cheating_detected ON meetings(cheating_detected) WHERE cheating_detected IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_meetings_cheating_analyzed_at ON meetings(cheating_analyzed_at) WHERE cheating_analyzed_at IS NOT NULL;
