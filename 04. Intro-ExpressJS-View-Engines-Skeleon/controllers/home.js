const Cube = require('../models/Cube');

function handleQueryErrors(from, to) {

  let fromNum = Number(from);
  let toNum = Number(to);
  let errors = [];

  if (from && (fromNum < 1 || fromNum > 6)) {
    errors.push('FROM must be between 1 and 6.');
  }

  if (to && (toNum < 1 || toNum > 6)) {
    errors.push('TO must be between 1 and 6.');
  }

  if (from && to && fromNum > toNum) {
    errors.push('FROM must be lower than TO.')
  }

  return errors;
}

module.exports = {
  homeGet: (req, res) => {

    Cube.find()
      .select('_id name imageUrl difficulty')
      .then((cubes) => {
        res.render('index', {
          cubes: cubes
        });
      })
      .catch((e) => console.log(e.message))

  },
  aboutGet: (req, res) => {
    res.render('about');
  },
  search: async (req, res) => {
    let {
      name,
      from,
      to
    } = req.query;
    let errors = handleQueryErrors(from, to);

    if (errors.length > 0) {
      res.locals.globalErrors = errors;
      try {
        const cubes = await Cube.find();
        res.render('index', {
          cubes: cubes
        });
      } catch (err) {
        console.log(err)
      }
    } else {
      let query = Cube.find({}).select('id name imageUrl difficulty');

      if (from) {
        query.where('difficulty').gte(from);
      }

      if (to) {
        query.where('difficulty').lte(to);
      }

      query.then((cubes) => {
          cubes = cubes.filter(cube =>
            cube.name.toLowerCase().includes(name.toLowerCase()));
          res.render('index', {
            cubes
          });
        })
        .catch(err => {
          console.log(err);
        })
    }
  }
}