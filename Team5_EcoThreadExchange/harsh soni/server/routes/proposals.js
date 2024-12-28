const express = require('express');
const router = express.Router();
const Proposal = require('../models/proposal'); 


router.post('/accept', async (req, res) => {
    const { proposalId, acceptedBy } = req.body;
    try {
        const proposal = await Proposal.findById(proposalId);
        if (!proposal) return res.status(404).send({ message: "Proposal not found." });

      
        proposal.accepted = true; 
        proposal.rejected = false; 
        await proposal.save();

        res.status(200).send({ message: "Proposal accepted successfully." });
    } catch (error) {
        console.error("Error accepting proposal:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});


router.post('/reject', async (req, res) => {
    const { proposalId, rejectedBy } = req.body;
    try {
        const proposal = await Proposal.findById(proposalId);
        if (!proposal) return res.status(404).send({ message: "Proposal not found." });

     
        proposal.rejected = true; 
        proposal.accepted = false; 
        await proposal.save();

        res.status(200).send({ message: "Proposal rejected successfully." });
    } catch (error) {
        console.error("Error rejecting proposal:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;