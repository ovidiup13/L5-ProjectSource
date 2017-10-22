const {
    spawn
} = require("child_process");

const gitCommand = "git";
const gitDiff = "diff";
const statOption = "--numstat";

module.exports = {
    getDiff: function (commit1, commit2, options, callback) {

        const result = [];

        const gitProcess = spawn(gitCommand, [gitDiff, statOption, commit1, commit2], {
            cwd: options.cwd
        });

        gitProcess.stdout.on('data', data => {
            result.push(data.toString());
        });

        gitProcess.on('close', () => {
            callback(result);
        })

        return gitProcess;
    }
}