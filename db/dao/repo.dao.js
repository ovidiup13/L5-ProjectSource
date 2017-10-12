const monoose = require("mongoose");
const Repository = require("../models/repo.model");

module.exports = {
    createRepository: function (repo) {
        return Repository.create({
            name: repo.name,
            owner: repo.owner,
            url: repo.url
        });
    },

    getRepositories: function () {
        return Repository.find({});
    }
};