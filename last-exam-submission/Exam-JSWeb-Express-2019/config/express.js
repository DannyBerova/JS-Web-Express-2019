const express = require('express');
const handlebars = require('express-handlebars');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
var flashify = require('flashify');

module.exports = app => {
    app.engine('.hbs', handlebars({
        defaultLayout: 'main',
        extname: '.hbs'
    }));

    app.use(cookieParser());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(session({
        secret: '123456',
        resave: false,
        saveUninitialized: false
    }));
    //redirect messages lib
    app.use(flashify);
    app.use(passport.initialize());
    app.use(passport.session());

    app.use((req, res, next) => {
        if (req.user) {
            res.locals.user = req.user;
        }
        next();
    });

    app.use((req, res, next) => {
        if (req.user) {
            res.locals.isAdmin = req.user.roles.indexOf('Admin') !== -1;
            res.locals.isUser = req.user.roles.indexOf('User') !== -1;
        }
        next();
    });

    app.set('view engine', '.hbs');

    app.use(express.static('./static'));
};