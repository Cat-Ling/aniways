CREATE TABLE animes
(
    id           UUID PRIMARY KEY,
    name         VARCHAR   NOT NULL,
    jname        VARCHAR   NOT NULL,
    description  TEXT      NOT NULL,
    poster       VARCHAR   NOT NULL,
    hi_anime_id  VARCHAR   NOT NULL,
    mal_id       INT,
    anilist_id   INT,
    last_episode INT,
    created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_hi_anime_id UNIQUE (hi_anime_id),
    CONSTRAINT unique_mal_id UNIQUE (mal_id)
);

CREATE TABLE anime_metadata
(
    mal_id          INT PRIMARY KEY,
    main_picture    VARCHAR   NOT NULL,
    media_type      VARCHAR   NOT NULL,
    rating          VARCHAR,
    avg_ep_duration INT,
    airing_status   VARCHAR   NOT NULL,
    total_episodes  INT,
    studio          VARCHAR,
    rank            INT,
    mean            INT,
    scoring_users   INT       NOT NULL,
    popularity      INT,
    airing_start    VARCHAR,
    airing_end      VARCHAR,
    source          VARCHAR,
    trailer         VARCHAR,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_anime FOREIGN KEY (mal_id)
        REFERENCES animes (mal_id)
        ON DELETE CASCADE
);
