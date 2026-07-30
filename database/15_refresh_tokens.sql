USE lost_found_db;

-- ==========================================================
-- TABLE : refresh_tokens
-- Description : Stores JWT Refresh Tokens
-- ==========================================================

DROP TABLE IF EXISTS refresh_tokens;

CREATE TABLE refresh_tokens (

    refresh_token_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT NOT NULL,

    token VARCHAR(500) NOT NULL UNIQUE,

    expiry_date TIMESTAMP NOT NULL,

    device_name VARCHAR(100),

    device_type VARCHAR(50),

    ip_address VARCHAR(45),

    user_agent TEXT,

    is_revoked BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_refresh_user
        FOREIGN KEY(user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE

) ENGINE=InnoDB;