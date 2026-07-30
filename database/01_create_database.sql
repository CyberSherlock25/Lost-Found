-- ============================================
-- LOST & FOUND PLATFORM
-- Database Creation Script
-- Author : Parth Mulye
-- ============================================

-- Drop database if it already exists
DROP DATABASE IF EXISTS lost_found_db;

-- Create database
CREATE DATABASE lost_found_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Select database
USE lost_found_db;

-- Verify
SELECT DATABASE();