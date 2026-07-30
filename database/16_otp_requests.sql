USE lost_found_db;

-- ==========================================================
-- TABLE : otp_requests
-- Description : Stores OTP requests for authentication
-- ==========================================================

DROP TABLE IF EXISTS otp_requests;

CREATE TABLE otp_requests (

    otp_request_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT NULL,

    email VARCHAR(120),

    phone VARCHAR(15),

    otp_code CHAR(6) NOT NULL,

    otp_type VARCHAR(50) NOT NULL,

    expires_at TIMESTAMP NOT NULL,

    verified_at TIMESTAMP NULL,

    attempt_count INT DEFAULT 0,

    max_attempts INT DEFAULT 5,

    is_verified BOOLEAN DEFAULT FALSE,

    is_expired BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_otp_user
        FOREIGN KEY(user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE

) ENGINE=InnoDB;