const formidable = require('formidable');
const qs = require('querystring');
const path = require('path');
const url = require('url');
const fs = require('fs');
const shortId = require('shortid');
const Meme = require('../models/MemeSchema');

function viewAll(req, res) {
  const filePath = './views/viewAll.html';

  const rs = fs.createReadStream(filePath);

  let html = '';

  rs.on('readable', () => {
    let chunk;
    while (null !== (chunk = rs.read())) {
      html += chunk;
    }
  });

  rs.on('end', () => {
    Meme.find({
      privacy: true
    }).then((memes) => {
      let memeHtml = '';

      for (const meme of memes) {
        memeHtml +=
          `<div class="meme">
            <a href="/getDetails?id=${meme.id}">
            <img class="memePoster" src="${meme.memeSrc}"/>          
          </div>`;
      }

      html = html.replace('<div id="replaceMe">{{replaceMe}}</div>', memeHtml);

      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.write(html);
      res.end();
    });
  });
}

function viewAddMeme(req, res) {
  const filePath = './views/addMeme.html';

  const rs = fs.createReadStream(filePath);

  rs.pipe(res);
}

function addMeme(req, res) {
  const form = formidable.IncomingForm();
  let fields = {};

  form.parse(req);

  form.on('fileBegin', function (name, file) {
    if (file.name) {
      file.name = shortId.generate() + '.' + file.name.split('.')[1];
      file.path = path.normalize(path.join(__dirname, '../public/memeStorage/', file.name));
    }
  });

  form.on('file', function (name, file) {
    if (file.size > 0) {
      fields.memeSrc = path.join('/public/memeStorage/', file.name);
    }
  });

  form.on('field', (name, value) => {
    fields[name] = value;
  });

  form.on('end', () => {
    fields.privacy = fields.privacy !== undefined;

    const fieldsErr = validateFields(fields);
    if (fieldsErr) {
      console.log(fieldsErr);
      res.writeHead(302, {
        'Location': '/'
      });
      res.end();
      return;
    }

    Meme.create(fields)
      .then(() => {
        res.writeHead(302, {
          'Location': '/'
        });
        res.end();
      })
      .catch(console.log);
  })
}

function validateFields(fields) {
  if (!fields.title) {
    return 'Title is required';
  } else if (!fields.memeSrc) {
    return 'Meme file is required';
  } else if (typeof fields.privacy === String) {
    return 'Privacy is required';
  }

  return null;
}

function getDetails(req, res) {

  const params = qs.parse(url.parse(req.url).query);

  if (!params.id) {
    console.log("Invalid ID!");

    res.writeHead(302, {
      'Location': '/'
    });
    res.end();
    return;
  }

  const filePath = './views/details.html';

  const rs = fs.createReadStream(filePath);

  let html = '';

  rs.on('readable', () => {
    let chunk;
    while (null !== (chunk = rs.read())) {
      html += chunk;
    }
  });

  rs.on('end', () => {
    Meme.findById(params.id)
      .then((meme) => {
        let memeHtml =
          `<div class="content">
            <img src="${meme.memeSrc}" alt=""/>
            <h3>Title ${meme.title}</h3>
            <p> ${meme.description}</p>
          </div>`;

        html = html.replace('<div id="replaceMe">{{replaceMe}}</div>', memeHtml);

        res.writeHead(200, {
          'Content-Type': 'text/html'
        });
        res.write(html);
        res.end();
      })
      .catch(err => {
        console.log("Invalid ID!");

        res.writeHead(302, {
          'Location': '/'
        });
        res.end();
      });
  });
}

module.exports = (req, res) => {
  if (req.pathname === '/viewAllMemes' && req.method === 'GET') {
    viewAll(req, res)
  } else if (req.pathname === '/addMeme' && req.method === 'GET') {
    viewAddMeme(req, res)
  } else if (req.pathname === '/addMeme' && req.method === 'POST') {
    addMeme(req, res)
  } else if (req.pathname.startsWith('/getDetails') && req.method === 'GET') {
    getDetails(req, res)
  } else if (req.pathname.startsWith('public/memeStorage') && req.method === 'GET') {
    console.log('HERE')
  } else {
    return true
  }
}