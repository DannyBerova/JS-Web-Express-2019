const PASSPORT = require('passport');
const LOCAL_PASSPORT = require('passport-local');
const USER = require('../models/User');

module.exports = () => {
    PASSPORT.use(new LOCAL_PASSPORT((username, password, done) => {
        USER.findOne({ username: username }).then((user) => {
            if (!user) {
                return done(null, false);
            }

            if (!user.authenticate(password)) {
                return done(null, false);
            }

            return done(null, user);
        });
    }));

    PASSPORT.serializeUser((user, done) => {
        if (!user) {
            return done(null, false);
        }

        return done(null, user._id);
    });

    PASSPORT.deserializeUser((id, done) => {
        USER.findById(id).then((user) => {
            if (!user) {
                return done(null, false);
            }

            return done(null, user);
        });
    });
};