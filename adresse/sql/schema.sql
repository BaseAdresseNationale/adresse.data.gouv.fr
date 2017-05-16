CREATE TABLE IF NOT EXISTS `crowdsourcing` (
    `created_at` TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `operation` TEXT NOT NULL,
    `id` TEXT,
    `before` TEXT,
    `after` TEXT,
    `username` TEXT,
    `auth_provider` TEXT,
    `user_display_name` TEXT,
    `comment` TEXT
);
