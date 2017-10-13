const mongoose = require("../db");

const RepositorySchema = new mongoose.Schema({
    _id: String,
    name: String,
    owner: String,
    url: String
});

module.exports = mongoose.model("Repository", RepositorySchema);