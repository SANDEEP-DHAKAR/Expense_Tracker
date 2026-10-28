-- ==============================================================================
-- DATABASE SCHEMA: Expense Tracker Platform
-- Database Engine: MySQL 8.0+
-- Character Set: utf8mb4 / utf8mb4_0900_ai_ci
-- Created for: Complete Platform Ledger, Governance & Auth System
-- ==============================================================================

-- 1. DATABASE CREATION
CREATE DATABASE IF NOT EXISTS `expense_tracker`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;

USE `expense_tracker`;

-- Disable foreign key checks during schema creation / migration
SET FOREIGN_KEY_CHECKS = 0;

-- ==============================================================================
-- 2. TABLE: users
-- Core identity table storing user credentials, role hierarchy (user, admin),
-- and profile timestamps.
-- ==============================================================================
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL COMMENT 'Full name of user / admin',
    `email` VARCHAR(150) NOT NULL COMMENT 'Unique user email address',
    `password` VARCHAR(255) NOT NULL COMMENT 'Bcrypt-hashed password string',
    `role` VARCHAR(20) DEFAULT 'user' COMMENT 'Role hierarchy: user or admin',
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Registration timestamp',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
COMMENT='User master authentication & role management table';

-- ==============================================================================
-- 3. TABLE: categories
-- Multi-tier categories. `user_id` is NULL for platform default templates,
-- or linked to a specific user for custom user-created categories.
-- ==============================================================================
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `user_id` INT DEFAULT NULL COMMENT 'Owner user ID (NULL for global default categories)',
    `name` VARCHAR(100) NOT NULL COMMENT 'Category title (Food, Travel, Bills, etc.)',
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Category creation timestamp',
    PRIMARY KEY (`id`),
    KEY `idx_categories_user_id` (`user_id`),
    CONSTRAINT `fk_categories_user` FOREIGN KEY (`user_id`)
        REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
COMMENT='Expense categorisation system (standard + user custom)';

-- ==============================================================================
-- 4. TABLE: expenses
-- Core transactional financial ledger recording daily expenses, amounts,
-- notes, and categorisation links.
-- ==============================================================================
DROP TABLE IF EXISTS `expenses`;
CREATE TABLE `expenses` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `user_id` INT DEFAULT NULL COMMENT 'User who incurred the expense',
    `category_id` INT DEFAULT NULL COMMENT 'Associated category ID',
    `amount` DECIMAL(10,2) NOT NULL COMMENT 'Transaction amount in INR/currency',
    `description` TEXT COMMENT 'Detailed expense description or payee',
    `note` VARCHAR(255) DEFAULT NULL COMMENT 'Short memo or quick note',
    `expense_date` DATE NOT NULL COMMENT 'Date the transaction took place',
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Record timestamp',
    PRIMARY KEY (`id`),
    KEY `idx_expenses_user_id` (`user_id`),
    KEY `idx_expenses_category_id` (`category_id`),
    KEY `idx_expenses_date` (`expense_date`),
    CONSTRAINT `fk_expenses_user` FOREIGN KEY (`user_id`)
        REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_expenses_category` FOREIGN KEY (`category_id`)
        REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
COMMENT='Financial expense transaction ledger';

-- ==============================================================================
-- 5. TABLE: budgets
-- Monthly budget thresholds per user and per month (YYYY-MM).
-- Enforces UNIQUE(user_id, month) to prevent duplicate budgets in the same month.
-- ==============================================================================
DROP TABLE IF EXISTS `budgets`;
CREATE TABLE `budgets` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `user_id` INT NOT NULL COMMENT 'User ID owning the budget limit',
    `monthly_limit` DECIMAL(10,2) NOT NULL COMMENT 'Max expenditure ceiling for the month',
    `month` VARCHAR(7) NOT NULL COMMENT 'Target month in YYYY-MM format (e.g. 2026-10)',
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Budget set timestamp',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_budgets_user_month` (`user_id`, `month`),
    CONSTRAINT `fk_budgets_user` FOREIGN KEY (`user_id`)
        REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
COMMENT='Monthly expenditure limits and budget guard settings';

-- ==============================================================================
-- 6. TABLE: notifications
-- Real-time alert notifications for budget overspend warnings, system alerts,
-- and transactional updates.
-- ==============================================================================
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `user_id` INT NOT NULL COMMENT 'Target recipient user ID',
    `type` VARCHAR(50) DEFAULT NULL COMMENT 'Alert category: Budget Alert, System, etc.',
    `message` TEXT COMMENT 'Notification body text',
    `is_read` TINYINT(1) DEFAULT 0 COMMENT 'Read flag: 0 = unread, 1 = read',
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp sent',
    PRIMARY KEY (`id`),
    KEY `idx_notifications_user_id` (`user_id`),
    CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`)
        REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
COMMENT='User alerts and budget threshold notification ledger';

-- ==============================================================================
-- 7. TABLE: refresh_tokens
-- Persistent JWT session store supporting 90-day multi-device sessions,
-- single-use rotation, and instant revocation upon logout or password change.
-- ==============================================================================
DROP TABLE IF EXISTS `refresh_tokens`;
CREATE TABLE `refresh_tokens` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `user_id` INT NOT NULL COMMENT 'Session owner user ID',
    `token` TEXT NOT NULL COMMENT 'Cryptographic refresh token string',
    `expires_at` TIMESTAMP NOT NULL COMMENT 'Token expiration timestamp (90 days)',
    `revoked` TINYINT(1) DEFAULT 0 COMMENT 'Revocation flag: 0 = active, 1 = revoked',
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Session issued at',
    PRIMARY KEY (`id`),
    KEY `idx_refresh_tokens_user_id` (`user_id`),
    CONSTRAINT `fk_refresh_tokens_user` FOREIGN KEY (`user_id`)
        REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
COMMENT='Multi-device JWT refresh token session persistence store';

-- ==============================================================================
-- 8. TABLE: password_reset_tokens
-- Cryptographically random 1-hour password reset tokens sent via Gmail SMTP.
-- Single-use enforcement via `used` flag.
-- ==============================================================================
DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE `password_reset_tokens` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `user_id` INT NOT NULL COMMENT 'User requesting password reset',
    `token` VARCHAR(255) NOT NULL COMMENT 'Secure hex reset token string',
    `expires_at` DATETIME NOT NULL COMMENT 'Token validity ceiling (1 hour from issue)',
    `used` TINYINT(1) DEFAULT 0 COMMENT 'Consumed flag: 0 = active, 1 = already used',
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Token dispatch timestamp',
    PRIMARY KEY (`id`),
    KEY `idx_reset_tokens_token` (`token`),
    KEY `idx_reset_tokens_user_id` (`user_id`),
    CONSTRAINT `fk_password_reset_user` FOREIGN KEY (`user_id`)
        REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
COMMENT='Temporary 1-hour password recovery tokens';

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- ==============================================================================
-- 9. OPTIONAL SEED DATA (TEMPLATES)
-- Default categories and admin account
-- ==============================================================================

-- Example Super Admin Account (Password: Admin12345)
-- Hash generated using bcrypt salt 10
INSERT INTO `users` (`name`, `email`, `password`, `role`)
VALUES (
    'Admin Sandeep',
    'sandeep@gmail.com',
    '$2b$10$w8T9Vv8Fm0U3Xm6Z0L3z4OD2T2xZ7Fm1j6M3Q8H6K5Y4L2M1N0O1P',
    'admin'
) ON DUPLICATE KEY UPDATE `role` = 'admin';

-- ==============================================================================
-- END OF SCHEMA DEFINITION
-- ==============================================================================

