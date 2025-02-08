CREATE EXTENSION IF NOT EXISTS "pgcrypto";

ALTER TABLE animes
    ALTER COLUMN id SET DEFAULT gen_random_uuid();
