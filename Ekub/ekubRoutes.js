const express = require('express');
const ekub = require('./ekubController');
const router = express.Router();

// Add a new member to the Ekub
router.post('/add-member', async (req, res) => {
    const { memberName, ekubId } = req.body; // Expecting ekubId in the request body
    if (!memberName || !ekubId) {
        return res.status(400).json({ msg: 'Please provide both a member name and Ekub ID.' });
    }

    try {
        const message = await ekub.addMember(memberName, ekubId); // Pass ekubId to addMember
        res.status(200).json({ msg: message });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// Run a round of Ekub
router.get('/:ekubId/run-round', async (req, res) => {
    const { ekubId } = req.params;
    
    try {
        const message = await ekub.runRound(ekubId); // Pass ekubId to runRound
        res.status(200).json({ msg: message });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// Get the status of Ekub
router.get('/ekub/:ekubId/status', async (req, res) => {
    const { ekubId } = req.params;
    
    try {
        const status = await ekub.getStatus(ekubId); // Pass ekubId to getStatus
        res.status(200).json({ status });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

module.exports = router;
