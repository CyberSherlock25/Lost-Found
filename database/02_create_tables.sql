USE lost_found_db;

-- ============================================
-- TABLE: roles
-- Stores all user roles
-- ============================================

CREATE TABLE IF NOT EXISTS roles (
    role_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    role_name VARCHAR(30) NOT NULL UNIQUE,

    description VARCHAR(255),

    Get-ChildItem "C:\Program Files" -Recurse -Filter java.exe -ErrorAction SilentlyContinue    Get-ChildItem "C:\Program Files" -Recurse -Filter java.exe -ErrorAction SilentlyContinue    Get-ChildItem "C:\Program Files" -Recurse -Filter java.exe -ErrorAction SilentlyContinue    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE: departments
-- ============================================

CREATE TABLE IF NOT EXISTS departments (

    department_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    department_name VARCHAR(100) NOT NULL UNIQUE,

    description VARCHAR(255),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

INSERT IGNORE INTO departments (department_name, description)
VALUES
('MCA', 'Master of Computer Applications'),
('MBA', 'Master of Business Administration'),
('BCA', 'Bachelor of Computer Applications'),
('Computer Science', 'Computer Science Department'),
('Mechanical', 'Mechanical Engineering'),
('Civil', 'Civil Engineering'),
('Electronics', 'Electronics Engineering');

-- ============================================
-- TABLE: users
-- ============================================

CREATE TABLE IF NOT EXISTS users (

    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    first_name VARCHAR(50) NOT NULL,

    last_name VARCHAR(50) NOT NULL,

    email VARCHAR(120) NOT NULL UNIQUE,

    password VARCHAR(255) NOT NULL,

    phone VARCHAR(15) UNIQUE,

    university_id VARCHAR(30) NOT NULL UNIQUE,

    profile_image VARCHAR(500),

    is_active BOOLEAN DEFAULT TRUE,

    role_id BIGINT NOT NULL,

    department_id BIGINT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_role
        FOREIGN KEY(role_id)
        REFERENCES roles(role_id),

    CONSTRAINT fk_user_department
        FOREIGN KEY(department_id)
        REFERENCES departments(department_id)

);