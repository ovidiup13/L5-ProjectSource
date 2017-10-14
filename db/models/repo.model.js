const mongoose = require("../db");

const RepositorySchema = new mongoose.Schema({
    _id: String,
    name: String,
    owner: String,
    url: String,
    pullRequests: [{
        _id: String,
        bodyText: String,
        state: String,
        issues: [Number],
        mergeCommit: String,
        createdAt: Date,
        closedAt: Date
    }]
});

module.exports = mongoose.model("Repository", RepositorySchema);