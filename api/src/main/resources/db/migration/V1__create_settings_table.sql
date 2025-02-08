CREATE TABLE IF NOT EXISTS settings (
    user_id INTEGER PRIMARY KEY,
    auto_next_episode BOOLEAN NOT NULL DEFAULT true,
    auto_play_episode BOOLEAN NOT NULL DEFAULT true,
    auto_update_mal BOOLEAN NOT NULL DEFAULT false
);
