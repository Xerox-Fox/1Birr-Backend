// routes/lotteryRoute.js
const express = require('express');
const lotteryController = require('../lottery/lotteryController');

const router = express.Router();

// Route to buy tickets
router.post('/buy-ticket', lotteryController.buyTicket);

// Route to draw the winner
router.get('/select-winner', lotteryController.drawWinner);

// Route to randomly check if a user won
router.get('/check-winner', lotteryController.checkRandomWinner);

// Route to reset the lottery
router.get('/reset-lottery', lotteryController.resetLottery);

module.exports = router;
