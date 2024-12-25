const express = require('express');
const router = express.Router();
const Proposal = require('../models/proposal'); // Import the Proposal model

// GET all proposals
router.get('/', async (req, res) => {
    try {
        const proposals = await Proposal.find()
            .populate('itemId') // Populate to get item details
            .populate('proposedBy') // Populate to get user details
            .populate('proposedTo'); // Populate to get user details
        res.status(200).json(proposals);
    } catch (error) {
        console.error("Error fetching proposals:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;