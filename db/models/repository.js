const mongoose = require("../db");
const IssueSchema = require("./issue").schema;
const PullRequestSchema = require("./pull-request").schema;

const RepositorySchema = new mongoose.Schema({
    _id: String,
    name: String,
    owner: String,
    url: String,
    issues: [IssueSchema],
    pullRequests: [PullRequestSchema]
});

module.exports = {
    schema: RepositorySchema,
    model: mongoose.model("Repository", RepositorySchema)
};