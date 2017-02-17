/** 获取数据
 * 1 菜单控制
 * 2 服务器时间戳
 * 3 获取游戏服信息
 * 4 获取语言包
 * 5 获取全部当前开服时间
 */
const express = require('express');
const router = express.Router();
const fs = require('fs');
const md5 = require('md5');
const cmdlib = require('../cmd-lib');
const YAML = require('yamljs');
const config = YAML.parse(fs.readFileSync('../config.yml').toString());
router.get('/', function(req, res, next) {
    if (req.query.key != md5(req.query.tm)) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
        console.error('error : err key');
        res.send('');
        return 1;
    }
    if (req.session.lan == "Chinese") {
        var  lanfile = "Chinese.json";
    }
    if (req.session.lan == "English") {
        var  lanfile = "English.json";
    }
    var lan = JSON.parse(fs.readFileSync(__dirname + '/../lang/' + lanfile));

switch (Number(req.query.case)) {
    case 1:
    var username = req.session.user;
    var sql = 'select permissions from o_users where username="' + username + '"';
        cmdlib.run_sql(config.dbip, config.dbuser, config.dbpasswd, config.dbport, config.dbname, sql, 'select', function(r){
        if(r[0].permissions){
            var x = JSON.parse(r[0].permissions);
            var b = x.map(get).distinct();
            var a={};
            for (var i = 0; i < b.length; i++) {
                var e = [];
                for (var u = 0; u < x.length; u++) {
                    if (b[i]==get(x[u])) {
                        e.push(x[u])
                        a[b[i]]=e;
                    }
                }
            }
            res.json(a);
       }else{
            var f = JSON.parse(fs.readFileSync(__dirname + '/../menu/menu.json'));
            res.json(f);
        };
    });
        break;
    case 2:
        let sendJson = {};
        let sql1 = 'select id,username,showname,`key`,permissions from o_users order by id;';
        var men = JSON.parse(fs.readFileSync(__dirname + '/../menu/menu.json'));
        cmdlib.run_sql(config.dbip, config.dbuser, config.dbpasswd, config.dbport, config.dbname, sql1, 'select', function(r) {
                sendJson['users'] = r;
                sendJson['menu'] = men
                res.json(sendJson);
        });
        break;
    case 3:
        let agent_sql = 'select DISTINCT AGENT from t_game_config_variable_copy';
        cmdlib.run_sql(config.ser_dbip, config.ser_dbuser, config.ser_dbpasswd, config.ser_dbport, config.ser_dbname, agent_sql, 'select', function(r) {
           res.json(r);
        });
        break;
    case 4:
        let ser_sql = 'select game_zone_id, GAME_SITE,GAME_HOST,SITE_NAME,AGENT,BIN_DIR,SEVER_STATE from t_game_config_variable_copy where AGENT in (' + req.query.agent + ')';
        cmdlib.run_sql(config.ser_dbip, config.ser_dbuser, config.ser_dbpasswd, config.ser_dbport, config.ser_dbname, ser_sql, 'select', function(r) {
            res.json(r);
        });
        break;
    case 5:
        let ip_sql = 'select id, ip from o_ip';
        cmdlib.run_sql(config.dbip, config.dbuser, config.dbpasswd, config.dbport, config.dbname, ip_sql, 'select', function(r) {
         res.json(r);
        });
        break;
    case 6:
        res.json(JSON.parse(fs.readFileSync(__dirname + '/../lang/' + lanfile )));
        break;
    case 7:
        let zone_sql = 'select game_zone_id,game_site,bin_dir,hot_bin_dir,game_host,game_port,web_port,actcode_port,open_server_date from t_game_config_variable_copy';
        cmdlib.run_sql(config.ser_dbip, config.ser_dbuser, config.ser_dbpasswd, config.ser_dbport, config.ser_dbname, zone_sql, 'select', function(r) {
            res.json(r);
            console.log(r);
        });
        break;
    case 8:
        let agentinfo_sql = 'select agent,login_key,charge_key,default_login_key from t_game_config_constant';
        cmdlib.run_sql(config.ser_dbip, config.ser_dbuser, config.ser_dbpasswd, config.ser_dbport, config.ser_dbname, agentinfo_sql, 'select', function(r) {
            res.json(r);
        });
        break;
    }
});
Array.prototype.in_array = function(e)
{
    for(i=0;i<this.length;i++)
    {
        if(this[i] == e)
            return true;
    }
    return false;
};

function get(x){
    return parseInt(Number(x)/100);
};


Array.prototype.distinct = function () {
    var newArr = [],obj = {};
    for(var i=0, len = this.length; i < len; i++){
        if(!obj[typeof(this[i]) + this[i]]){
            newArr.push(this[i]);
            obj[typeof(this[i]) + this[i]] = 'new';
        }
    }
    return newArr;
};
module.exports = router;
