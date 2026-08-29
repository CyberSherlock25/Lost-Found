USE lost_found_db;

-- ==========================================================
-- TABLE : announcements
-- Description : University announcements visible to users
-- ==========================================================

CREATE TABLE IF NOT EXISTS announcements (

    announcement_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    title VARCHAR(200) NOT NULL,

    message TEXT NOT NULL,

    posted_by_user_id BIGINT NOT NULL,

    target_role_id BIGINT NULL,

    start_date DATE NOT NULL,

    end_date DATE NULL,

    is_pinned BOOLEAN DEFAULT FALSE,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_announcement_posted_by
        FOREIGN KEY(posted_by_user_id)
        REFERENCES users(user_id),

    CONSTRAINT fk_announcement_role
        FOREIGN KEY(target_role_id)
        REFERENCES roles(role_id)

) ENGINE=InnoDB;