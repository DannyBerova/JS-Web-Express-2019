const express = require('express');
const handlebars = require('express-handlebars');
const hbs = require('handlebars');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const flashify = require('flashify');

hbs.registerHelper('dateFormat', require('handlebars-dateformat'));
module.exports = app => {
    app.engine('.hbs', handlebars({
        defaultLayout: 'main',
        extname: '.hbs'
    }));

    app.use(cookieParser());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(session({
        secret: '123456',
        resave: false,
        saveUninitialized: false
    }));
    app.use(flashify);
    app.use(passport.initialize());
    app.use(passport.session());

    app.use((req, res, next) => {
        if (req.user) {
            res.locals.currentUser = req.user;
            res.locals.email = req.user.email;
            if (req.user.roles) {
                res.locals.isAdmin = req.user.roles.indexOf('Admin') > - 1;
            }
        }
        next();
    });

    app.set('view engine', '.hbs');

    app.use(express.static('./static'));
};