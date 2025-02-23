ALTER TABLE settings
    ADD COLUMN incognito_mode BOOLEAN NOT NULL DEFAULT FALSE,
    DROP COLUMN auto_update_mal;