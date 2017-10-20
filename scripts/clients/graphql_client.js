const {
    GraphQLClient
} = require("graphql-request");

module.exports = new GraphQLClient(process.env.GITHUB_API_V4_URL, {
    headers: {
        "Authorization": `bearer ${process.env.GITHUB_API_TOKEN}`,
        "User-Agent": "L5-ProjectSource"
    }
});