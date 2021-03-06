module.exports = {
  query: function (owner, name, last) {
    return `query($issueOrder:IssueOrder) {
  repository(name:"${name}", owner:"${owner}") {
    pullRequests(last:${last}, orderBy: $issueOrder, states:MERGED) {
      edges {
        node {
          id
          title
          state
          bodyText
          createdAt
          mergedAt
          mergeCommit {
            oid
            abbreviatedOid
            messageBody
            committedDate
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