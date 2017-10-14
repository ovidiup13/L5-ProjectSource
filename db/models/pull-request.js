const mongoose = require("mongoose");
const Issue = require("./issue");

const PullRequestSchema = new mongoose.Schema({
    _id: String,
    bodyText: String,
    state: String,
    issues: [Issue.schema],
    mergeCommit: String,
    createdAt: Date,
    closedAt: Date
});

module.exports = {
    schema: PullRequestSchema,
    model: mongoose.model("PullRequest", PullRequestSchema)
};