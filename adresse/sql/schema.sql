CREATE TABLE IF NOT EXISTS `tracked_download` (
    `created_at` TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `first_name` TEXT NOT NULL,
    `last_name` TEXT NOT NULL,
    `email` TEXT NOT NULL,
    `company` TEXT,
    `token` TEXT NOT NULL,
    `used` INTEGER NOT NULL DEFAULT 0
);
