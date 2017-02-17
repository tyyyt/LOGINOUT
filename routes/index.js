module.exports = function(app) {
    app.get('/', function(req, res) {
        // if (!req.session.user) {
        //   res.redirect('/login');
        // }
        if (req.session.user) {
            res.redirect('/home');
        }
    });
    app.use('/login', require('./login'));
    app.use('/home', require('./home'));
    app.use('/logout', require('./logout'));
    //app.use('/chpasswd', require('./chpasswd'));
    app.use('/getdata', require('./getdata'));
    app.use('/showpage', require('./showpage'));
    app.use('/cmd', require('./cmd'));

};
