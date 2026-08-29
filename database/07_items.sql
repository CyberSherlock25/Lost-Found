USE lost_found_db;

-- ==========================================================
-- TABLE : items
-- Description : Stores Lost and Found Items
-- ==========================================================

CREATE TABLE IF NOT EXISTS items (

    item_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    title VARCHAR(150) NOT NULL,

    description TEXT,

    category_id BIGINT NOT NULL,

    location_id BIGINT NOT NULL,

    type_id BIGINT NOT NULL,

    status_id BIGINT NOT NULL,

    uploaded_by_user_id BIGINT NOT NULL,

    claimed_by_user_id BIGINT NULL,

    verified_by_user_id BIGINT NULL,

    brand VARCHAR(100),

    color VARCHAR(50),

    serial_number VARCHAR(150),

    item_condition VARCHAR(50),

    date_lost DATE,

    date_found DATE,

    is_verified BOOLEAN DEFAULT FALSE,

    is_claimable BOOLEAN DEFAULT TRUE,

    is_active BOOLEAN DEFAULT TRUE,

    remarks VARCHAR(500),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_item_category
        FOREIGN KEY(category_id)
        REFERENCES categories(category_id),

    CONSTRAINT fk_item_location
        FOREIGN KEY(location_id)
        REFERENCES locations(location_id),

    CONSTRAINT fk_item_type
        FOREIGN KEY(type_id)
        REFERENCES item_types(type_id),

    CONSTRAINT fk_item_status
        FOREIGN KEY(status_id)
        REFERENCES item_statuses(status_id),

    CONSTRAINT fk_uploaded_user
        FOREIGN KEY(uploaded_by_user_id)
        REFERENCES users(user_id),

    CONSTRAINT fk_claimed_user
        FOREIGN KEY(claimed_by_user_id)
        REFERENCES users(user_id),

    CONSTRAINT fk_verified_user
        FOREIGN KEY(verified_by_user_id)
        REFERENCES users(user_id)

) ENGINE=InnoDB;