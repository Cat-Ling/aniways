-- Force reset cache
DELETE FROM anime_metadata;

ALTER TABLE anime_metadata
    ADD COLUMN season      VARCHAR(255) DEFAULT NULL,
    ADD COLUMN season_year INTEGER      DEFAULT NULL;
