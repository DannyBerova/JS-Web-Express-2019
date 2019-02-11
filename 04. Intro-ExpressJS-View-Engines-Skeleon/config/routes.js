const homeController = require('../controllers/home')
const cubeController = require('../controllers/cube')

module.exports = app => {
    app.get('/', homeController.homeGet);
    app.get('/about', homeController.aboutGet);
    app.get('/create', cubeController.createGet);
    app.post('/create', cubeController.createPost);
    app.get('/details/:cubeId', cubeController.details);
    app.get('/search', homeController.search)
    // TODO
};