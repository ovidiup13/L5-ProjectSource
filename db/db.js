const mongoose = require("mongoose");
const bluebird = require("bluebird");

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({
        path: "../.env"
    });
}

console.log(process.env.DB_CONNECTION_URL);

mongoose.Promise = bluebird.Promise;
mongoose.connect(process.env.DB_CONNECTION_URL, {
    useMongoClient: true
}).catch((err) => {
    console.error(err);
});

module.exports = mongoose;