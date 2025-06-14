CREATE TABLE IF NOT EXISTS users (
    chat_id BIGINT PRIMARY KEY,
    taiga_username TEXT NOT NULL,
    taiga_auth_token TEXT NOT NULL,
    is_registered BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_states (
    chat_id BIGINT PRIMARY KEY,
    state JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 