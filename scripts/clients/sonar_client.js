const {
    execFile
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
    },
    encoding: `-Dsonar.sourceEncoding="UTF-8"`
}

/**
 * Make sure to:
 * 1. Have sonar-scanner added to PATH
 * 2. Update the global settings to point to your SonarQube server by editing <install_directory>/conf/sonar-scanner.properties.
 */
module.exports = {
    startSonar: function (repo, pathToSources, cwd) {
        return execFile("sonar-scanner", [options.projectKey(repo.owner, repo.name), options.projectName(repo.name), options.sources(pathToSources), options.encoding], {
            cwd: cwd
        });
    }
};