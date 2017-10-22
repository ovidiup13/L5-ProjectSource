const mongoose = require("mongoose");
const CommitSchema = require("./commit").schema;

const PullRequestSchema = new mongoose.Schema({
    _id: String,
    bodyText: String,
    state: String,
    issues: [Number], // ids of issues
    mergeCommit: CommitSchema,
    createdAt: Date,
    mergedAt: Date
});

module.exports = {
    schema: PullRequestSchema,
    model: mongoose.model("PullRequest", PullRequestSchema)
};