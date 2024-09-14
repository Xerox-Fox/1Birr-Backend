const express = require('express');
const router = express.Router()

// auth middleware
const authMiddleware = require('../middleware/authMiddleware')


// user controllers
const { register, login, logout, checkUser } = require('../controller/userController')

// register routes
router.post('/register', register)

// login user
router.post('/login', login)

// log out user
router.post('/logout', logout)

// check user
router.get('/check', authMiddleware,checkUser)

module.exports = router