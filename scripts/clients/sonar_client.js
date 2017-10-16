const {
    spawn
} = require("child_process");

const options = {
    sources: function (path) {
        return `-Dsonar.sources="${path}"`;
    },
    projectName: function (name) {
        return `-Dsonar.projectName="${name}"`;
    },
    projectKey: function (owner, name) {
        return `-Dsonar.projectKey="${owner}:${name}"`;
    }
}

/**
 * Make sure to:
 * 1. Have sonar-scanner added to PATH
 * 2. Update the global settings to point to your SonarQube server by editing <install_directory>/conf/sonar-scanner.properties.
 */
module.exports = {
    startSonar: function (repo, pathToSources) {
        spawn("sonar-scanner", [projectKey(repo.owner, repo.name), projectName(repo.name), sources(pathToSources)]);
    }
};