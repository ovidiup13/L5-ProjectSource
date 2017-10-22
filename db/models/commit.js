const mongoose = require("mongoose");

const CommitSchema = new mongoose.Schema({
    _id: String, //long SHA
    abbreviatedSha: String, //7 character SHA
    diff: {
        insertions: Number,
        deletions: Number,
        filesChanged: Number
    }
});

module.exports = {
    schema: CommitSchema,
    model: mongoose.model("Commit", CommitSchema)
}