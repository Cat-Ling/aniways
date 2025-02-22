CREATE TYPE library_status as ENUM ('PLANNING', 'WATCHING', 'COMPLETED', 'DROPPED', 'PAUSED');

CREATE TABLE library (
    id VARCHAR(21) PRIMARY KEY DEFAULT generate_nanoid(),
    anime_id VARCHAR(21) NOT NULL,
    user_id VARCHAR(21) NOT NULL,
    watched_episodes INT NOT NULL DEFAULT 0,
    status library_status NOT NULL DEFAULT 'PLANNING',
    rating INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (anime_id) REFERENCES animes(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE history(
    id VARCHAR(21) PRIMARY KEY DEFAULT generate_nanoid(),
    anime_id VARCHAR(21) NOT NULL,
    user_id VARCHAR(21) NOT NULL,
    watched_episodes INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (anime_id) REFERENCES animes(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
