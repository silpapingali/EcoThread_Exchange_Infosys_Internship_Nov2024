const mongoose = require("mongoose");

const proposalSchema = new mongoose.Schema({
    proposedItemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    selectedItemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    proposedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    proposedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
    accepted: { type: Boolean, default: false },
    rejected: { type: Boolean, default: false },
});

const Proposal = mongoose.model("Proposal", proposalSchema);

module.exports = Proposal;