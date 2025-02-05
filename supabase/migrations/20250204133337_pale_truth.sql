/*
  # Add date column to habits table

  1. Changes
    - Add `date` column to `habits` table with default value of current date
    - Make the column required (NOT NULL)

  2. Notes
    - Uses safe migration pattern with IF NOT EXISTS check
    - Sets default value to current date for new habits
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'habits' AND column_name = 'date'
  ) THEN
    ALTER TABLE habits 
    ADD COLUMN date date NOT NULL DEFAULT CURRENT_DATE;
  END IF;
END $$;