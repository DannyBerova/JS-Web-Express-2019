const ROLE = require('mongoose').model('Role');
const PRODUCT = require('mongoose').model('Product');

function isAdmin(user) {
    return new Promise((resolve, reject) => {
        ROLE.findOne({ name: 'Admin' }).then((role) => {
            if (!role) {
                reject();
            }

            let isAdmin = user.roles.indexOf(role._id) !== -1;
            if (isAdmin) {
                resolve();
            } else {
                reject();
            }
        });
    });
}

module.exports = {
    isAuth: (req, res, next) => {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.redirect('/user/login');
        }
    },

    isInRole: (role) => {
        return (req, res, next) => {
            if (req.user) {
                ROLE.findOne({ name: role }).then((role) => {
                    if (!role) {
                        res.redirect('/user/login');
                        return;
                    }

                    let isInRole = req.user.roles.indexOf(role._id) !== -1;
                    if (isInRole) {
                        next();
                    } else {
                        res.redirect('/user/login');
                        return;
                    }
                });
            } else {
                res.redirect('/user/login');
            }
        };
    },

    isActionValid: (req, res, next) => {
        let id = req.params.id;

        PRODUCT.findById(id).then((product) => {
            if (!product) {
                res.redirect(
                    `/?error=${encodeURIComponent('Product was not found!')}`
                );
                return;
            }

            if (product.buyer) {
                res.redirect(
                    `/?error=${encodeURIComponent('This product has a buyer!')}`
                );

                return;
            }

            if (product.creator.equals(req.user._id)) {
                req.product = product;
                next();
            } else {
                isAdmin(req.user).then(() => {
                    req.product = product;
                    next();
                }).catch(() => {
                    res.redirect(
                        `/?error=${encodeURIComponent('You must be author or Admin to do this!')}`
                    );
                });
            }
        }).catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    isBought: (req, res, next) => {
        let id = req.params.id;

        PRODUCT.findById(id).then((product) => {
            if (!product) {
                res.redirect(
                    `/?error=${encodeURIComponent('Product was not found!')}`
                );
                return;
            }

            if (product.buyer) {
                res.redirect(
                    `/?error=${encodeURIComponent('This product has a buyer!')}`
                );

                return;
            }

            req.product = product;
            next();
        }).catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    }
};