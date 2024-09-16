const mysql = require('mysql2');
require('dotenv').config();

const dbconnection = mysql.createPool({
    user: process.env.DB_USER,
    database: process.env.DB_DATA,
    host: process.env.DB_HOST,
    password: process.env.DB_PASS,
    connectionLimit: 10,
    port: process.env.DB_PORT,
});

const users = `
  CREATE TABLE IF NOT EXISTS users (
    userid INT AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    bank INT NOT NULL,
    user_type ENUM('user', 'organization') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (userid)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

const lost = `
  CREATE TABLE IF NOT EXISTS lost_people (
    lostid INT AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    image_data LONGBLOB,
    date_lost DATE NOT NULL,
    bank INT NOT NULL,
    phone VARCHAR(100) NOT NULL,
    status ENUM('lost', 'found') NOT NULL,
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (lostid)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

const ekubs = `
  CREATE TABLE IF NOT EXISTS ekub_list (
    id INT AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    contribution_amount INT NOT NULL,
    PRIMARY KEY (id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

const ekubsMembers = `
  CREATE TABLE IF NOT EXISTS ekub_members (
    id INT AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    has_received_money TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ekub_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (ekub_id) REFERENCES ekub_list(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

dbconnection.query(users, (err, res) => {
    if (err) throw err;
    console.log("user table created");
  });
  dbconnection.query(lost, (err, res) => {
    if (err) throw err;
    console.log("questions table created");
  });
  dbconnection.query(ekubs, (err, res) => {
    if (err) throw err;
    console.log("answers table created");
  });
  dbconnection.query(ekubsMembers, (err, res) => {
    if (err) throw err;
    console.log("answers table created");
  });

module.exports = dbconnection.promise(); // Correct export