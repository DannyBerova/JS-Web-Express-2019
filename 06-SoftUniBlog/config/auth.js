module.exports = {
  isAuthed: (req, res, next) => {
      if (req.user) {
          next();
      } else {
          res.redirect('/user/login');
      }
  },
  isNotAuthed: (req, res, next) => {
      if (!req.user) {
          next();
      } else {
          res.redirect('/');
      }
  },
  hasRole: (role) => (req, res, next) => {
      if (req.user &&
          req.user.roles.indexOf(role) > -1) {
          next();
      } else {
          res.redirect('/user/login');
      }
  }
}
