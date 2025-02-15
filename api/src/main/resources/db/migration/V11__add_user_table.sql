-- Create a table to store users
CREATE TABLE users
(
    id              VARCHAR(21) PRIMARY KEY DEFAULT generate_nanoid(),
    username        VARCHAR(255) NOT NULL,
    email           VARCHAR(255) NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    profile_picture TEXT,
    created_at      TIMESTAMP               DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP               DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (username),
    UNIQUE (email)
);

-- Create a table to store user tokens
CREATE TABLE user_tokens
(
    id            VARCHAR(21) PRIMARY KEY DEFAULT generate_nanoid(),
    user_id       VARCHAR(21)  NOT NULL,
    token         TEXT         NOT NULL,
    refresh_token TEXT         NOT NULL,
    provider      VARCHAR(255) NOT NULL,
    expires_at    TIMESTAMP    NOT NULL,
    created_at    TIMESTAMP               DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Create a table to store sessions
CREATE TABLE sessions
(
    id         VARCHAR(21) PRIMARY KEY DEFAULT generate_nanoid(),
    user_id    VARCHAR(21) NOT NULL,
    created_at TIMESTAMP               DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP   NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

