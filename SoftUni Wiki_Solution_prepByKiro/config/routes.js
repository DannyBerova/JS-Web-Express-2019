const controllers = require('../controllers');
const restrictedPages = require('./auth');

module.exports = app => {
    app.get('/', controllers.home.index);
    app.get('/search', controllers.home.search);
    
    app.get('/register', restrictedPages.isAnonymous, controllers.user.registerGet);
    app.post('/register', restrictedPages.isAnonymous, controllers.user.registerPost);
    app.get('/logout', restrictedPages.isAuthed, controllers.user.logout);
    app.get('/login', restrictedPages.isAnonymous, controllers.user.loginGet);
    app.post('/login', restrictedPages.isAnonymous, controllers.user.loginPost);

    app.get('/article/create', restrictedPages.isAuthed, controllers.article.createGet);
    app.post('/article/create', restrictedPages.isAuthed, controllers.article.createPost);
    app.get('/article/all', controllers.article.getAll);
    app.get('/article/details/:id', controllers.article.displayArticle);
    app.get('/article/edit/:id', restrictedPages.isAuthed, controllers.article.editGet);
    app.post('/article/edit/:id', restrictedPages.isAuthed, controllers.article.editPost);
    app.get('/article/history/:id', restrictedPages.isAuthed, controllers.article.getHistory);
    app.get('/article/latest', controllers.article.getLatest);
    app.get('/edit/details/:id', restrictedPages.isAuthed, controllers.article.showEditDetails);

    // Admin routes
    app.get('/article/lock/:id', restrictedPages.hasRole('Admin'), controllers.article.lock);
    app.get('/article/unlock/:id', restrictedPages.hasRole('Admin'), controllers.article.unlock);

    app.all('*', (req, res) => {
        res.status(404);
        res.send('404 Not Found');
        res.end();
    });
};