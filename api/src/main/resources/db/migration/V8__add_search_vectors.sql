CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX animes_name_trgm_idx ON animes USING gin(name gin_trgm_ops);
CREATE INDEX animes_jname_trgm_idx ON animes USING gin(jname gin_trgm_ops);

ALTER TABLE animes ADD COLUMN search_vector TSVECTOR;
UPDATE animes SET search_vector = to_tsvector('english', name || ' ' || jname);
CREATE INDEX anime_search_idx ON animes USING gin(search_vector);

CREATE OR REPLACE FUNCTION animes_search_trigger() RETURNS TRIGGER AS $$ BEGIN
    new.search_vector := to_tsvector('english', new.name || ' ' || new.jname);
    RETURN new;
END $$ LANGUAGE plpgsql;

CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE
ON animes FOR EACH ROW EXECUTE FUNCTION animes_search_trigger();
