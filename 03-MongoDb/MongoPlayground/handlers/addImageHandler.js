const mongoose = require('mongoose');
const formidable = require('formidable');
const validUrl = require('valid-url');
const url = require('url');
const qs = require('querystring');
const Image = mongoose.model('Image');
const Tag = mongoose.model('Tag');

function addImage(req, res) {
  const form = formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {    
    if(err) {
      console.log(err);
      res.writeHead(302, {
        'Location': '/'
      });
      res.end();
      return;
    }
    
    const fieldsErr = validateFields(fields);
    if(fieldsErr) {
      console.log(fieldsErr);
      res.writeHead(302, {
        'Location': '/'
      });
      res.end();
      return;
    }
    
    let tags = fields.tagsID
      .split(',')
      .reduce((acc, cur) => {
        if(cur && !acc.includes(cur)) {
          acc.push(cur);
        }

        return acc;        
      }, []);

    const tagsErr = validateTags(tags);
    if(tagsErr) {
      console.log(tagsErr);
      res.writeHead(302, {
        'Location': '/'
      });
      res.end();
      return;
    }

    Image.create({
      url: fields.imageUrl,
      title: fields.imageTitle,
      description: fields.description,
      tags
    }).then((value) => {
      tags.forEach((tagId) => {
        Tag.findById(tagId, (err, tag) => {
          if(err) {
            console.log(err);
            return;
          }

          if(tag) {
            tag.images.push(value._id);
            tag.save();
          }
        });
      });

      res.writeHead(302, {
        'Location': '/'
      });
      res.end();
    });
  });
}

function deleteImg(req, res) {
  const params = qs.parse(url.parse(req.url).query);
  const imageId = params.id;
  debugger;
  Image.findByIdAndDelete(imageId, (err, image) => {
    if(err) {
      console.log(err);
      res.end();
      return;
    }

    const tagsIds = image.tags;

    for (const tagId of tagsIds) {
      Tag.findById(tagId, (err, tag) => {
        if(err) {
          console.log(err);
          res.end();
          return;
        }

        tag.images = tag.images.filter((id) => {
          return id.toString() !== imageId;
        });
        tag.save();
      });
    }

    res.writeHead(302, {
      'Location': '/'
    });
    res.end();
  });
}

function validateFields(fields) {
  if(!fields.imageUrl) {
    return "Image URL is required!";
  } else if(!validUrl.isWebUri(fields.imageUrl)) {
    return "Image URL is invalid!"
  } else if (!fields.imageTitle) {
    return "Image Title is required!";
  } else if (!fields.tagsID) {
    return "Image Tags are required!";
  }

  return null;
}

function validateTags(tags) {
  let isInvalid = false;

  for (const tagId of tags) {
    Tag.findById(tagId, (err, tag) => {
      if(err || !tag) {
        isInvalid = true;
      }
    });
    if(isInvalid) {
      break;
    }
  }

  return isInvalid;
}

module.exports = (req, res) => {
  if (req.pathname === '/addImage' && req.method === 'POST') {
    addImage(req, res)
  } else if (req.pathname === '/delete' && req.method === 'GET') {
    deleteImg(req, res)
  } else {
    return true
  }
}
