const mysql = require('mysql2');
require('dotenv').config();

const dbconnection = mysql.createPool({
    user: process.env.DB_USER,
    database: process.env.DB_DATA,
    host: process.env.DB_HOST,
    password: process.env.DB_PASS,
    connectionLimit: 10,
    port: 3308
})

// dbconnection.execute(`select  `, (err, result) => {
//     if (err) {
//         console.log(err.message)
//     } else {
//         console.log(result)
//     }
// })

module.exports = dbconnection.promise()