DELETE
FROM settings;

ALTER TABLE settings
    ADD COLUMN new_user_id VARCHAR(21) NOT NULL DEFAULT generate_nanoid()
    REFERENCES users(id)
    ON DELETE CASCADE;

ALTER TABLE settings
    DROP CONSTRAINT settings_pkey;

ALTER TABLE settings
    DROP COLUMN user_id;

ALTER TABLE settings
    RENAME COLUMN new_user_id TO user_id;

ALTER TABLE settings
    ADD PRIMARY KEY (user_id);