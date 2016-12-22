var express = require('express');
var router = express.Router();
//var sha1  =require('sha1');
var mysql = require('mysql');
var md5 = require('md5');
var connection = mysql.createConnection({host: '10.0.6.14', user: 'root', password: '123456', database: 'cop_c'});
connection.connect();

/* GET users listing. */
/*var info={
   userid:'a0bd55120e3c91d6137a7bb1477d22beb8775f51'
}
*/

    var user = 'jkk'
    var xx = '123456'
    var key = 'b4be1c568a6dc02dcaf2849852bdb13e'
    var passwd = md5(xx);
    sql = 'select * from o_users where username="' + user + '" ' + 'and passwd= "' + passwd + '"and `key`="' + key + '"';
    connection.query(sql, function(err, rows, fields) {
        if (err)  throw err;
        console.log('KKKKEEEEYY' + key);
        console.log('UUSSEERR' + user);
        console.log('PPPAAWWSDDD' + passwd);
        console.log('RRRRROOOOWW' + rows);
    });
    /*    if(userid ==info.userid){
      req.session.user = user;
      res.redirect('/home')
    }else{
      res.redirect('/login')
    }
    */
module.exports = router;
