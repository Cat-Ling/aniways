ALTER TABLE animes
    DROP COLUMN description;

ALTER TABLE anime_metadata
    ADD COLUMN description TEXT NOT NULL DEFAULT 'unknown';