CREATE TABLE reset_passwords
(
    token      VARCHAR(21) PRIMARY KEY DEFAULT generate_nanoid(),
    user_id    VARCHAR(21) NOT NULL,
    expires_at TIMESTAMP   NOT NULL,
    created_at TIMESTAMP   NOT NULL    DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);