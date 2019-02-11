const Article = require('../models/Article');

module.exports = {
  index: (req, res) => {
    Article.find().populate('author').then((articles) => {

      for(let article of articles){
        let content = article.content.slice(0, 300);
        content += '...';
        article.content = content;
      }

      res.render('home/index', {articles});
    }).catch((e) => {
      console.log(e);
      res.render('home/index', {});
    })
  }
}
