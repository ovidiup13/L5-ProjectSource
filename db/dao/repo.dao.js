const monoose = require("mongoose");
const Repository = require("../models/repository").model;

module.exports = {
    createRepository: function (repo, issues, pullRequests) {
        return Repository.create({
            _id: `${repo.owner}:${repo.name}`,
            name: repo.name,
            owner: repo.owner,
            url: repo.url,
            issues: issues,
            pullRequests: pullRequests
        });
    },

    getRepositories: function () {
        return Repository.find({});
    },

    getRepository: function (name, owner) {
        return Repository.findOne({
            "_id": `${owner}:${name}`
        });
    },

    updateRepository: function (repo) {
        return repo.save();
    }
};