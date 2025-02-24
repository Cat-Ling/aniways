-- Create enum types for sync_status and provider
CREATE TYPE sync_status as ENUM ('SYNCING', 'COMPLETED', 'FAILED');
CREATE TYPE provider as ENUM ('ANILIST', 'MYANIMELIST');

-- Create sync_library table
CREATE TABLE sync_library
(
    id          VARCHAR(21) PRIMARY KEY DEFAULT generate_nanoid(),
    user_id     VARCHAR(21) NOT NULL,
    provider    provider    NOT NULL,
    sync_status sync_status NOT NULL    DEFAULT 'SYNCING',
    created_at  TIMESTAMP   NOT NULL    DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP   NOT NULL    DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Add foreign key constraints to library and history tables
ALTER TABLE library
    drop constraint library_user_id_fkey,
    add constraint library_user_id_fkey FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

-- Add foreign key constraints to history table
ALTER TABLE history
    drop constraint history_user_id_fkey,
    add constraint history_user_id_fkey FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;


-- Update user_tokens table to use provider enum type
DELETE FROM user_tokens;
ALTER TABLE user_tokens
    ALTER COLUMN provider TYPE provider USING provider::text::provider;
