USE lost_found_db;

-- ==========================================================
-- TABLE : categories
-- Description : Stores all item categories
-- ==========================================================

DROP TABLE IF EXISTS categories;

CREATE TABLE categories (

    category_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    category_name VARCHAR(100) NOT NULL UNIQUE,

    description VARCHAR(255),

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP

) ENGINE=InnoDB;

-- ==========================================================
-- Default Categories
-- ==========================================================

INSERT INTO categories (category_name, description) VALUES
('Electronics','Electronic gadgets'),
('Mobile Phones','Smartphones and Feature Phones'),
('Laptop','Laptops and Chargers'),
('Books','Academic and Personal Books'),
('Wallet','Wallets and Purses'),
('ID Card','University Identity Cards'),
('Keys','Vehicle and Room Keys'),
('Bags','Backpacks and Handbags'),
('Water Bottle','Bottles and Flasks'),
('Clothing','Jackets, Hoodies, Uniforms'),
('Accessories','Watch, Earbuds, Glasses'),
('Documents','Certificates and Papers'),
('Jewellery','Chains, Rings, Bracelets'),
('Sports Equipment','Sports Accessories'),
('Others','Miscellaneous Items');

-- ==========================================================
-- Verify
-- ==========================================================

SELECT * FROM categories;