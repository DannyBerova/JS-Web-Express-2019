const homeController = require('../controllers/home');
const userController = require('../controllers/user');
const teamController = require('../controllers/team');
const projectController = require('../controllers/project');
//if other controllers - require them
const restrictedPages = require('./auth');

module.exports = (app) => {
    app.get('/', homeController.index);

    //don't forget middlewares from auth for restriction and role
    //Anonymous routes
    app.get('/user/register', userController.registerGet);
    app.post('/user/register', restrictedPages.isAnonymous, userController.registerPost);
    app.get('/user/login', restrictedPages.isAnonymous, userController.loginGet);
    app.post('/user/login', restrictedPages.isAnonymous, userController.loginPost);

    //Auth routes
    app.post('/user/logout', restrictedPages.isAuthed, userController.logout);
    app.get('/user/profile', restrictedPages.isAuthed, userController.profile);
    app.post('/user/profile', restrictedPages.isAuthed, userController.leaveTeam);
    app.get('/team/search', restrictedPages.isAuthed, teamController.search);
    app.get('/project/search', restrictedPages.isAuthed, projectController.search);

    //Admin routes
    app.get('/project/create', restrictedPages.hasRole('Admin'), projectController.addGet);
    app.post('/project/create', restrictedPages.hasRole('Admin'), projectController.addPost);
    app.get('/team/create', restrictedPages.hasRole('Admin'), teamController.addGet);
    app.post('/team/create', restrictedPages.hasRole('Admin'), teamController.addPost);
    app.get('/project/assign', restrictedPages.hasRole('Admin'), projectController.assignGet);
    app.post('/project/assign', restrictedPages.hasRole('Admin'), projectController.assignPost);
    app.get('/team/assign', restrictedPages.hasRole('Admin'), teamController.assignGet);
    app.post('/team/assign', restrictedPages.hasRole('Admin'), teamController.assignPost);

    //User routes
    app.get('/project/all', restrictedPages.hasRole('User'), projectController.all);
    app.get('/team/all', restrictedPages.hasRole('User'), teamController.all);

    app.all('*', (req, res) => {
        res.status(404);
        res.send('404 Not Found');
        res.end();
    });
};