const express = require('express');
const router = express.Router();
const { User } = require('../models/user'); 
const Proposal = require('../models/proposal'); 
const sendEmail = require('../utils/sendEmail');

router.post('/', async (req, res) => {
    const { itemId, proposedBy, proposedTo } = req.body;

    try {
        const user = await User.findById(proposedTo);
        if (user) {
      
            const newProposal = new Proposal({
                itemId,
                proposedBy,
                proposedTo,
            });

   
            await newProposal.save();

            const message = `User with ID ${proposedBy} has proposed a trade for item ID ${itemId}.`;
            await sendEmail(user.email, "Trade Proposal", message);
        } else {
            return res.status(404).send({ message: "User not found." });
        }

        res.status(200).send({ message: "Proposal sent successfully." });
    } catch (error) {
        console.error("Error sending proposal:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;