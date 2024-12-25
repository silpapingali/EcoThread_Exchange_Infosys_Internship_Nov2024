const mongoose = require("mongoose");

const proposalSchema = new mongoose.Schema({
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    proposedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    proposedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
});

const Proposal = mongoose.model("Proposal", proposalSchema);

module.exports = Proposal;