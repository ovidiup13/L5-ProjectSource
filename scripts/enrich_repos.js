const mongoose = require("../db/db");
const RepositoryDAO = require("../db/dao/repo.dao");

const {
    GraphQLClient
} = require("graphql-request");

const queryPR = require("./queries/pr_query");
const queryIssue = require("./queries/issue_query");

const client = new GraphQLClient(process.env.GITHUB_API_V4_URL, {
    headers: {
        "Authorization": `bearer ${process.env.GITHUB_API_TOKEN}`,
        "User-Agent": "L5-ProjectSource"
    }
});

client.request(queryIssue.query("Microsoft", "vscode", 25655), queryIssue.variables)
    .then(data => {
        console.log(data);
    })
    .catch(err => {
        console.error("Error on requesting issue info");
        console.error(err.response.errors);
    });

client.request(queryPR.query("tensorflow", "tensorflow"), queryPR.variables)
    .then(data => {
        console.log(data);
    })
    .catch(err => {
        console.error("Error on requesting PR info");
        console.error(err.response.errors);
    });