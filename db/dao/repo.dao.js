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
        return Repository.find({}).select('name owner url -_id');
    },

    getRepository: function (id) {
        return Repository.findOne({
            "_id": id
        }).select('name owner url');
    },

    updateRepository: function (repo) {
        return repo.save();
    },

    getPullRequests: function (id) {
        return Repository.findOne({
            "_id": id
        }).select("pullRequests -_id");
    },

    getIssues: function (id) {
        return Repository.findOne({
            "_id": id
        }).select("issues -_id");
    }
};