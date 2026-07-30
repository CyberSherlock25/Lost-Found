USE lost_found_db;

-- ==========================================================
-- TABLE : item_images
-- Description : Stores multiple images for every item
-- ==========================================================

DROP TABLE IF EXISTS item_images;

CREATE TABLE item_images (

    image_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    item_id BIGINT NOT NULL,

    image_url VARCHAR(500) NOT NULL,

    image_name VARCHAR(255),

    image_type VARCHAR(50),

    image_size BIGINT,

    is_primary BOOLEAN DEFAULT FALSE,

    display_order INT DEFAULT 1,

    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_image_item
        FOREIGN KEY(item_id)
        REFERENCES items(item_id)
        ON DELETE CASCADE

) ENGINE=InnoDB;