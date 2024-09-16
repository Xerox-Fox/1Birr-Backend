const db = require("../db/dbConfig")
const bcrypt = require('bcryptjs');
const { StatusCodes } = require('http-status-codes')
const { users } = require('../db/dbTables')

const jwt = require('jsonwebtoken');

async function register(req, res) {
    const { name, bank, description, email, password, usertype, phone } = req.body;
    if (!email || !password || !bank || !phone || !name || !usertype) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg:"please provide all required information" })
    }

    try{

        const [user] = await db.query(`select name,userid from ${users} where name = ? or email =?`, [name, email])
        if (user.length > 0){
            return res.status(StatusCodes.BAD_REQUEST).json({ msg: "user already registered" })
        }
        if (password.length <= 8) {
            return res.status(StatusCodes.BAD_REQUEST).json({ msg: "password must be at least 8 characters" })
        }

        // hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        await db.query(
            `INSERT INTO ${users} (name, bank, description, email, password, user_type, phone) VALUES (?,?,?,?,?,?,?)`, 
            [name, bank, description, email, hashedPassword, usertype, phone])
        return res.status(StatusCodes.CREATED).json({ msg: "user registered" })

    } catch (error) {
        console.log(error.message)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "something went wrong, try again later!" })
    }
}

async function login(req,res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: "please enter all required fields" });
    }

    try{
        const [user] = await db.query(`select name,userid,password from ${users} where email = ? `, [email])
        if (user.length==0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ msg: "invalid credentials" });
        } 
        // compare password
        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
            return res.status(StatusCodes.BAD_REQUEST).json({ msg: "invalid credentials" });
        }
        
        const username = user[0].name
        const userid = user[0].userid

        const token = jwt.sign({ username, userid }, "secret", { expiresIn: "1d" })
        const info = await db.query(`select name, bank, description, email, password, user_type, phone from ${users} where email = ?`, [email])
        return res.status(StatusCodes.OK).json({ msg: "user login successful", token, info })

    } catch (error) {
        console.log(error.message)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "something went wrong, try again later!" })
    }
}

async function logout(req,res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: "please enter all required fields" });
    }

    try{

        const [user] = await db.query("select username,userid,password from users where email = ? ", [email])
        if (user.length==0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ msg: "invalid credentials" });
        } 
        // compare password
        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
            return res.status(StatusCodes.BAD_REQUEST).json({ msg: "invalid credentials" });
        }
        
        const username = user[0].username
        const userid = user[0].userid

        const token = jwt.sign({ username, userid }, "secret", { expiresIn: "1d" })
        await db.query("DELETE FROM users WHERE userid = ?", [userid]);0

        return res.status(StatusCodes.OK).json({ msg: "user logedout successfully", token })

    } catch (error) {
        console.log(error.message)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "something went wrong, try again later!" })
    }
}

async function checkUser(req,res) {
    const username = req.user.username
    const userid = req.user.userid

    res.status(StatusCodes.OK).json({ msg: "valid user",username,userid })
    
}

module.exports = { register, login, logout, checkUser }