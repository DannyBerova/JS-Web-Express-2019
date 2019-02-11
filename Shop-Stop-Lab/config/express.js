const EXPRESS = require('express');
const PATH = require('path');
const BODY_PARSER = require('body-parser');
const COOKIE_PARSER = require('cookie-parser');
const SESSION = require('express-session');
const PASSPORT = require('passport');

module.exports = (APP, CONFIG) => {
    APP.set('view engine', 'pug');
    APP.set('views', PATH.join(CONFIG.rootPath, 'views'));

    APP.use(BODY_PARSER.urlencoded({ extended: true }));

    APP.use(COOKIE_PARSER());
    APP.use(SESSION({
        secret: '6b875ecdcb3d258f0e1155a3b75d9d79',
        cookie: {maxAge: 604800000},
        saveUninitialized: false,
        resave: false
    }));
    APP.use(PASSPORT.initialize());
    APP.use(PASSPORT.session());

    APP.use((req, res, next) => {
        if (req.user) {
            res.locals.user = req.user;
        }

        next();
    });

    APP.use(EXPRESS.static(
        PATH.normalize(PATH.join(CONFIG.rootPath, 'content')))
    );
};