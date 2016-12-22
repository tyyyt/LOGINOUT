module.exports = function (app) {
  app.get('/', function (req, res) {
  if (!req.session.user) {
    res.redirect('/login');
  }
  if (req.session.user) {
    res.redirect('/home');
  }
  });
  app.use('/login', require('./login'));
  app.use('/home', require('./home'));
  app.use('/logout', require('./logout'));

  // 404 page
  app.use(function (req, res) {
    if (!res.headersSent) {
      res.render('404');
    }
  });
};
