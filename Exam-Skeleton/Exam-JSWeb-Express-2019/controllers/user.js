const passport = require('passport');
const session = require('express-session')
//change models requiring
const User = require('../models/User');
const Car = require('../models/Car');
const Rent = require('../models/Rent');
const encription = require('../util/encryption');

//multiple errors handling example Kiro style
//use it with this:
//.catch((e) => handleErrors(e, res, cube));

// function handleErrors(err, res, body) {
//     let errors = [];

//     for (const prop in err.errors) {
//         errors.push(err.errors[prop].message);
//     }

//     res.locals.globalError = errors;
//     res.render('create', body);
// }


//if email in use, don't forget to change it
module.exports = {
    registerGet: (req, res) => {
        res.render('user/register');
    },
    registerPost: async (req, res) => {
        const userBody = req.body;

        if (!userBody.username || !userBody.password || !userBody.repeatPassword) {
            //res.flash('error', 'Please fill all fields required');
            userBody.error = 'Please fill all fields';
            console.log(userBody)
            res.render('user/register', userBody);
            return;
        }

        if (userBody.password !== userBody.repeatPassword) {
            //res.flash('error', 'Passwords must match!');
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
                    req.flash('Registered and Logged in successfully');
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
                // res.flash('error', 'Invalid credentials')
                userBody.error = 'Invalid credentials';
                console.log(userBody)
                res.render('user/login', userBody);
                return;
            }

            if (!user.authenticate(userBody.password)) {
                //res.flash =('error', 'Invalid credentials')
                userBody.error = 'Invalid credentials'
                console.log(userBody)
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

    //block-unblock example from messenger
    // blockUser: async (req, res) => {
    //     try {
    //         req.user.blockedUsers.push(req.params.username);
    //         await req.user.save();
    //         res.redirect('/thread/' + req.params.username);
    //     } catch (err) {
    //         console.log(err);
    //     }
    // },
    // unblockUser: async (req, res) => {
    //     try {
    //         req.user.blockedUsers = req.user.blockedUsers.filter(user => user !== req.params.username);
    //         await req.user.save();
    //         res.redirect('/thread/' + req.params.username);
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }

    
};