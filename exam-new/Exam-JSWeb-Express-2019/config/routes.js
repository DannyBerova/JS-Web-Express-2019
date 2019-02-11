const homeController = require('../controllers/home');
const userController = require('../controllers/user');
const teamController = require('../controllers/team');
const projectController = require('../controllers/project');
//if other controllers - require them
const restrictedPages = require('./auth');

module.exports = (app) => {
    app.get('/', homeController.index);

    //don't forget middlewares from auth for restriction and role
    app.get('/user/register', userController.registerGet);
    app.post('/user/register', restrictedPages.isAnonymous, userController.registerPost);
    app.get('/user/login', restrictedPages.isAnonymous, userController.loginGet);
    app.post('/user/login', restrictedPages.isAnonymous, userController.loginPost);
    app.post('/user/logout', restrictedPages.isAuthed, userController.logout);
    // app.get('/user/:id', restrictedPages.isAuthed, userController.myRents);

    app.get('/project/create', restrictedPages.hasRole('Admin'), projectController.addGet);
    app.post('/project/create', restrictedPages.hasRole('Admin'), projectController.addPost);
    app.get('/team/create', restrictedPages.hasRole('Admin'), teamController.addGet);
    app.post('/team/create', restrictedPages.hasRole('Admin'), teamController.addPost);
    // app.get('/car/all', carController.allCars);
    // app.get('/search', carController.search);
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