USE lost_found_db;

-- ==========================================================
-- TABLE : notifications
-- ==========================================================

DROP TABLE IF EXISTS notifications;

CREATE TABLE notifications (

    notification_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    notification_type_id BIGINT NOT NULL,

    sender_user_id BIGINT NULL,

    receiver_user_id BIGINT NOT NULL,

    item_id BIGINT NULL,

    claim_id BIGINT NULL,

    title VARCHAR(200) NOT NULL,

    message TEXT NOT NULL,

    is_read BOOLEAN DEFAULT FALSE,

    read_at TIMESTAMP NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notification_type
        FOREIGN KEY(notification_type_id)
        REFERENCES notification_types(notification_type_id),

    CONSTRAINT fk_notification_sender
        FOREIGN KEY(sender_user_id)
        REFERENCES users(user_id),

    CONSTRAINT fk_notification_receiver
        FOREIGN KEY(receiver_user_id)
        REFERENCES users(user_id)

) ENGINE=InnoDB;