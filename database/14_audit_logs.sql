USE lost_found_db;

-- ==========================================================
-- TABLE : audit_logs
-- Description : Stores user activities for auditing
-- ==========================================================

CREATE TABLE IF NOT EXISTS audit_logs (

    audit_log_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT NULL,

    action VARCHAR(100) NOT NULL,

    entity_name VARCHAR(100) NOT NULL,

    entity_id BIGINT NULL,

    description TEXT,

    request_method VARCHAR(10),

    request_url VARCHAR(255),

    ip_address VARCHAR(45),

    user_agent TEXT,

    device_type VARCHAR(50),

    browser_name VARCHAR(100),

    operating_system VARCHAR(100),

    action_status ENUM('SUCCESS','FAILED') DEFAULT 'SUCCESS',

    failure_reason VARCHAR(255),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_audit_user
        FOREIGN KEY(user_id)
        REFERENCES users(user_id)

) ENGINE=InnoDB;