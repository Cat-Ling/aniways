-- Create a function to generate NanoID (21 characters)
CREATE OR REPLACE FUNCTION generate_nanoid(length INT DEFAULT 21) RETURNS TEXT AS $$
DECLARE
alphabet TEXT := '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
    random_bytes BYTEA;
    random_value TEXT := '';
    i INT;
BEGIN
    -- Generate random bytes
    random_bytes := gen_random_bytes(length);
    -- Generate the NanoID
FOR i IN 1..length LOOP
        -- Get a value in the range of the alphabet length
        random_value := random_value || substr(alphabet, (get_byte(random_bytes, i - 1) % length) + 1, 1);
END LOOP;
RETURN random_value;
END;
$$ LANGUAGE plpgsql;

-- Add a new column to store the NanoID
ALTER TABLE animes ADD COLUMN nanoid VARCHAR(21) DEFAULT generate_nanoid() NOT NULL;

-- Set the NanoID as the primary key
ALTER TABLE animes DROP CONSTRAINT animes_pkey;
ALTER TABLE animes ADD PRIMARY KEY (nanoid);

-- Drop the old ID column
ALTER TABLE animes DROP COLUMN id;

-- Rename the nanoid column to id
ALTER TABLE animes RENAME COLUMN nanoid TO id;
