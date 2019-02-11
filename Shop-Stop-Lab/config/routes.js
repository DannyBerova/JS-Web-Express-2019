const HOME_CONTROLLER = require('../controllers/home');
const USER_CONTROLLER = require('../controllers/user');
const PRODUCT_CONTROLLER = require('../controllers/product');
const CATEGORY_CONTROLLER = require('../controllers/category');
const MULTER = require('multer');
const AUTH = require('./auth');

let upload = MULTER({ dest: './content/images' });

module.exports = (APP) => {
    APP.get('/', HOME_CONTROLLER.index);

    APP.get('/user/register', USER_CONTROLLER.registerGet);
    APP.post('/user/register', USER_CONTROLLER.registerPost);

    APP.get('/user/login', USER_CONTROLLER.loginGet);
    APP.post('/user/login', USER_CONTROLLER.loginPost);

    APP.post('/user/logout', AUTH.isAuth, USER_CONTROLLER.logout);

    APP.get('/product/add', AUTH.isAuth, PRODUCT_CONTROLLER.addProductGet);
    APP.post('/product/add', AUTH.isAuth, upload.single('image'), PRODUCT_CONTROLLER.addProductPost);

    APP.get('/product/edit/:id', AUTH.isAuth, AUTH.isActionValid, PRODUCT_CONTROLLER.editProductGet);
    APP.post('/product/edit/:id', AUTH.isAuth, upload.single('image'), AUTH.isActionValid, PRODUCT_CONTROLLER.editProductPost);

    APP.get('/product/delete/:id', AUTH.isAuth, AUTH.isActionValid, PRODUCT_CONTROLLER.deleteProductGet);
    APP.post('/product/delete/:id', AUTH.isAuth, AUTH.isActionValid, PRODUCT_CONTROLLER.deleteProductPost);

    APP.get('/product/buy/:id', AUTH.isAuth, AUTH.isBought, PRODUCT_CONTROLLER.buyProductGet);
    APP.post('/product/buy/:id', AUTH.isAuth, AUTH.isBought, PRODUCT_CONTROLLER.buyProductPost);

    APP.get('/category/add', AUTH.isInRole('Admin'), CATEGORY_CONTROLLER.addCategoryGet);
    APP.post('/category/add', AUTH.isInRole('Admin'), CATEGORY_CONTROLLER.addCategoryPost);
    APP.get('/category/:category/products', CATEGORY_CONTROLLER.productsByCategory);
};