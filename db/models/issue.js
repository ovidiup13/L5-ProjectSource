const mongoose = require("mongoose");

const IssueSchema = new mongoose.Schema({
    _id: Number,
    bodyText: String,
    state: String,
    priority: String,
    estimate: Number,
    createdAt: Date,
    updatedAt: Date
});

module.exports = {
    schema: IssueSchema,
    model: mongoose.model("Issue", IssueSchema)
};