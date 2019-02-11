const homeController = require('../controllers/home');
const userController = require('../controllers/user');
const carController = require('../controllers/car');
//if other controllers - require them
const restrictedPages = require('./auth');

module.exports = (app) => {
    app.get('/', homeController.index);

    //don't forget middlewares from auth for restriction and role
    app.get('/user/register',  restrictedPages.isAnonymous,  userController.registerGet);
    app.post('/user/register', restrictedPages.isAnonymous, userController.registerPost);
    app.get('/user/login', restrictedPages.isAnonymous, userController.loginGet);
    app.post('/user/login', restrictedPages.isAnonymous, userController.loginPost);
    app.post('/user/logout', restrictedPages.isAuthed, userController.logout);
    app.get('/user/:id', restrictedPages.isAuthed, userController.myRents);

    // app.get('/car/all', carController.allCars);
    // app.get('/search', carController.search);
    // app.get('/car/add', restrictedPages.hasRole('Admin'), carController.addGet);
    // app.post('/car/add', restrictedPages.hasRole('Admin'), carController.addPost);
    // app.get('/car/edit/:id', restrictedPages.hasRole('Admin'), carController.editGet);
    // app.post('/car/edit/:id', restrictedPages.hasRole('Admin'), carController.editPost);
    // app.get('/car/rent/:id', restrictedPages.isAuthed, carController.rentGet);
    // app.post('/car/rent/:id', restrictedPages.isAuthed, carController.rentPost);

    // app.get('/car/out/:id', restrictedPages.hasRole('Admin'), carController.out);
    // app.get('/car/in/:id', restrictedPages.hasRole('Admin'), carController.in);


    app.all('*', (req, res) => {
        res.status(404);
        res.send('404 Not Found');
        res.end();
    });
};