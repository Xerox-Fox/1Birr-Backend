// controllers/lotteryController.js

class LotterySystem {
    constructor() {
      this.tickets = [];
      this.users = {};
      this.winnerTicket = null;
    }
  
    buyTicket(userName, numOfTickets) {
      if (!this.users[userName]) {
        this.users[userName] = [];
      }
  
      for (let i = 0; i < numOfTickets; i++) {
        let ticketNumber = this.generateTicketNumber();
        this.tickets.push(ticketNumber);
        this.users[userName].push(ticketNumber);
      }
      console.log(`Tickets after buying:`, this.tickets);
      console.log(`Users after buying:`, this.users);
    }
  
    generateTicketNumber() {
      return Math.floor(Math.random() * 1000000) + 1;
    }
  
    drawWinner() {
      if (this.tickets.length === 0) {
        return null;
      }
      
      let randomIndex = Math.floor(Math.random() * this.tickets.length);
      this.winnerTicket = this.tickets[randomIndex];
      console.log(`Winner ticket: ${this.winnerTicket}`);
      return this.winnerTicket;
    }
  
    // Picks a random user and checks if they are the winner
    checkRandomWinner() {
      const userNames = Object.keys(this.users);
      
      if (userNames.length === 0) {
        console.log('No users bought tickets yet.');
        return null;
      }
      
      if (!this.winnerTicket) {
        console.log('No winning ticket has been drawn yet.');
        return null;
      }
  
      // Pick a random user
      const randomUserIndex = Math.floor(Math.random() * userNames.length);
      const randomUser = userNames[randomUserIndex];
      
      console.log(`Randomly picked user: ${randomUser}`);
  
      // Check if the random user holds the winning ticket
      const isWinner = this.users[randomUser].includes(this.winnerTicket);
  
      return { userName: randomUser, isWinner };
    }
  
    resetLottery() {
      this.tickets = [];
      this.users = {};
      this.winnerTicket = null;
      console.log('Lottery reset');
    }
  }
  
  const lottery = new LotterySystem();
  
  module.exports = {
    buyTicket: (req, res) => {
      const { userName, numOfTickets } = req.body;
      if (!userName || !numOfTickets) {
        return res.status(400).send({ message: 'Invalid input' });
      }
  
      lottery.buyTicket(userName, numOfTickets);
      res.send({ message: `${userName} bought ${numOfTickets} tickets.` });
    },
  
    drawWinner: (req, res) => {
      const winner = lottery.drawWinner();
      if (winner) {
        res.send({ message: `The winning ticket is: ${winner}` });
      } else {
        res.status(400).send({ message: 'No tickets sold yet.' });
      }
    },
  
    checkRandomWinner: (req, res) => {
      const result = lottery.checkRandomWinner();
      if (result) {
        const { userName, isWinner } = result;
        if (isWinner) {
          res.send({ message: `Congratulations ${userName}, you won the winning ticket!` });
        } else {
          res.send({ message: `${userName} did not win this time.` });
        }
      } else {
        res.status(400).send({ message: 'No users or no winning ticket yet.' });
      }
    },
  
    resetLottery: (req, res) => {
      lottery.resetLottery();
      res.send({ message: 'Lottery has been reset.' });
    }
  };
  