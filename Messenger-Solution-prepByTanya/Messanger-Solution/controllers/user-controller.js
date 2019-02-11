const passport = require('passport');
const session = require('express-session')
const encryption = require('../util/encryption');
const User = require('../models/User');

// function handleErrors(err, res, body) {
//     let errors = [];

//     for (const prop in err.errors) {
//         errors.push(err.errors[prop].message);
//     }

//     res.locals.globalError = errors;
//     res.render('create', body);
// }

module.exports = {
    registerGet: (req, res) => {
        res.render('users/register');
    },
    registerPost: async (req, res) => {
        const userBody = req.body;

        try {
            if (!userBody.username || !userBody.password || !userBody.confirmPassword) {
                res.flash('error', 'Please fill all fields required');
                //userBody.error = 'Please fill all fields required';
                res.render('users/register', userBody);
                return;
            }

            if (userBody.password !== userBody.confirmPassword) {
                res.flash('error', 'Passwords must match!');
                //userBody.error = 'Passwords must match!'
                res.render('users/register', userBody);
                return;
            }

            const salt = encryption.generateSalt();
            const hashedPass = encryption.generateHashedPassword(salt, userBody.password);

            const user = await User.create({
                username: userBody.username,
                hashedPass,
                salt,
                firstName: userBody.firstName,
                lastName: userBody.lastName,
                roles: ['User']
            });
            req.logIn(user, (err) => {
                if (err) {
                    userBody.error = err;
                    res.render('users/register', userBody);
                    return;
                } else {
                    req.flash('Registered and Logged in successfully');
                    res.redirect('/');
                }
            });
        } catch (err) {
            res.locals.error = err;
            res.render('users/register');
        }
    },
    logout: (req, res) => {
        req.logout();
        req.flash('Logged out!');
        res.redirect('/');
    },
    loginGet: (req, res) => {
        res.render('users/login');
    },
    loginPost: async (req, res) => {
        const reqUser = req.body;
        try {
            const user = await User.findOne({
                username: reqUser.username
            });
            if (!user) {
                res.flash('error', 'Invalid credentials')
                //reqUser.error = 'Invalid credentials';
                res.render('users/login', reqUser);
                return;

            }
            if (!user.authenticate(reqUser.password)) {
                res.flash =('error', 'Invalid credentials 2')
                res.render('users/login', reqUser);
                return;
            }
            req.logIn(user, (err, user) => {
                if (err) {
                    res.locals.error = err;
                    
                    res.render('users/login');
                } else {
                    req.flash('Logged in successfully');
                    res.redirect('/');
                }
            });
        } catch (err) {
            res.locals.error = err;
            res.render('users/register');
        }

        function errorHandler(e) {
            console.log(e);
            req.flash(e);
            res.locals.globalError = e;
            res.render('users/login');
        }
    },
    blockUser: async (req, res) => {
        try {
            req.user.blockedUsers.push(req.params.username);
            await req.user.save();
            res.redirect('/thread/' + req.params.username);
        } catch (err) {
            console.log(err);
        }
    },
    unblockUser: async (req, res) => {
        try {
            req.user.blockedUsers = req.user.blockedUsers.filter(user => user !== req.params.username);
            await req.user.save();
            res.redirect('/thread/' + req.params.username);
        } catch (err) {
            console.log(err);
        }
    }
};