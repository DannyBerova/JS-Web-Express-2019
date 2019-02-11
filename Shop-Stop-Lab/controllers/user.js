const ROLE = require('mongoose').model('Role');
const USER = require('mongoose').model('User');
const ENCRYPTION = require('../utilities/encryption');

module.exports = {
    registerGet: (req, res) => {
        res.render('user/register');
    },

    registerPost: (req, res) => {
        let user = req.body;

        if (user.password && user.password !== user.confirmedPassword) {
            user.error = 'Passwords do not match!';
            res.render('user/register', user);
            return;
        }

        let salt = ENCRYPTION.generateSalt();
        user.salt = salt;

        if (user.password) {
            let hashedPassword = ENCRYPTION.generateHashedPassword(salt, user.password);
            user.password = hashedPassword;
        }

        ROLE.findOne({ name: 'User' }).then((role) => {
            user.roles = [role._id];
            USER.create(user).then((user) => {
                role.users.push(user._id);
                role.save();
                req.logIn(user, (err, user) => {
                    if (err) {
                        res.render('user/register', { error: 'Authentication not working!' });
                        return;
                    }
                    res.redirect('/');
                });
            }).catch((err) => {
                user.error = err;
                res.render('user/register', user);
            });
        });
    },

    loginGet: (req, res) => {
        res.render('user/login');
    },

    loginPost: (req, res) => {
        let userToLogin = req.body;

        USER.findOne({ username: userToLogin.username }).then((user) => {
            if (!user || !user.authenticate(userToLogin.password)) {
                res.render('user/login', { error: 'Invalid credentials!' });
                return;
            }

            req.logIn(user, (err, user) => {
                if (err) {
                    res.render('user/login', { error: 'Authentication not working!' });
                    return;
                }

                res.redirect('/');
            });
        });
    },

    logout: (req, res) => {
        req.logout();
        res.redirect('/');
    }
};