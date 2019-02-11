const Project = require('../models/Project');
const Team = require('../models/Team');
const User = require('../models/User');
const passport = require('passport');
const session = require('express-session');

module.exports = {
    addGet: (req, res) => {
        res.render('project/create');
    },
    addPost: async (req, res) => {
        let newProj = req.body;

        if (newProj.name.trim().length < 3 || newProj.name.trim().length > 30) {
            //res.flash('error', 'Model name must be at least 3 symbols!')
            newProj.error = "Project name must be at least 3 symbols!";
            res.render('project/create', newProj);
            return;
        }

        if (newProj.description.trim().length < 3 || newProj.description.trim().length > 50) {
            //res.flash('error', 'Model name must be at least 3 symbols!')
            newProj.error = "Project description must be at least 3 symbols!";
            res.render('project/create', newProj);
            return;
        }

        let proj = {};
        proj.name = newProj.name.trim();
        proj.description = newProj.description;
        console.log(proj)
        try {
            let projCreated = await Project.create(proj);
            if (projCreated) {
                req.flash('Project created successfully');
                res.redirect('/');
            } else {
                res.render('project/create', newProj)
            }

        } catch (err) {
            newProj.error = err;
            res.render('project/create', newProj);
        }

    },
    // allCars: (req, res) => {
    //     if(req.user && res.locals.isAdmin) {
    //         Car.find({
    //         }).then((cars) => {
    //             if(cars) {
    //                 res.locals.empty = 'No cars available!'
    //             }
    //             res.render('car/all', {
    //                 cars
    //             });
    //         }).catch((err) => {
    //             console.log(err);
    //             res.redirect('/');
    //         });
    //     } else {

    //         Car.find({
    //             isRented: false,
    //             outOfOrder: false
    //         }).then((cars) => {
    //             if(cars) {
    //                 res.locals.empty = 'No cars available!'
    //             }
    //             res.render('car/all', {
    //                 cars
    //             });
    //         }).catch((err) => {
    //             console.log(err);
    //             res.redirect('/');
    //         });
    //     }
    // },
    // editGet: (req, res) => {
    //     let id = req.params.id;
    //     Car.findById(id).then((car) => {
    //         res.render('car/edit', car);
    //     }).catch((err) => {
    //         console.log(err);
    //         res.redirect('/car/all');
    //     });
    // },
    // editPost: (req, res) => {
    //     let id = req.params.id;
    //     let car = req.body;

    //     if (car.model.trim().length < 3 || car.model.trim().length > 30) {
    //         //res.flash('error', 'Model name must be at least 3 symbols!')
    //         car.error = "Model name must be at least 3 symbols!";
    //         res.render('car/edit', car);
    //         return;
    //     }

    //     if (!car.image.startsWith('http')) {
    //         //res.flash('error', 'Image URL must be valid URL!')
    //         car.error = "Image URL must be valid URL!";
    //         res.render('car/edit', car);
    //         return;
    //     }

    //     if (Number(car.pricePerDay) < 1) {
    //         //res.flash('error', 'Price per Day must be a positive number!');
    //         car.error = "Price per Day must be a positive number!";
    //         res.render('car/edit', car);
    //         return;
    //     }

    //     Car.findById(id).then((oldCar) => {
    //         oldCar.model = car.model.trim();
    //         oldCar.image = car.image;
    //         oldCar.pricePerDay = car.pricePerDay;

    //         oldCar.save().then(() => {
    //             req.flash('Car edited successfully');
    //             res.redirect('/car/all');
    //         }).catch((err) => {
    //             car.error = err;
    //             res.render('car/edit', car);

    //         });
    //     }).catch((err) => {
    //         console.log(err);
    //         res.redirect('/');
    //     });
    // },
    // rentGet: (req, res) => {
    //     let id = req.params.id;
    //     Car.findById(id).then((car) => {
    //         res.render('car/rent', car);
    //     }).catch((err) => {
    //         console.log(err);
    //         res.redirect('/');
    //     });
    // },
    // rentPost: async (req, res) => {
    //     let carId = req.params.id;
    //     let userId = req.user.id;
    //     let days = +req.body.days;
    //     let body = req.body;

    //     if (days < 1) {
    //         let car = await Car.findById(carId)
    //         //res.flash('error', 'Days must be a positive number!')
    //         car.error = "Days must be a positive number!";
    //         res.render('car/rent', car);
    //         return;
    //     }

    //     try {
    //         let car = await Car.findById(carId);
    //         let user = await User.findById(userId);
    //         const rent = {
    //             days,
    //             car: car._id,
    //             user: user._id,
    //         }
    //         let rentCr = await Rent.create(rent);

    //         car.isRented = true;
    //         await car.save();
    //         await user.rents.push(rentCr._id);

    //         await user.save();
    //         if (rentCr) {
    //             req.flash(`${car.model} rented for ${days} days`);
    //             res.redirect('/car/all');
    //         } else {
    //             res.render('car/rent')
    //         }

    //     } catch (err) {
    //         console.log(err);
    //         res.redirect('/');
    //     }
    // },
    // search: (req, res) => {
    //     let searchModel = req.query.model;
    //     if (!req.query.model) {
    //         res.redirect('car/all');
    //         return;
    //     }

    //     if (req.query.model.trim() === '') {
    //         res.redirect('car/all');
    //         return;
    //     }

    //     Car.find({}).then((carsAll) => {
    //         let cars = carsAll
    //             .filter(car => car.isRented === false &&
    //                 car.model.toLowerCase().includes(searchModel.toLowerCase()));
    //         res.flash('info',`Results for ${searchModel}`);
    //         res.render('car/all', {
    //             cars
    //         });

    //     }).catch((err) => {
    //         console.log(err);
    //         res.redirect('/');
    //     });
    // },
    // out: (req, res) => {
    //   Car.findById(req.params.id)
    //     .then((c) => {
    //       c.outOfOrder = true;
    //       c.save().then(() => {
    //         req.flash(`${c.model} is Out of Order!`)
    //         res.redirect(`/car/all`);
    //       });
    //     }).catch((err) => {
    //         console.log(err);
    //         res.redirect('/');
    //     });
    // },
    // in: (req, res) => {
    //     Car.findById(req.params.id)
    //     .then((c) => {
    //       c.outOfOrder = false;
    //       c.save().then(() => {
    //         req.flash(`${c.model} is on market!`)
    //         res.redirect(`/car/all`);
    //       });
    //     }).catch((err) => {
    //         console.log(err);
    //         res.redirect('/');
    //     });
    // }

}