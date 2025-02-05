/*
  # Add weekly schedule support for habits

  1. New Columns
    - `days_of_week` (text array) to store selected days for weekly habits
  
  2. Changes
    - Add column to habits table
    - Add validation check for days of week
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'habits' AND column_name = 'days_of_week'
  ) THEN
    ALTER TABLE habits 
    ADD COLUMN days_of_week text[] DEFAULT ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    -- Add check constraint for valid days
    ALTER TABLE habits
    ADD CONSTRAINT valid_days_of_week
    CHECK (
      days_of_week <@ ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    );
  END IF;
END $$;