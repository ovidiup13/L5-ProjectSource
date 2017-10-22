const {
    spawn
} = require("child_process");

const gitCommand = "git";
const gitDiff = "diff";
const statOption = "--numstat";

function promisify(child_process) {
    return new Promise((resolve, reject) => {
        const result = "";

        child_process.stdout.on('data', data => {
            result.push(data.toString());
        });

        child_process.on('error', (err) => {
            reject(err);
        })

        child_process.on('close', () => {
            resolve(result);
        });
    });
}

module.exports = {
    getDiff: function (commit1, commit2, options) {

        const gitProcess = spawn(gitCommand, [gitDiff, statOption, commit1, commit2], {
            cwd: options.cwd
        });

        return promisify(gitProcess);
    }
}