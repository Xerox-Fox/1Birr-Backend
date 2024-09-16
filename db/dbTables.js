const users = `
    CREATE TABLE IF NOT EXISTS \`users\` (
        \`userid\` INT AUTO_INCREMENT PRIMARY KEY,
        \`name\` VARCHAR(255) NOT NULL,
        \`email\` VARCHAR(255) NOT NULL UNIQUE,
        \`password\` VARCHAR(255) NOT NULL,
        \`bank\` INT NOT NULL,
        \`description\` TEXT NULL,
        \`phone\` VARCHAR(13),
        \`user_type\` ENUM('user', 'organization') NOT NULL, 
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

module.exports = { users };