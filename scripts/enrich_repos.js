const mongoose = require("../db/db");
const RepositoryDAO = require("../db/dao/repo.dao");
const Promise = require("bluebird").Promise;
const rp = require("request-promise");

// RepositoryDAO.getRepositories().then(repos => {
//     console.log(repos);
// });

const query = `{
  repository(name:"tensorflow", owner:"tensorflow") {
    id
    pullRequests(last:10, orderBy: $issueOrder, states:MERGED) {
      edges {
        node {
          id
          bodyText
          createdAt
          state
          mergeCommit {
            id
          }
        }
      }
    }
  }
}
`;

const variables = {
    "issueOrder": {
        "field": "CREATED_AT",
        "direction": "ASC"
    }
};

const options = {
    uri: process.env.GITHUB_API_V4_URL,
    headers: {
        "Authorization": `bearer ${process.env.GITHUB_API_TOKEN}`,
        "User-Agent": "L5-ProjectSource"
    },
    body: {
        query: query,
        variables: variables
    },
    json: true,
};

rp.post(options)
    .then(parsedBody => {
        console.log(parsedBody);
    }).catch(err => {
        console.error(err);
    });