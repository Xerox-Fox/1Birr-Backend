const mysql = require('mysql2');

const dbconnection = mysql.createPool({
    user: "abugida",
    database: "1birrekub",
    host: "localhost",
    password: "abugida2024",
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