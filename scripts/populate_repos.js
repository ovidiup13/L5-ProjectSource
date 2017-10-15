const data = require("../data/repos");
const mongoose = require("../db/db");

const RepositoryDAO = require("../db/dao/repo.dao");
const Promise = require("bluebird").Promise;

const graphQLClient = require("./graphql_client");

const queryPR = require("./queries/pr_query");
const queryIssue = require("./queries/issue_query");

createRepositories(data.repositories)
    .then(() => {
        console.log("All repositories successfully added to DB.");
        mongoose.disconnect();
        process.exit();
    })
    .catch(err => {
        console.error(err);
    });

function createRepositories(repos) {
    return Promise.all(repos.map(repo => {
        return createRepository(repo)
            .catch(err => {
                console.error(err);
            });
    }));
}

async function createRepository(repo) {
    const repoResult = await getPullRequests(graphQLClient, queryPR, repo);
    const pullRequests = repoResult.repository.pullRequests.edges.map(pr => pr.node);
    const issues = await getIssues(repo, pullRequests);

    // return storeRepository(repo, issues, pullRequests);
}

async function getIssues(repo, pullRequests) {
    let issues = [];

    for (let pr of pullRequests) {
        let issueNumbers = getIssueNumbers(pr.bodyText);
        if (issueNumbers) {
            let issueResults = await Promise.map(issueNumbers, n => {
                return getIssue(graphQLClient, queryIssue, repo, parseInt(n.substring(1))); //parse to int, ignore '#'
            });
            issues = issues.concat(issueResults);
            console.log(issues);
        }
    }
}

/**
 * Retrieves repository information from GitHub API.
 * @param {GraphQL client for send/retrieve requests.} client 
 * @param {Query object with two properties: query() and variables.} query 
 * @param {Repository model instance.} repo 
 */
function getPullRequests(client, query, repo) {
    return client.request(query.query(repo.owner, repo.name), query.variables);
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
 * Creates DB document with repository information.
 * @param {Repository object with name, repo and url properties.} repo 
 * @param {Array of issue objects.} issues 
 * @param {Array of pull request objects.} pullRequests 
 */
function storeRepository(repo, issues, pullRequests) {
    return RepositoryDAO.createRepository(repo, issues, pullRequests);
}

/**
 * Returns the elements that match an issue number in the body text of a pull request.
 * @param {Body text of a pull request.} text 
 */
function getIssueNumbers(text) {
    return text.match(/#[0-9]+/g);
}

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