CREATE TABLE IF NOT EXISTS `tracked_download` (
    `created_at` TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `first_name` TEXT NOT NULL,
    `last_name` TEXT NOT NULL,
    `email` TEXT NOT NULL,
    `company` TEXT,
    `token` TEXT NOT NULL,
    `area` TEXT,
    `used` INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS `crowdsourcing` (
    `created_at` TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `operation` TEXT NOT NULL,
    `id` TEXT,
    `before` TEXT,
    `after` TEXT,
    `username` TEXT,
    `auth_provider` TEXT
);
