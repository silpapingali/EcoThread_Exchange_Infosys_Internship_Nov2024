const express = require('express');
const router = express.Router();
const Proposal = require('../models/proposal');

router.post('/accept', async (req, res) => {
    const { proposedItemId, selectedItemId, proposedBy, proposedTo } = req.body;
    try {
         const proposal = await Proposal.findOne({
            proposedItemId,
            selectedItemId,
            proposedBy,
            proposedTo
        });
        if (!proposal) {
            return res.status(404).send({ message: "Proposal not found." });
        }

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
    const { proposedItemId, selectedItemId, proposedBy, proposedTo } = req.body;
    try {
          const proposal = await Proposal.findOne({
            proposedItemId,
            selectedItemId,
            proposedBy,
            proposedTo
        });
        if (!proposal) {
            return res.status(404).send({ message: "Proposal not found." });
        }
        proposal.rejected = true;
        proposal.accepted = false;
        await proposal.save();

        res.status(200).send({ message: "Proposal rejected successfully." });
    } catch (error) {
        console.error("Error rejecting proposal:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Add this new route to fetch by trade ID
router.get('/trade/:tradeId', async (req, res) => {
    const { tradeId } = req.params;
    try {
       const proposal = await Proposal.findById(tradeId)
          .populate('proposedItemId') // Populate the proposed item
          .populate('selectedItemId') // Populate the selected item
          .populate('proposedBy')   // Populate the proposedBy user
          .populate('proposedTo');  // Populate the proposedTo user


      if (!proposal) {
        return res.status(404).send({ message: "Proposal not found." });
      }
        res.status(200).send(proposal);
    } catch (error) {
        console.error("Error fetching proposal by ID:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});



module.exports = router;