const CATEGORY = require('mongoose').model('Category');

module.exports = {
    addCategoryGet: (req, res) => {
        res.render('category/add');
    },

    addCategoryPost: (req, res) => {
        let category = req.body;
        category.creator = req.user._id;
        CATEGORY.create(category).then((newCategory) => {
            req.user.createdCategories.push(newCategory._id);
            req.user.save().then(() => {
                res.redirect('/');
            });
        }).catch((err) => {
            console.log(err);
            res.sendStatus(404);
        });
    },

    productsByCategory: (req, res) => {
        let categoryName = req.params.category;

        CATEGORY.findOne({ name: categoryName }).populate('products').then((category) => {
            if (!category) {
                res.sendStatus(404);
                return;
            }

            res.render('category/products', { category: category });
        }).catch((err) => {
            console.log(err);
            res.sendStatus(404);
        });
    }
};