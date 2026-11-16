-- =====================================================================
-- Announcements and Notices Module (Nicole's contribution)
-- Migration: adds ONE new table. It does not change or delete anything
-- that already exists.
--
-- HOW TO RUN (MySQL Workbench or terminal):
--   1. Select the database your app uses (see DB_NAME in your .env).
--      Example:  USE study_cafe;
--   2. Run this whole file.
--
-- Safe to run more than once (CREATE TABLE IF NOT EXISTS).
-- Depends on the existing `users` table (primary key: user_id).
-- =====================================================================

CREATE TABLE IF NOT EXISTS announcements (
    announcement_id INT AUTO_INCREMENT PRIMARY KEY,
    title           VARCHAR(150) NOT NULL,
    message         TEXT NOT NULL,
    category        ENUM('General Announcement','Event','Reminder','Promotion','Important Notice')
                    NOT NULL DEFAULT 'General Announcement',
    published_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at      DATETIME NULL,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,   -- FALSE = archived
    created_by      INT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    -- If a user account is deleted later, keep the announcement.
    CONSTRAINT fk_announcements_user
        FOREIGN KEY (created_by) REFERENCES users(user_id)
        ON DELETE SET NULL,
    CONSTRAINT chk_announcements_dates
        CHECK (expires_at IS NULL OR expires_at > published_at),
    INDEX idx_announcements_visibility (is_active, published_at, expires_at),
    INDEX idx_announcements_category (category),
    INDEX idx_announcements_created_by (created_by)
);
