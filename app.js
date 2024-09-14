const express = require('express');
const app = express();
const port = 5500
const userRoutes = require("./routes/userRoute")
const lotteryRoutes = require("./lottery/lotteryRoute")
const ekubRoutes = require('./Ekub/ekubRoutes');
const lost = require('./lostpeople/lostRoute');

// db connection
const conn = require("./db/dbConfig")

// json middleware to extract json data
app.use(express.json())

// user routes middleware
app.use("/api/users", userRoutes)

// lottery middleware
app.use("/api/lottery", lotteryRoutes)

// ekub middleware
app.use('/api/ekub', ekubRoutes);

// lost people middleware
app.use('/api/lost', lost);

async function start() {
    try{
        const result = await conn.execute("select 'test' ")
        app.listen(port)
        console.log("database connection established")
        console.log(`listening on ${port}`)
    } catch (error) {
        console.log(error.message)
    }
}
start()

