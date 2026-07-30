USE lost_found_db;

-- ==========================================================
-- TABLE : claim_statuses
-- Description : Master table for claim workflow
-- ==========================================================

DROP TABLE IF EXISTS claim_statuses;

CREATE TABLE claim_statuses (

    claim_status_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    status_name VARCHAR(50) NOT NULL UNIQUE,

    description VARCHAR(255),

    display_order INT,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP

) ENGINE=InnoDB;

INSERT INTO claim_statuses
(status_name,description,display_order)
VALUES

('PENDING','Claim Submitted',1),

('UNDER_REVIEW','Claim Under Review',2),

('APPROVED','Claim Approved',3),

('REJECTED','Claim Rejected',4),

('COLLECTED','Item Collected',5);

SELECT * FROM claim_statuses;