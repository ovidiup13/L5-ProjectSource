const mongoose = require("../db/db");
const RepositoryDAO = require("../db/dao/repo.dao");
const graphQLClient = require("./graphql_client");

const queryPR = require("./queries/pr_query");
const queryIssue = require("./queries/issue_query");

/**
 * Retrieves repository information from GitHub API.
 * @param {GraphQL client for send/retrieve requests.} client 
 * @param {Query object with two properties: query() and variables.} query 
 * @param {Repository model instance.} repo 
 */
function getRepositoryInfo(client, query, repo) {
    return client.request(query.query(repo.owner, repo.name), query.variables);
}

/**
 * Retrieves issue info for a particular repo by providing the issue number.
 * @param {GraphQL client for send/retrieve requests.} client
 * @param {Query object with two properties: query() and variables.} query
 * @param {Repository model instance.} repo
 * @param {Issue number as an Int.} issue 
 */
function getIssueInfo(client, query, repo, issue) {
    return client.request(query.query(repo.owner, repo.name, issue), query.variables);
}

RepositoryDAO.getRepositories().then(repos => {
        console.log("Retrieving repos from db...");
        return Promise.all(repos.map(repo => {
            console.log(`Retrieving repo PR info for ${repo.owner}:${repo.name}`);
            getRepositoryInfo(graphQLClient, queryPR, repo)
                .then(data => {
                    console.log(data);
                })
                .catch(err => {
                    console.error("Error on requesting PR info");
                    console.error(err.response.errors);
                });
        }));
    })
    .catch(err => {
        console.error("Error retrieving repo info from DB.");
        console.error(err);
    });



// client.request(queryIssue.query("Microsoft", "vscode", 25655), queryIssue.variables)
//     .then(data => {
//         console.log(data);
//     })
//     .catch(err => {
//         console.error("Error on requesting issue info");
//         console.error(err.response.errors);
//     });