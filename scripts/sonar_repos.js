const NodeGit = require("nodegit");
const Repository = NodeGit.Repository;
const Commit = Repository.Commit;

const path = require("path");
const fs = require("fs");

const mongoose = require("../db/db");
const RepositoryDAO = require("../db/dao/repo.dao");
const SonarClient = require("./clients/sonar_client");

const srcFolder = "src";
const tempFolder = require("../constants").TEMP_FOLDER;

scanRepositories()
    .then(() => {
        console.log("Scan successful.");
        // process.exit();
    })
    .catch(err => {
        console.error(err);
    });

async function scanRepositories() {
    const repoMeta = await RepositoryDAO.getRepository("facebook:react");
    const prs = await RepositoryDAO.getPullRequests("facebook:react");

    const pullRequests = prs.pullRequests;
    pullRequests.sort(sortPRs);

    const repoPath = path.join(tempFolder, repoMeta.name);
    const repo = await Repository.open(repoPath);

    return checkoutCommits(repo, repoMeta, pullRequests);
}

async function checkoutCommits(repo, repoMeta, prs) {

    if (prs.length === 0) {
        return;
    }

    const repoPath = path.join(tempFolder, repoMeta.name);

    const pr = prs.shift();
    const options = {
        path: repoPath,
        srcPath: path.join(repoPath, srcFolder),
        commit: pr.mergeCommit,
        date: pr.mergedAt,
    };

    const checkoutOps = {
        checkoutNotify: NodeGit.Checkout.NOTIFY.ALL,
        checkoutStrategy: NodeGit.Checkout.STRATEGY.USE_THEIRS
    }

    await repo.setHeadDetached(pr.mergeCommit);
    await NodeGit.Checkout.head(repo, checkoutOps).then(async() => {

        repo.getCurrentBranch().then(ref => {
            console.log("On " + ref.shorthand() + " " + ref.target());
        });

        // start sonar analysis
        await SonarClient.startSonar(repoMeta, options);

        // move to next commit
        return checkoutCommits(repo, repoMeta, prs);
    });
}

function sortPRs(a, b) {
    return new Date(a.mergedAt) - new Date(b.mergedAt);
}