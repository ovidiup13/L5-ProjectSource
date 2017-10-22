const {
    spawn
} = require("child_process");

const Promise = require("bluebird").Promise;

const gitCommand = "git";
const gitDiff = "diff";
const statOption = "--numstat";

function promisify(child) {
    return new Promise((resolve, reject) => {
        let result = "";

        child.stdout.on('data', data => {
            console.log(data.toString());
            result += data;
        });

        child.stderr.on('data', data => {
            console.error(data.toString());
        });

        child.on('error', (err) => {
            reject(err);
        });

        child.on('exit', () => {
            resolve(processNumStatDiff(result));
        });
    });
}

function processNumStatDiff(diffOutput) {

    let result = {
        insertions: 0,
        deletions: 0,
        filesChanged: 0
    };

    const lines = diffOutput.split("\n");
    for (let line of lines) {
        if (!line) {
            continue;
        }
        const data = line.split("\t");
        result.insertions += parseInt(data[0]);
        result.deletions += parseInt(data[1]);
        result.filesChanged += 1;
    }

    return result;
}

module.exports = {
    getDiff: function (commit1, commit2, options) {

        const gitProcess = spawn(gitCommand, [gitDiff, statOption, commit1, commit2], {
            // stdio: "inherit",
            cwd: options.cwd
        });

        return promisify(gitProcess);
    }
}