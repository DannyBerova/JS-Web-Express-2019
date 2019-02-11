const Car = require('../models/Car');
const User = require('../models/User');
const Rent = require('../models/Rent');
const passport = require('passport');
const session = require('express-session')

module.exports = {
    addGet: (req, res) => {
        res.render('car/add');
    },
    addPost: async (req, res) => {
        let newCar = req.body;

        if (newCar.model.trim().length < 3 || newCar.model.trim().length > 30) {
            newCar.error = "Model name must be at least 3 symbols!";
            res.render('car/add', newCar);
            return;
        }

        if (!newCar.image.startsWith('http')) {
            newCar.error = "Image URL must be valid URL!";
            res.render('car/add', newCar);
            return;
        }

        if (Number(newCar.pricePerDay) < 1) {
            newCar.error = "Price per Day must be a positive number!";
            res.render('car/add', newCar);
            return;
        }

        let car = {};

        car.model = newCar.model.trim();
        car.image = newCar.image;
        car.pricePerDay = newCar.pricePerDay;

        try {
            let carCreated = await Car.create(car);
            if (carCreated) {
                res.redirect('/car/all');
            } else {
                res.render('car/edit', newCar)
            }

        } catch (err) {
            newCar.error = err;
            res.render('car/add', newCar);
        }

    },
    allCars: (req, res) => {
        Car.find({
            isRented: false
        }).then((cars) => {
            res.render('car/all', {
                cars
            });
        }).catch((err) => {
            console.log(err);
            res.redirect('/');
        });
    },
    editGet: (req, res) => {
        let id = req.params.id;
        Car.findById(id).then((car) => {
            res.render('car/edit', car);
        }).catch((err) => {
            console.log(err);
            res.redirect('/car/all');
        });
    },
    editPost: (req, res) => {
        let id = req.params.id;
        let car = req.body;

        if (car.model.trim().length < 3 || car.model.trim().length > 30) {
            car.error = "Model name must be at least 3 symbols!";
            res.render('car/edit', car);
            return;
        }

        if (!car.image.startsWith('http')) {
            car.error = "Image URL must be valid URL!";
            res.render('car/edit', car);
            return;
        }

        if (Number(car.pricePerDay) < 1) {
            car.error = "Price per Day must be a positive number!";
            res.render('car/edit', car);
            return;
        }

        Car.findById(id).then((oldCar) => {
            oldCar.model = car.model.trim();
            oldCar.image = car.image;
            oldCar.pricePerDay = car.pricePerDay;

            oldCar.save().then(() => {
                res.redirect('/car/all');
            }).catch((err) => {
                car.error = err;
                res.render('car/edit', car);

            });
        }).catch((err) => {
            console.log(err);
            res.redirect('/');
        });
    },
    rentGet: (req, res) => {
        let id = req.params.id;
        Car.findById(id).then((car) => {
            res.render('car/rent', car);
        }).catch((err) => {
            console.log(err);
            res.redirect('/');
        });
    },
    rentPost: async (req, res) => {
        let carId = req.params.id;
        let userId = req.user.id;
        let days = +req.body.days;
        let body = req.body;

        if (days < 1) {
            let car = await Car.findById(carId)
            car.error = "Days must be a positive number!";
            res.render('car/rent', car);
            return;
        }

        try {
            let car = await Car.findById(carId);
            let user = await User.findById(userId);
            const rent = {
                days,
                car: car._id,
                user: user._id,
            }
            let rentCr = await Rent.create(rent);

            car.isRented = true;
            await car.save();
            await user.rents.push(rentCr._id);

            await user.save();
            if (rentCr) {
                res.redirect('/car/all');
            } else {
                res.render('car/rent')
            }

        } catch (err) {
            console.log(err);
            res.redirect('/');
        }
    },
    search: (req, res) => {
        let searchModel = req.query.model;
        if (!req.query.model) {
            res.redirect('car/all');
            return;
        }

        if (req.query.model.trim() === '') {
            res.redirect('car/all');
            return;
        }

        Car.find({}).then((carsAll) => {
            let cars = carsAll
                .filter(car => car.isRented === false &&
                    car.model.toLowerCase().includes(searchModel.toLowerCase()));
            res.render('car/all', {
                cars
            });

        }).catch((err) => {
            console.log(err);
            res.redirect('/');
        });
    },

}