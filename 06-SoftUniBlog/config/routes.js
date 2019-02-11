const auth = require('./auth')
const homeController = require('../controllers/home');
const userController = require('../controllers/user');
const articleController = require('../controllers/article')

module.exports = (app) => {
    app.get('/', homeController.index);
    app.get('/user/register', auth.isNotAuthed, userController.registerGet);
    app.post('/user/register', auth.isNotAuthed, userController.registerPost);

    app.get('/user/login', auth.isNotAuthed, userController.loginGet);
    app.post('/user/login', auth.isNotAuthed, userController.loginPost);

    app.get('/user/logout', auth.isAuthed, userController.logout);


    app.get('/article/create', auth.isAuthed, articleController.createGet);
    app.post('/article/create', auth.isAuthed, articleController.createPost);
    app.get('/article/details/:id', articleController.detailsGet);
    app.get('/article/edit/:id', auth.isAuthed, articleController.editGet);
    app.post('/article/edit/:id', auth.isAuthed, articleController.editPost);
    app.get('/article/delete/:id', auth.isAuthed, articleController.deletePost);

    app.all('*', (req, res) => {
        res.status(404);
        res.send('404 Not Found');
        res.end();
    });
};
