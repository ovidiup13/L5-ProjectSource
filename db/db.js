const mongoose = require("mongoose");
const bluebird = require("bluebird");

mongoose.Promise = bluebird.Promise;
mongoose.connect("mongodb://localhost/l5project", {
    useMongoClient: true
}).catch((err) => {
    console.error(err);
});

module.exports = mongoose;