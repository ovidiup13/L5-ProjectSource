const {
    spawn
} = require("child_process");
const path = require("path");
const fs = require("fs");

const sonarDateFormat = "yyyy-MM-dd";
const sonarCommand = "sonar-scanner.bat";
const logsFolder = "../logs";

const parse = {
    sources: function (path) {
        return `-Dsonar.sources=${path}`;
    },
    projectName: function (name) {
        return `-Dsonar.projectName=${name}`;
    },
    projectKey: function (owner, name) {
        return `-Dsonar.projectKey=${name}`;
    },
    projectDate: function (date) {
        return `-Dsonar.projectDate=${new Date(date).toISOString()}`;
    },
    projectVersion: function (vs) {
        return `-Dsonar.projectVersion=${vs}`;
    },
    encoding: `-Dsonar.sourceEncoding=UTF-8`,
}

/**
 * Takes a child_process object and wraps it around in a promise. If the process exists with an error, it is rejected. 
 * Otherwise, resolved.
 * @param {child_process object} child
 */
function promisify(child) {
    return new Promise((resolve, reject) => {

        const logFile = "output.log";
        const errorFile = "error.log";
        const log = fs.createWriteStream(logFile);
        const error = fs.createWriteStream(errorFile);

        child.on('exit', () => {
            log.close();
            error.close();
            console.log("Process exit with status 0.");
            resolve();
        });

        child.on('error', () => {
            log.close();
            error.close();
            console.log("Process exit with status 1.");
            reject();
        });

        // child.stdout.on("data", data => {
        //     log.write(data.toString("UTF-8"));
        //     // console.log(data.toString("UTF-8"));
        // });

        // child.stderr.on('data', data => {
        //     error.write(data.toString("UTF-8"));
        //     // console.error(data.toString("UTF-8"));
        // });
    });
}

/**
 * Make sure to:
 * 1. Have sonar-scanner added to PATH
 * 2. Update the global settings to point to your SonarQube server by editing <install_directory>/conf/sonar-scanner.properties.
 */
module.exports = {
    startSonar: function (repo, options) {

        console.log(parse.projectDate(options.date));

        const args = [
            parse.projectKey(repo.owner, repo.name),
            parse.projectName(repo.name),
            parse.sources(options.srcPath),
            // parse.projectDate(options.date),
            parse.projectVersion(options.commit.substring(0, 7)),
            parse.encoding
        ];

        const child = spawn(sonarCommand, args, {
            stdio: "inherit", //inherits standard IO from parent => outputs data directly to parent.stdout and parent.stderr
            cwd: options.path
        });

        return promisify(child);
    }
};