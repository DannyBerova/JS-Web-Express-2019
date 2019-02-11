const passport = require('passport');
const session = require('express-session')
const User = require('../models/User');
const Car = require('../models/Car');
const Rent = require('../models/Rent');
const encription = require('../util/encryption');

module.exports = {
    registerGet: (req, res) => {
        res.render('user/register');
    },
    registerPost: async (req, res) => {
        const userBody = req.body;

        if (!userBody.username || !userBody.password || !userBody.repeatPassword) {
            userBody.error = 'Please fill all fields';
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
                    res.render('user/register', userBody);
                    return;
                } else {
                    res.redirect('/');
                }
            });
        } catch (err) {
            userBody.error = err;
            res.render('user/register', userBody);
        }
    },
    loginGet: (req, res) => {
        res.render('user/login');
    },
    loginPost: async (req, res) => {
        const userBody = req.body;
        try {
            const user = await User.findOne({username: userBody.username});
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
        res.redirect('/');
    },
    myRents: async (req, res) => {

        try {
            let userFind = await User.findById(req.user._id).populate('rents');
            let cars = [];

            for (let rent of userFind.rents) {
                let carFromRent = await Car.findById(rent.car);
                cars.push({
                    model: carFromRent.model,
                    pricePerDay: carFromRent.pricePerDay,
                    expiresOn: rent.days
                });
            }
            res.render('user/rented', { cars });
        } catch (error) {
            userBody.error = err;
            res.render('/');
        }
    }
};