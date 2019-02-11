//if home page has sort or else, require models

module.exports = {
    index: (req, res) => {
        res.render('home/index');
    }
};