const data = require("../data/repos");
const mongoose = require("../db/db");
const RepositoryDAO = require("../db/dao/repo.dao");
const Promise = require("bluebird").Promise;
const graphQLClient = require("./clients/graphql_client");
const queryPR = require("./queries/pr_query");
const queryIssue = require("./queries/issue_query");

const numberOfPullRequests = 10;

// create the respositories and gracefully close mongoose connection
createRepositories(data.repositories)
    .then(() => {
        console.log("All repositories successfully added to DB.");
        mongoose.disconnect();
        process.exit();
    })
    .catch(err => {
        console.error(err);
    });

/**
 * --------------------------------------
 * "Business" logic
 * --------------------------------------
 */

/**
 * Goes through entire repos in data.json and retrieves info from Github API.
 * @param {Repository array with objects containing name, owner and url of repo.} repos 
 */
function createRepositories(repos) {
    return Promise.all(repos.map(repo => {
        return createRepository(repo)
            .catch(err => {
                console.error(err);
            });
    }));
}

/**
 * Function that pulls together info for a repo: pull requests and issues.
 * @param {Repository object with name, owner and url properties.} repo 
 */
async function createRepository(repo) {
    const repoResult = await getPullRequests(graphQLClient, queryPR, repo);
    const pullRequests = repoResult.repository.pullRequests.edges.map(pr => mapToPullRequestModel(pr.node));
    console.log(pullRequests);
    const issues = await getIssues(repo, pullRequests);

    return storeRepository(repo, issues, pullRequests);
}

/**
 * Function that retrieves all issues from each pull request's description.
 * Issue numbers are added to each PR object. Returns array of all issues.
 * @param {Repository object.} repo 
 * @param {Pull Request model objects.} pullRequests 
 */
async function getIssues(repo, pullRequests) {
    let issues = [];

    for (let pr of pullRequests) {
        let issueNumbers = getIssueNumbers(pr.bodyText);

        if (issueNumbers) {
            issueNumbers.map(n => parseInt(n.substring(1))).forEach(n => {
                pr.issues.push(n);
                issues.push(getIssue(graphQLClient, queryIssue, repo, n)); //parse to int, ignore '#'
            });
        }
    }

    // return the result of all promises that have been resolved. 
    return Promise.all(issues.map(reflect))
        .then(results => {
            return results.filter(x => x.status === "resolved").map(x => x.result);
        });
}

/**
 * --------------------------------------
 * API functions
 * --------------------------------------
 */

/**
 * Retrieves repository information from GitHub API.
 * @param {GraphQL client for send/retrieve requests.} client 
 * @param {Query object with two properties: query() and variables.} query 
 * @param {Repository model instance.} repo 
 */
function getPullRequests(client, query, repo) {
    return client.request(query.query(repo.owner, repo.name, numberOfPullRequests), query.variables);
}

/**
 * Retrieves issue info for a particular repo by providing the issue number.
 * @param {GraphQL client for send/retrieve requests.} client
 * @param {Query object with two properties: query() and variables.} query
 * @param {Repository model instance.} repo
 * @param {Issue number as an Int.} issue
 */
async function getIssue(client, query, repo, issue) {
    let response = await client.request(query.query(repo.owner, repo.name, issue), query.variables);
    return mapToIssueModel(response.repository.issue);
}


/**
 * --------------------------------------
 * DB functions
 * --------------------------------------
 */

/**
 * Creates DB document with repository information.
 * @param {Repository object with name, repo and url properties.} repo 
 * @param {Array of issue objects.} issues 
 * @param {Array of pull request objects.} pullRequests 
 */
function storeRepository(repo, issues, pullRequests) {
    return RepositoryDAO.createRepository(repo, issues, pullRequests);
}

/**
 * --------------------------------------
 * Utility functions
 * --------------------------------------
 */

/**
 * Returns the elements that match an issue number in the body text of a pull request.
 * @param {Body text of a pull request.} text 
 */
function getIssueNumbers(text) {
    return text.match(/#[0-9]+/g);
}

/**
 * Utility function that categorizes promises in either resolved or rejected.
 * @param {Promise object} promise 
 */
function reflect(promise) {
    return promise.then(function (result) {
            return {
                result: result,
                status: "resolved"
            }
        },
        function (err) {
            return {
                err: err,
                status: "rejected"
            }
        });
}

/**
 * Mapper function from response to Pull Request model.
 * @param {Pull Request response from GitHub API.} pr 
 */
function mapToPullRequestModel(pr) {
    return {
        _id: pr.id,
        title: pr.title,
        bodyText: pr.bodyText,
        state: pr.state,
        issues: [],
        mergeCommit: {
            _id: pr.mergeCommit.oid,
            abbreviatedSha: pr.mergeCommit.abbreviatedOid
        },
        createdAt: pr.createdAt,
        mergedAt: pr.mergedAt
    }
}

/**
 * Mapper function from response to Issue model.
 * @param {Issue response from GitHub API.} issue 
 */
function mapToIssueModel(issue) {
    return {
        _id: issue.number,
        state: issue.closed ? "CLOSED" : "OPEN",
        title: issue.title,
        bodyText: issue.bodyText,
        createdAt: issue.createdAt,
        updatedAt: issue.updatedAt
    }
}