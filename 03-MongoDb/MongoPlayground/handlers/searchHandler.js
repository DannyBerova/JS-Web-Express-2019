const mongoose = require('mongoose');
const qs = require('querystring');
const url = require('url');
const fs = require('fs');
const Image = mongoose.model('Image');
const Tag = mongoose.model('Tag');

module.exports = (req, res) => {
  if (req.pathname === '/search' && req.method === 'GET') {
    let params = qs.parse(url.parse(req.url).query);
    
    let inputTags = params.tagName.split(',');

    Tag.find({ name: { $in: inputTags } })
      .then((tags) => {
        
        let tagsIds = tags.map(t => t._id);

        let conditions = { 
          tags: { $in: tagsIds }
        };

        let options = {};
        
        if(params.beforeDate) {
          if(!conditions.hasOwnProperty('creationDate')) {
            conditions['creationDate'] = {};
          }

          conditions['creationDate']['$lt'] = new Date(params.beforeDate);
        } 

        if(params.afterDate) {
          if(!conditions.hasOwnProperty('creationDate')) {
            conditions['creationDate'] = {};
          }

          conditions['creationDate']['$gt'] = new Date(params.afterDate);
        } 

        if(params.Limit) {
          options['limit'] = Number.parseInt(params.Limit);
        }        
        
        Image.find(conditions, null, options)
          .then((images) => {
            fs.readFile('./views/results.html', (err, html) => {
              if(err) {
                throw err;
              }

              let htmlImages = '';

              if (images.length > 0) {
                for (const image of images) {
                  htmlImages += `<fieldset id="${image._id}"> 
                    <legend>${image.title}:</legend> 
                    <img src="${image.url}">
                    </img><p>${image.description}</p>
                    <button onclick='location.href="/delete?id=${image._id}"'class='deleteBtn'>Delete</button> 
                  </fieldset>`;
                }
              } else {
                htmlImages += '<h2>There are no images</h2>';
              }

              html = html.toString().replace("<div class='replaceMe'></div>", htmlImages);

              res.writeHead(200, {
                'Content-Type': 'text/html'
              });
              res.write(html);
              res.end();
            })
          })
          .catch(err => {
            console.log(err);

            res.writeHead(302, {
              'Location': '/'
            });
            res.end();
          });
      });
  } else {
    return true
  }
}
