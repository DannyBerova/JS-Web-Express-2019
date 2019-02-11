const PRODUCT = require('mongoose').model('Product');

module.exports = {
    index: (req, res) => {
        if (req.query.query) {
            PRODUCT
                .find({ 'name': { '$regex': `${req.query.query.toLowerCase()}`, '$options': 'i' }, buyer: null })
                .populate('category')
                .then((products) => {
                    let data = { products: products };

                    if (req.query.error) {
                        data.error = req.query.error;
                    } else if (req.query.success) {
                        data.success = req.query.success;
                    }

                    res.render('home/index', data);
                }).catch((err) => {
                    console.log(err);
                    res.sendStatus(400);
                });
        } else {
            PRODUCT.find({ buyer: null }).populate('category').then((products) => {
                let data = { products: products };

                if (req.query.error) {
                    data.error = req.query.error;
                } else if (req.query.success) {
                    data.success = req.query.success;
                }

                res.render('home/index', data);
            }).catch((err) => {
                console.log(err);
                res.sendStatus(400);
            });
        }
    }
};