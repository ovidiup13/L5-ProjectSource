const mongoose = require("mongoose");

const PullRequestSchema = new mongoose.Schema({
    _id: String,
    bodyText: String,
    state: String,
    issues: [Number], // ids of issues
    mergeCommit: String,
    createdAt: Date,
    updatedAt: Date
});

module.exports = {
    schema: PullRequestSchema,
    model: mongoose.model("PullRequest", PullRequestSchema)
};