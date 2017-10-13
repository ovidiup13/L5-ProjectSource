const Promise = require("bluebird").Promise;
const rp = require("request-promise");

const mongoose = require("../db/db");
const RepositoryDAO = require("../db/dao/repo.dao");

const {
    GraphQLClient
} = require("graphql-request");
const queryPR = require("./queries/pr_query");

const client = new GraphQLClient(process.env.GITHUB_API_V4_URL, {
    headers: {
        "Authorization": `bearer ${process.env.GITHUB_API_TOKEN}`,
        "User-Agent": "L5-ProjectSource"
    }
});

client.request(queryPR.query, queryPR.variables)
    .then(data => {
        console.log(data);
    })
    .catch(err => {
        console.error(err.response.errors);
    });