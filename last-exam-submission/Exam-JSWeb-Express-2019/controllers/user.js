const passport = require('passport');
const session = require('express-session')
const User = require('../models/User');
const Team = require('../models/Team');
const encription = require('../util/encryption');

//if email in use, don't forget to change it
module.exports = {
    registerGet: (req, res) => {
        res.render('user/register');
    },
    registerPost: async (req, res) => {
        const userBody = req.body;

        if (!userBody.username || !userBody.password || !userBody.repeatPassword || !userBody.firstName || !userBody.lastName) {
            userBody.error = 'Please fill all fields';
            console.log(userBody)
            res.render('user/register', userBody);
            return;
        }

        if (userBody.username.trim().length < 3 || userBody.username.trim().length > 30) {
            userBody.error = "Username must be between 3 and 30 symbols!";
            res.render('user/register', userBody);
            return;
        }

        if (userBody.password !== userBody.repeatPassword) {
            userBody.error = 'Passwords must match!'
            res.render('user/register', userBody);
            return;
        }

        const salt = encription.generateSalt();
        const hashedPass = encription.generateHashedPassword(salt, userBody.password);

        try {
            let userToAdd = {
                username: userBody.username,
                hashedPass,
                salt,
                firstName: userBody.firstName,
                lastName: userBody.lastName,
                roles: ['User']
            }
            if (userBody.imageUrl.trim().length > 0) {
                userToAdd.imageUrl = userBody.imageUrl;
            }
            const user = await User.create(userToAdd);

            req.logIn(user, (err) => {
                if (err) {
                    userBody.error = err;
                    res.render('user/register', userBody);
                    return;
                } else {
                    req.flash('Registered and Logged in successfully');
                    res.redirect('/');
                }
            });
        } catch (err) {
            userBody.error = err.message;
            res.render('user/register', userBody);
        }

    },
    loginGet: (req, res) => {
        res.render('user/login');
    },
    loginPost: async (req, res) => {
        const userBody = req.body;
        try {
            const user = await User.findOne({
                username: userBody.username
            });
            if (!user) {
                userBody.error = 'Invalid credentials';
                res.render('user/login', userBody);
                return;
            }

            if (!user.authenticate(userBody.password)) {
                userBody.error = 'Invalid credentials'
                res.render('user/login', userBody);
                return;
            }

            req.logIn(user, (err) => {
                if (err) {
                    userBody.error = err;
                    res.render('user/login', userBody);
                    return;
                } else {
                    req.flash('Logged in successfuly');
                    res.redirect('/');
                }
            });
        } catch (error) {
            userBody.error = err;
            res.render('user/login', userBody);
        }
    },
    logout: async (req, res) => {
        req.logout();
        req.flash('Logged out!');
        res.redirect('/');
    },
    profile: async (req, res) => {
        try {
            let user = await User.findById(req.user._id)
                .populate({
                    path: 'teams',
                    populate: {
                        path: 'projects'
                    }
                });
            res.render('user/profile', user);

        } catch (error) {
            console.log(error);
            res.redirect('/');
        }
    },
    leaveTeam: async (req, res) => {
        try {
            let user = await User.findById(req.user.id);
            let team = await Team.findById(req.body.id.toString());

            user.teams.pull(team._id);
            team.members.pull(user._id);
            await team.save();
            await user.save();
            req.flash(`You left ${team.name} team`)
            res.redirect('/user/profile');

        } catch (error) {
            console.log(error);
            res.redirect('/');
        }
    }
};