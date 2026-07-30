USE lost_found_db;

-- ==========================================================
-- TABLE : claims
-- Description : Claim requests for lost/found items
-- ==========================================================

DROP TABLE IF EXISTS claims;

CREATE TABLE claims (

    claim_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    item_id BIGINT NOT NULL,

    claimant_user_id BIGINT NOT NULL,

    reviewed_by_user_id BIGINT NULL,

    proof_description TEXT NOT NULL,

    proof_document_url VARCHAR(500),

    claim_status ENUM(
        'PENDING',
        'UNDER_REVIEW',
        'APPROVED',
        'REJECTED',
        'COLLECTED'
    ) DEFAULT 'PENDING',

    reviewer_remarks TEXT,

    claimed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    reviewed_at TIMESTAMP NULL,

    CONSTRAINT fk_claim_item
        FOREIGN KEY(item_id)
        REFERENCES items(item_id),

    CONSTRAINT fk_claim_user
        FOREIGN KEY(claimant_user_id)
        REFERENCES users(user_id),

    CONSTRAINT fk_claim_reviewer
        FOREIGN KEY(reviewed_by_user_id)
        REFERENCES users(user_id)

) ENGINE=InnoDB;