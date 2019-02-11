const Article = require('../models/Article');

module.exports = {
    index: (req, res) => {
         Article.find({})
            .sort({ creationDate: 'descending' })
            .limit(3)
            .then((articles) => {
                const lastArticle = articles[0];
                if (!lastArticle) {
                    res.render('home/index', {
                        title: 'No title',
                        content: 'No content'
                    });
                    return;
                }

                const context = {
                    title: lastArticle.title,
                    content: lastArticle.content
                        .split(' ')
                        .slice(0, 50)
                        .join(' '),
                    _id: lastArticle._id,
                    latest: articles.map(a => { return { _id: a._id, title: a.title } })
                }

                res.render('home/index', context);
            })
            .catch(console.error);
    },
    search: (req, res) => {
        const query = req.query.query;
        
        Article.find({ })
            .then((articles) => {
                const filteredArticles = articles.filter((a) => {
                    return a.title.toLowerCase().includes(query.toLowerCase());
                });
                const context = {
                    query: query,
                    articles: filteredArticles
                };

                res.render('home/search', context);
            })
            .catch(console.error);
    }
};