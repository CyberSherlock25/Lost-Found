USE lost_found_db;

-- =====================================================
-- TABLE : item_types
-- Description : Lost / Found
-- =====================================================

DROP TABLE IF EXISTS item_types;

CREATE TABLE item_types (

    type_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    type_name VARCHAR(30) NOT NULL UNIQUE,

    description VARCHAR(255),

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP

) ENGINE=InnoDB;

INSERT INTO item_types(type_name,description)
VALUES

('LOST','Item reported as lost'),

('FOUND','Item reported as found');

SELECT * FROM item_types;