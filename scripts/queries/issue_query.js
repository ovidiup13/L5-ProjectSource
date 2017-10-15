module.exports = {
  query: function (owner, name, issueNumber) {
    return `query {
  repository(name:"${name}", owner:"${owner}") {
    issue(number:${issueNumber}){
      number
      title
      bodyText
      closed
      createdAt
      updatedAt
      author {
        login
      }
    }
  }
}`;
  },
  variables: ""
};