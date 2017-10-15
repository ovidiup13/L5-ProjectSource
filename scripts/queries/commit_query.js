module.exports = {
    query: `query {
  repository(name:"vscode", owner:"Microsoft") {
		ref(qualifiedName:"master") {
			id
      target {
        oid
        abbreviatedOid
      }
      associatedPullRequests(last:10, states:MERGED) {
        edges {
          node {
            id
            commits(first:10) {
              edges {
                node {
                  commit {
                    oid
                  }
                }
              }
            }
            mergeCommit {
              abbreviatedOid
            }
            bodyText
          }
        }
      }
    }
  }
}`
};