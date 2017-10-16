const NodeGit = require("nodegit");
const path = require("path");
const fs = require("fs");
const Promise = require("bluebird").Promise;

const tempPath = path.join(__dirname, "../tmp");

const repositories = require("../data/repos").repositories;

cloneRepositories(repositories, tempPath).then(() => {
    // process.exit();
}).catch(err => {
    console.error(err);
    process.exit();
});

/**
 * Clones all updated repositories in a folder path. If not specified, it will clone in the current directory.
 * @param {Array of repos with owner, name and url properties.} repos
 * @param {Path as a string.} path 
 */
function cloneRepositories(repos, clonePath) {

    // Creates a temp folder if not exists.
    if (!fs.existsSync(clonePath)) {
        fs.mkdirSync(clonePath);
    }

    return Promise.all(repos.map(repo => {
        const repoPath = path.join(clonePath, repo.name);

        // update repo if exists
        if (fs.existsSync(repoPath)) {
            return NodeGit.Repository.open(repoPath).then(r => {
                console.log(`${repo.owner}:${repo.name} - Cloned repo already exists. Path: ${r.path()}`);
                return updateRepository(r, repo);
            }).catch(err => {
                console.error(`${repo.owner}:${repo.name} - Not a valid repository at current path.`);
            });
        }

        // clone repo otherwise
        return cloneRepository(repo.url, repoPath)
            .then(r => {
                console.log(`${repo.owner}:${repo.name} - Successfully cloned.`);
                console.log(r.path());
            });
    }));
}

function updateRepository(repo, info) {
    console.log(`${info.owner}:${info.name} - Fetching all updates.`)
    return repo.fetchAll()
        .then(function () {
            console.log(`${info.owner}:${info.name} - Merging changes.`);
            return repo.mergeBranches("master", "origin/master");
        })
        .done(function () {
            console.log(`${info.owner}:${info.name} - Done!`);
        });
}

/**
 * Clone repository using NodeGit library.
 * @param {HTTPS url of repository.} url 
 * @param {Where to clone the repository.} path 
 */
function cloneRepository(url, path) {
    return NodeGit.Clone(url, path)
        .catch(err => {
            console.error(err);
        });
}