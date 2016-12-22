var express = require('express');
var router = express.Router();
//var sha1  =require('sha1');
var mysql = require('mysql');
var md5 = require('md5');
var connection = mysql.createConnection({host: '10.0.6.14', user: 'root', password: '123456', database: 'cop_c'});
connection.connect();
router.get('/', function(req, res, next) {
    key = req.query.key;
    if (!key || (key.length !== 32)) {
        res.send('');
    }
    if (req.session.user) {
        res.redirect('/home');
    }
    res.render('login');
});
router.post('/', function(req, res, next) {
    var user = req.body.user;
    var xx = req.body.passwd;
    var passwd = md5(xx);
    sql = 'select showname from o_users where username="' + user + '" ' + 'and passwd= "' + passwd + '"and `key`="' + key + '"';
    connection.query(sql, function(err, rows, fields) {
        if (err)  throw err;
        if (rows.length==0) {
          req.flash('error', '用户密码错误')
          res.redirect('/login?key='+key);
        }else {
            req.session.showname=rows[0].showname;
            req.session.user = user;
            req.flash('success', '登录成功')
            res.redirect('/home?key='+key);
       }
    });

});
module.exports = router;
