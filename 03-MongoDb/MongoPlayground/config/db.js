const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports = (config) => {
    mongoose.connect(config.connectionString, { useNewUrlParser: true });

    let database = mongoose.connection;

    database.once('open', (err) => {
        if(err) {
            console.log(err);
            return;
        }

        console.log("Database successfully connected.");
    });
}