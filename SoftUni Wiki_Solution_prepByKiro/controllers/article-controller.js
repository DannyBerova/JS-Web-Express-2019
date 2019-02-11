const Article = require('../models/Article');
const Edit = require('../models/Edit');
const User = require('../models/User');
const passport = require('passport');
const session = require('express-session')

function validateArticle(article) {
  let errors = [];

  if (article.title === "") {
    errors.push('Title is required!');
  }

  if (article.content === "") {
    errors.push('Content is required!');
  }

  if (errors.length > 0) {
    return errors;
  }

  return false;
}

module.exports = {
  createGet: (req, res) => {
    res.flash('error', 'Price per Day must be a positive number!')
    res.render('article/create');
  },
  createPost: (req, res) => {
    const articleData = req.body;
    const editData = {
      author: req.user._id,
      content: articleData.content
    }
    const errors = validateArticle(articleData);
    if (errors) {
      res.locals.globalError = errors.join('\n');
      res.render('article/create');
      return;
    }

    Promise.all([ Article.create(articleData), Edit.create(editData) ])
      .then(([ article, edit ]) => {
          edit.article = article._id;
          article.edits.push(edit._id);
          req.user.edits.push(edit._id);

          return Promise.all([ 
            User.findByIdAndUpdate(req.user._id, req.user),
            Article.findByIdAndUpdate(article._id, article),
            Edit.findByIdAndUpdate(edit._id, edit) 
          ]);
      })
      .then(() => {
        res.redirect('/');
      })
      .catch(console.error);
  },
  getAll: (req, res) => {
    Article.find({})
      .sort({ title: 'ascending' })
      .select('_id title')
      .then((articleTitles) => {
        res.render('article/all', { titles: articleTitles})
      })
      .catch(console.error);
  },
  displayArticle: (req, res) => {
    // if(req.user && req.locals.isAdmin) {
    //   req.locals.isAdmin = req.user.isAdmin
    // }
    Article.findById(req.params.id)
      .populate('edits')
      .then((article) => {
        if(article.isLocked) {
          res.locals.isLockedArt = true;
        } else {
          res.locals.isLockedArt = false;
        }
        const edits = article.edits;
        let splitedContent = edits[edits.length - 1].content
          .split('\r\n\r\n');
        article.splitedContent = splitedContent;
        res.render('article/details', article);
      })
      .catch(console.warn);
  },
  editGet: (req, res) => {
    Article.findById(req.params.id)
      .populate({
        path: 'edits'
      })
      .then((article) => {
        if (article.isLocked && req.user.roles.indexOf('Admin') === -1) {
          req.flash('Article is locked!');
          res.redirect('/');
          return;
        }

        article.content = article.edits[article.edits.length - 1].content;
        res.render('article/edit', article);
      })
      .catch(console.error);
  },
  editPost: (req, res) => {
    const articleId = req.params.id;
    const newContent = req.body.content;
    const editBody = {
      author: req.user._id,
      content: newContent,
      article: articleId
    }

    Promise.all([Article.findById(articleId), Edit.create(editBody)])
      .then(([a, e]) => {
        req.user.edits.push(e._id);
        a.edits.push(e._id);

        return Promise.all([
          User.findByIdAndUpdate(req.user._id, req.user),
          Article.findByIdAndUpdate(a._id, a)
        ])
      })
      .then(() => {
        res.redirect(`/article/history/${articleId}`);
      })
      .catch(console.error);
  },
  getHistory: (req, res) => {
    const articleId = req.params.id;

    Article.findById(articleId)
      .populate({ 
        path: 'edits', 
        options: { 
          populate: { path: 'author' }, 
          sort: { 'creationDate': -1 } 
        } 
      })
      .then((article) => {
        res.render('article/history', article);
      })
      .catch(console.error);
  },
  lock: (req, res) => {
    Article.findById(req.params.id)
      .then((a) => {
        a.isLocked = true;
        a.save().then(() => {
          res.redirect(`/article/details/${a._id}`);
        });
      })
      .catch(console.error);
  },
  unlock: (req, res) => {
    Article.findById(req.params.id)
      .then((a) => {
        a.isLocked = false;
        a.save().then(() => {
          res.redirect(`/article/details/${a._id}`);
        })
      })
      .catch(console.error);
  },
  getLatest: (req, res) => {
    Article
      .find({})
      .sort({ creationDate: 'descending' })
      .limit(1)
      .populate('edits')
      .then((articles) => {
        const latestArticle = articles[0];
        const edits = latestArticle.edits;
        let splitedContent = edits[edits.length - 1].content
          .split('\r\n\r\n');
        latestArticle.splitedContent = splitedContent;
        res.render('article/details', latestArticle);
      })
      .catch(console.error);
  },
  showEditDetails: (req, res) => {
    Edit.findById(req.params.id)
      .then((e) => {
        e.splitedContent = e.content.split('\r\n\r\n');

        res.render('article/edit-details', e);
      })
      .catch(console.error);
  }
}