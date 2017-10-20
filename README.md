# L5-ProjectSource

Source code for my master's project. Using the scripts in this application you can:

* Extract repository information (pull requests, issues, etc.) from GitHub GraphQL API.
* Clone repository in a temp folder using NodeGit.
* Use sonar-scanner command to run a SonarQube historical analysis on a repository.

## Notes

Used for testing/research purposes only. Not suitable for production use.

## Dependencies

* MongoDB instance
* SonarQube instance (support for SonarCloud coming soon)

## Setup

* Clone the repository ```git clone https://github.com/ovidiup13/L5-ProjectSource.git```
* Install dependencies ```cd L5-ProjectSource && npm install```
* Add repositories with name, owner and URL to ```./data/repos.json```
* Add *.env* file in the root of your project and populate the following environment varibles:
    * *DB_CONNECTION_URL* - MongoDB connection URL (example: mongodb://localhost/mycollection)
    * *GITHUB_API_V4_URL* - URL to GitHub GraphQL API
    * *GITHUB_API_TOKEN* - GitHub access token
    * *SONAR_URL* - Sonar instance URL

To run the scripts, you may use the following npm commands:

* ```npm run-script populate``` - This script will retrieve repository information from GitHub API and store them into the MongoDB database.
* ```npm run-script clone``` - This script will clone the repositories into a temporary folder outside of the current workspace.
* ```npm run-script sonar``` - This script will take the repositories cloned in the temporary folder along with the pull request data returned from GitHub API and will run a sonar analysis for each of the merge commits in chronological order.

## License

MIT License

Copyright (c) 2017 Ovidiu Popoviciu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
