# Lost & Found Platform Database Documentation

## Database Schema Overview
- **Database Name**: `lost_found_db`
- **Engine**: MySQL 8.x InnoDB
- **Charset**: `utf8mb4`

## Tables Summary

1. `roles`: Master table for user role access levels (ADMIN, STAFF, TEACHER, STUDENT).
2. `departments`: Academic departments (Computer Science, MCA, MBA, Electronics, Mechanical, Civil).
3. `users`: User profiles with BCrypt encrypted passwords, university IDs, and foreign keys to roles & departments.
4. `categories`: Item category lookups (Electronics, Mobile Phones, Wallet & Purses, ID Cards, Keys, Bags, etc.).
5. `locations`: Campus location lookups with building and floor details (Library, Computer Lab, Cafeteria, Auditorium, Hostels).
6. `item_types`: Item classification (`LOST`, `FOUND`).
7. `item_statuses`: Item workflow stages (`OPEN`, `UNDER_REVIEW`, `CLAIM_REQUESTED`, `CLAIM_APPROVED`, `CLAIM_REJECTED`, `COLLECTED`, `CLOSED`).
8. `claim_statuses`: Claim workflow stages (`PENDING`, `UNDER_REVIEW`, `APPROVED`, `REJECTED`, `COLLECTED`).
9. `notification_types`: System notification types (`ITEM_FOUND`, `CLAIM_SUBMITTED`, `CLAIM_APPROVED`, `CLAIM_REJECTED`, `NEW_ANNOUNCEMENT`).
10. `items`: Main table for lost and found items with verified flags, condition, brand, color, serial number, and foreign keys.
11. `item_images`: Multiple image URLs per item with primary image flag.
12. `claims`: Ownership claims submitted by students with proof descriptions, proof document URLs, and review notes.
13. `notifications`: In-app notification queue for users.
14. `announcements`: University notice board postings with pinned status.
15. `audit_logs`: Audit trail recording user actions, IP addresses, HTTP methods, and failure reasons.
16. `refresh_tokens`: Persistent JWT refresh tokens with expiration and revocation flags.
17. `otp_requests`: Security OTP codes for password resets and verification.
