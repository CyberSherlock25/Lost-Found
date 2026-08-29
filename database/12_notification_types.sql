USE lost_found_db;

-- ==========================================================
-- TABLE : notification_types
-- Description : Master Notification Types
-- ==========================================================

CREATE TABLE IF NOT EXISTS notification_types (

    notification_type_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    notification_name VARCHAR(100) NOT NULL UNIQUE,

    description VARCHAR(255),

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP

) ENGINE=InnoDB;

INSERT IGNORE INTO notification_types
(notification_name,description)
VALUES

('ITEM_FOUND','A matching item has been found'),
('ITEM_PENDING_VERIFICATION','A lost or found item requires approval'),

('CLAIM_SUBMITTED','A claim has been submitted'),

('CLAIM_APPROVED','Claim approved'),

('CLAIM_REJECTED','Claim rejected'),

('NEW_ANNOUNCEMENT','New announcement'),

('ACCOUNT_APPROVED','User account approved'),

('PASSWORD_CHANGED','Password changed'),

('PROFILE_UPDATED','Profile updated');