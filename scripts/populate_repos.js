const data = require("../data/repos");
const mongoose = require("../db/db");
const RepositoryDAO = require("../db/dao/repo.dao");
const Promise = require("bluebird").Promise;

function createRepositories(repos) {
    return Promise.all(repos.map(repo => {
        return RepositoryDAO.createRepository(repo);
    }));
}

createRepositories(data.repositories)
    .then(() => {
        console.log("All repositories successfully added to DB.");
        mongoose.disconnect();
        process.exit();
    })
    .catch(err => {
        console.error(err);
    })