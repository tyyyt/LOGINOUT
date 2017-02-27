const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const fs = require('fs');
const YAML = require('yamljs');
const cmdlib = require('../cmd-lib');
const config = YAML.parse(fs.readFileSync('../config.yml').toString());

function getLang() {
    let lang;
    try {
        lang = fs.readdirSync(__dirname + '/../lang')
    } catch (e) {
        console.error(e);
        return ['error'];
    }
    return lang;
}

function in_array(obj,ip){
    let i = obj.length;
    while (i--) {
        if (obj[i].ip === ip) {
            return true;
        }
    }
    return false;
}
router.get('/', function(req, res) {
    let ipsql = 'select ip from o_ip;';
    cmdlib.run_sql(config.dbip, config.dbuser, config.dbpasswd, config.dbport, config.dbname, ipsql, 'select', function(r) {
        if (r.length !== 0) {
           if(!in_array(r,req.connection.remoteAddress.split(':')[3])){
               res.send('');
               return 1;
           }
        }
        if (req.query.key) {
            if (req.session.user) {
                res.redirect('/home');
            } else {
                let lis = getLang();
                let list = [];
                for (let i = 0; i < lis.length; i++) {
                    list.push(lis[i].split('.json')[0]);
                }
                res.render('login', {list: list});
            }
        } else {
            res.send('');
        }
    });

});

router.post('/', function(req, res) {
var user = req.body.user;
var passwd = req.body.passwd;
var lan = req.body.lan;
var key = req.body.key;
let sql = 'select showname,permissions from o_users where username="' + user + '" ' + 'and passwd= "' + passwd + '"and `key`="' + key + '"';
cmdlib.run_sql(config.dbip, config.dbuser, config.dbpasswd, config.dbport, config.dbname, sql, 'select', function(r) {
    if (r.length == 0) {
        res.json({'logstatus': 'no'});
    } else {
        req.session.showname = r[0].showname;
        req.session.user = user;
        console.log(req.session.user);
        req.session.lan = lan;
        res.json({'logstatus': 'yes'});
    }
});

});
module.exports = router;
