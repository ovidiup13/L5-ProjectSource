module.exports = {
  query: function (owner, name) {
    return `query($issueOrder:IssueOrder) {
  repository(name:"${name}", owner:"${owner}") {
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
}`;
  },
  variables: {
    "issueOrder": {
      "field": "CREATED_AT",
      "direction": "ASC"
    }
  }
};