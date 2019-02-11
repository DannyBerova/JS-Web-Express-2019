const CATEGORY = require('mongoose').model('Category');
const PRODUCT = require('mongoose').model('Product');
const ROLE = require('mongoose').model('Role');
const FS = require('fs');

function editProduct(product, editedProduct) {
    if (product.category.toString() !== editedProduct.category) {
        return new Promise((resolve, reject) => {
            Promise.all([
                CATEGORY.update({ _id: product.category }, { $pull: { products: product._id } }),
                CATEGORY.update({ _id: editedProduct.category }, { $push: { products: product._id } })
            ]).then(() => {
                product.category = editedProduct.category;
                product.save();
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    }

    return new Promise((resolve, reject) => {
        product.save();
        resolve();
    });
}

function isAdmin(user) {
    ROLE.findOne({ name: 'Admin' }).then((role) => {
        if (!role) {
            return false;
        }

        let isAdmin = user.roles.indexOf(role._id) !== -1;
        return isAdmin;
    });
}

module.exports = {
    addProductGet: (req, res) => {
        CATEGORY.find({}).then((categories) => {
            res.render('product/add', { categories: categories });
        }).catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    addProductPost: (req, res) => {
        let productObj = req.body;
        productObj.image = `/images/${req.file.filename}`;
        productObj.creator = req.user._id;

        PRODUCT.create(productObj).then((insertedProduct) => {
            CATEGORY.findById(insertedProduct.category).then((category) => {
                category.products.push(insertedProduct._id);
                category.save().then(() => {
                    req.user.createdProducts.push(insertedProduct._id);
                    req.user.save();
                    res.redirect('/');
                });
            }).catch((err) => {
                console.log(err);
                res.sendStatus(400);
            });
        }).catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    editProductGet: (req, res) => {
        CATEGORY.find({}).then((categories) => {
            res.render('product/edit', {
                product: req.product,
                categories: categories
            });
        }).catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    editProductPost: (req, res) => {
        let editedProduct = req.body;

        req.product.name = editedProduct.name;
        req.product.description = editedProduct.description;
        req.product.price = editedProduct.price;

        if (req.file) {
            let imageName = req.product.image.split('/').pop();
            FS.unlink(`./content/images/${imageName}`, (err) => {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                    return;
                }

                req.product.image = `/images/${req.file.filename}`;

                editProduct(req.product, editedProduct).then(() => {
                    res.redirect(
                        `/?success=${encodeURIComponent('Product was edited successfully!')}`
                    );
                }).catch((err) => {
                    console.log(err);
                    res.redirect(
                        `/?error=${encodeURIComponent('Product was not edited!')}`
                    );
                });
            });
        } else {
            editProduct(req.product, editedProduct).then(() => {
                res.redirect(
                    `/?success=${encodeURIComponent('Product was edited successfully!')}`
                );
            }).catch((err) => {
                console.log(err);
                res.redirect(
                    `/?error=${encodeURIComponent('Product was not edited!')}`
                );
            });
        }
    },

    deleteProductGet: (req, res) => {
        res.render('product/delete', {
            product: req.product
        });
    },

    deleteProductPost: (req, res) => {
        let id = req.params.id;

        PRODUCT.findByIdAndRemove(id).then((removedProduct) => {
            CATEGORY.update({ _id: removedProduct.category }, { $pull: { products: removedProduct._id } }).then(() => {
                let imageName = removedProduct.image.split('/').pop();
                FS.unlink(`./content/images/${imageName}`, (err) => {
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                        return;
                    }

                    let boughtProductsIndex = req.user.boughtProducts.indexOf(id);
                    let createdProductsIndex = req.user.createdProducts.indexOf(id);

                    if (boughtProductsIndex > -1) {
                        req.user.boughtProducts.splice(boughtProductsIndex, 1);
                    }

                    if (createdProductsIndex > -1) {
                        req.user.createdProducts.splice(createdProductsIndex, 1);
                    }

                    req.user.save().then(() => {
                        res.redirect(
                            `/?success=${encodeURIComponent('Product was deleted successfully!')}`
                        );
                    });
                });
            });
        });
    },

    buyProductGet: (req, res) => {
        res.render('product/buy', {
            product: req.product
        });
    },

    buyProductPost: (req, res) => {
        let id = req.params.id;

        req.product.buyer = req.user._id;
        req.product.save().then(() => {
            req.user.boughtProducts.push(id);
            req.user.save().then(() => {
                res.redirect('/');
            });
        });
    }
};