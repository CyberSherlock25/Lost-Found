USE lost_found_db;

-- ==========================================================
-- TABLE : locations
-- Description : University locations
-- ==========================================================

DROP TABLE IF EXISTS locations;

CREATE TABLE locations (

    location_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    location_name VARCHAR(100) NOT NULL UNIQUE,

    description VARCHAR(255),

    building VARCHAR(100),

    floor_no VARCHAR(20),

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP

) ENGINE=InnoDB;

-- ==========================================================
-- Default Campus Locations
-- ==========================================================

INSERT INTO locations
(location_name,description,building,floor_no)
VALUES

('Library','Central Library','Library Building','Ground'),

('Computer Lab','Programming Lab','IT Block','First'),

('Cafeteria','Food Court','Main Building','Ground'),

('Auditorium','Main Auditorium','Main Building','Ground'),

('Parking','Student Parking','Parking Area','Ground'),

('Sports Ground','Outdoor Sports','Sports Complex','Ground'),

('Hostel A','Boys Hostel','Hostel','Ground'),

('Hostel B','Girls Hostel','Hostel','Ground'),

('Admin Office','Administration','Admin Block','First'),

('Reception','Main Reception','Main Gate','Ground'),

('Classroom','Academic Classroom','Academic Block','Various'),

('Other','Other Campus Location',NULL,NULL);

-- ==========================================================
-- Verify
-- ==========================================================

SELECT * FROM locations;