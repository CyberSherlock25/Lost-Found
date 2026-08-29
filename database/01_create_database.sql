-- ============================================
-- LOST & FOUND PLATFORM
-- Database Creation Script
-- Author : Parth Mulye
-- ============================================

-- Safe setup: never drop an existing database.
-- This script is intended for initial setup and safe reuse.
CREATE DATABASE IF NOT EXISTS lost_found_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE lost_found_db;

-- Verify
SELECT DATABASE();