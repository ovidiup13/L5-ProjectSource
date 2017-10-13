module.exports = {
  query: function (name, owner) {
    return `query($issueOrder:IssueOrder) {
  repository(name:"${name}", owner:"${owner}") {
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
}`;
  },
  variables: {
    "issueOrder": {
      "field": "CREATED_AT",
      "direction": "ASC"
    }
  }
};