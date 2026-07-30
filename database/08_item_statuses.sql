USE lost_found_db;

-- =====================================================
-- TABLE : item_statuses
-- Description : Workflow of every item
-- =====================================================

DROP TABLE IF EXISTS item_statuses;

CREATE TABLE item_statuses (

    status_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    status_name VARCHAR(50) NOT NULL UNIQUE,

    description VARCHAR(255),

    display_order INT,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP

) ENGINE=InnoDB;

INSERT INTO item_statuses
(status_name,description,display_order)
VALUES

('OPEN','Item is available',1),

('UNDER_REVIEW','Verification Pending',2),

('CLAIM_REQUESTED','Claim Submitted',3),

('CLAIM_APPROVED','Claim Approved',4),

('CLAIM_REJECTED','Claim Rejected',5),

('COLLECTED','Collected Successfully',6),

('CLOSED','Item Closed',7);

SELECT * FROM item_statuses;