const mongoose = require('mongoose');
const formidable = require('formidable');
const Tag = mongoose.model('Tag');

module.exports = (req, res) => {
  if (req.pathname === '/generateTag' && req.method === 'POST') {
    const form = formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
      if(err) {
        console.log(err);
        return;
      }
      

      if(fields.tagName) {
        Tag.findOne({ name: fields.tagName }, (err, tag) => {
          
          if(err || tag) {
            console.log('Tag already exist!');

            res.writeHead(302, {
              'Location': '/'
            });
            res.end();
            
            return;
          }
  
          Tag.create({
            name: fields.tagName,
            images: []
          }).then((value) => {
            
            res.writeHead(302, {
              'Location': '/'
            });
            res.end();
          });       
        });          
      }
    });
  } else {
    return true
  }
}
