const Article = require('../models/Article');

module.exports = {
  createGet: (req, res) => {
    res.render('article/create');
    return;
  },
  createPost: async (req, res) => {
    let articleBody = req.body;

    if(!articleBody.title || !articleBody.content){
      articleBody.error = 'Please fill all fields.';
      res.render('article/create', articleBody);
      return;
    }

    articleBody.date = Date.now();
    articleBody.author= req.user._id;

    Article.create(articleBody)
      .then(() => {
        res.redirect('/')
      }).catch((e) => {
        console.log(e);
        articleBody.error = 'Something went wrong, please contact the admins.';
        res.render('article/create');
        return;
      })
  },
  detailsGet: (req, res) => {
    let articleId = req.params.id;

    Article.findById(articleId).populate('author')
      .then((article) => {
        if(!article){
          res.status(404);
          res.render('error/not-found');
          return;
        }
        if(req.user && (req.user.isAuthor(article) || req.user.isInRole('Admin'))){
          article.editable = true;
        }

        res.render('article/details', article);
        return;
      }).catch((e) => {
        res.status(404);
        res.render('error/not-found');
        console.log(e);
        return;
      });
  },
  editGet: (req, res) => {
    let articleId = req.params.id;

    Article.findById(articleId).populate('author')
      .then((article) => {
        if(!article){
          res.status(404);
          res.render('error/not-found')
          return;
        }

        if(req.user.isAuthor(article) || req.user.isInRole('Admin')){
          res.render('article/edit', article);
          return;
        } else {
          res.status(401);
          res.render('error/unauthorized');
          return;
        }
      }).catch((error) => {
        console.log(error);
        res.status(404);
        res.render('error/not-found');
        return;
      })
  },
  editPost: (req, res) => {
    let articleId = req.params.id;
    let articleBody = req.body;

    if(!articleBody.title || !articleBody.content){
      articleBody.error = 'Pleasefill all fields.';
      res.render('article/edit', articleBody);
      return;
    }

    Article.findById(articleId).populate('author')
      .then((article) =>{
        if(!article){
          res.status(404);
          res.render('error/not-found')
          return;
        }

        if(req.user.isAuthor(article) || req.user.isInRole('Admin')){
          article.title = articleBody.title;
          article.content = articleBody.content;

          article.save();
          res.redirect('/');
          return;
        } else {
          res.status(401);
          res.render('error/unauthorized');
          return;
        }
      }).catch((error) => {
        console.error(error);
        res.status(404);
        res.render('error/not-found');
        return;
      })
  },
  deletePost: (req, res) => {
    let articleId = req.params.id;

    Article.findById(articleId).populate('author')
      .then((article) =>{
        if(!article){
          res.status(404);
          res.render('error/not-found')
          return;
        }

        if(req.user.isAuthor(article) || req.user.isInRole('Admin')){
          Article.findByIdAndRemove(articleId).exec();
          res.redirect('/');
          return;
        } else {
          res.status(401);
          res.render('error/unauthorized');
          return;
        }
      }).catch((error) => {
        console.error(error);
        res.status(404);
        res.render('error/not-found');
        return;
      })
  },
}
