/** CMD list
  * 1 change server time
  * 2 start server
  * 3 stop server
  * 4 server nohup log
  * 6 server open time
  * 7 server file log
*/
'use strict';

const fs = require('fs');
const express = require('express');
const router = express.Router();
const md5 = require('md5');
const cmdlib = require('../cmd-lib');
const YAML = require('yamljs');
const config = YAML.parse(fs.readFileSync('../config.yml').toString());
const request = require('request');
const  gop_port = config.gop_port;



/* GET CMD */
router.post('/', function(req, res) {
    let reqcmd = Number(req.body._cmd);
    switch (reqcmd) {
        case 1:
            let oldpass = req.body.oldpass;
            let newpd = req.body.newpd;
            let username = req.session.user;
            let sesql = 'select  username from o_users where  username="' + username + '"and passwd ="' + oldpass + '";'
            cmdlib.run_sql(config.dbip, config.dbuser, config.dbpasswd, config.dbport, config.dbname, sesql, 'select', function(r) {
                if (r.length != 0) {
                    let chsql = 'update  o_users set passwd="' + newpd + '" where username="' + username + '"';
                    cmdlib.run_sql(config.dbip, config.dbuser, config.dbpasswd, config.dbport, config.dbname, chsql, 'update', function(r) {
                        if (r == 0) {
                            res.json({"status": 'ok'});
                        } else {
                            res.json({"status": 'fail'});
                        }
                    });
                } else {
                    res.json({"status": 'no'});
                }
            });

            break;
        case 2:
            let usernamee = req.body.username;
            let showname = req.body.showname;
            let passwd = req.body.passwd;
            let key = req.body.key;
            let per = req.body.per;
            console.log(per);
            let sql = 'INSERT INTO o_users (username,passwd,showname,`key`,permissions) values ("' + usernamee + '","' + passwd + '","' + showname + '","' + key + '","' + per + '")';
            cmdlib.run_sql(config.dbip, config.dbuser, config.dbpasswd, config.dbport, config.dbname, sql, 'insert', function(r) {
                if (r == 0) {
                    res.json({'status': 'yes'});
                } else {
                    res.json({'status': r.code});
                }

            });
            break;
        case 3:
            let delname = req.body.delname;
            let del_sql = 'Delete from o_users where id in (' + delname + ')';
            cmdlib.run_sql(config.dbip, config.dbuser, config.dbpasswd, config.dbport, config.dbname, del_sql, 'delete', function(r) {
                if (r == 0) {
                    res.json({'status': 'yes'});
                } else {
                    res.json({'status': r.code});
                }
            });
            break;
        case 4:
            let  chaname = req.body.chaname;
            let  passwwd = req.body.passwd;
            let cha_sql = 'update o_users  set  passwd="' + passwwd + '"where id in (' + chaname + ')';
            cmdlib.run_sql(config.dbip, config.dbuser, config.dbpasswd, config.dbport, config.dbname, cha_sql, 'update', function(r) {
                if (r == 0) {
                    res.json({'status': 'yes'});
                } else {
                    res.json({'status': r.code});
                }
            });
            break;
        case 5:
            let perr = req.body.per;
            let userID = req.body.peruser;
            let per_sql = ' update o_users set permissions ="' + perr + '"where id in (' + userID + ')';
            cmdlib.run_sql(config.dbip, config.dbuser, config.dbpasswd, config.dbport, config.dbname, per_sql, 'update', function(r) {
                if (r == 0) {
                    res.json({'status': 'yes'});
                } else {
                    res.json({'status': r.code});
                }
            });
            break;
        case 6:
             let ssql = 'UPDATE t_game_config_variable_copy SET SEVER_STATE ="' +  req.body.state + '"WHERE game_zone_id in ('+ req.body.zoneid + ')';
            cmdlib.run_sql(config.ser_dbip, config.ser_dbuser, config.ser_dbpasswd, config.ser_dbport, config.ser_dbname, ssql, 'update', function(r) {
                if (r == 0) {
                    res.json({'status': 'yes'});
                } else {
                    res.json({'status': r.code});
                }
            });
             break;
       case 7:
            let keysql = 'UPDATE o_users SET `key` ="' +  req.body.keyinfo + '" WHERE username in ('+ req.body.users + ')';
            cmdlib.run_sql(config.dbip, config.dbuser, config.dbpasswd, config.dbport, config.dbname, keysql, 'update', function(r) {
               if (r == 0) {
                   res.json({'status': 'yes'});
               } else {
                   res.json({'status': r.code});
               }
           });
            break;
        case 8:
            let st_server = req.body.server.split(',');
            let form = {};
            for (let i = 0; i < st_server.length; i++) {
                let dirstop_sql = 'select GAME_HOST, BIN_DIR from  t_game_config_variable_copy where GAME_SITE = "' + st_server[i]  +'"';
                console.log(dirstop_sql);
                cmdlib.run_sql(config.ser_dbip, config.ser_dbuser, config.ser_dbpasswd, config.ser_dbport, config.ser_dbname, dirstop_sql, 'select', function(r) {
                    console.log(r);
                    console.log(req.body.mod);
                    var server = r[0].GAME_HOST;
                    var dir = r[0].BIN_DIR;
                    var form;
                    if(req.body.mod == 'start'){
                        var form = {cmd: 1, dir: dir};
                    }
                    if(req.body.mod == 'stop'){
                        var form = {cmd: 2, dir:dir};
                    }
                    if(req.body.mod == 'sql'){
                        var form = {cmd: 6, sql:req.body.sql}
                    }
                    if(req.body.mod == 'shell'){
                        var form = {cmd: 7, shell:req.body.shell}
                    }
                    request.post({
                        url:'http://' + server + ':' + config.gop_port + '/',
                        form
                    }, function(err,httpResponse,body){
                        if(JSON.parse(body).repo == 'success'){
                             res.json({'status': 'ok'});
                        }
                        if(httpResponse.statusCode == 500){
                            // res.json({'status': 'no'});
                            console.log('500');
                        }
                        if(err){
                            console.log(err);
                        }
                    });

                   console.log(form);
                });
            }
            break;
    case 9:
         let server = req.body.server.split(',');
         let run_sql = req.body.sql;
            console.log(run_sql);
        for (var i = 0; i < server.length; i++) {
            // cmdlib.run_sql(server[i], config.dbuser, config.dbpasswd, config.dbport, config.dbname, run_sql, req.body.mod, function(r) {
            //    console.log(server[i]);
            //
            // });
            console.log(server[i]);
        }

         let run_ = 'select GAME_HOST, BIN_DIR from  t_game_config_variable_copy where GAME_SITE = "' + st_server[i]  +'"';
         break;
    case 10:
        let zone_id = req.body.zoneid;
        let zone_sql = 'select game_zone_id,agent,site_name,game_site,bin_dir,hot_bin_dir,game_host,game_port,web_port,actcode_port,open_server_date,db_base_url,db_game_name,db_base_name,db_log_name,db_username,db_password from t_game_config_variable_copy where game_zone_id =' + zone_id;
        cmdlib.run_sql(config.ser_dbip, config.ser_dbuser, config.ser_dbpasswd, config.ser_dbport, config.ser_dbname, zone_sql, 'select', function(r) {
            res.json(r);
        });
        break;
    case 11:
        let del_zone = req.body.delzone;
        let del_zonesql = 'delete from t_game_config_variable_copy where game_zone_id= "' + del_zone +'"';
        cmdlib.run_sql(config.ser_dbip, config.ser_dbuser, config.ser_dbpasswd, config.ser_dbport, config.ser_dbname, del_zonesql, 'delete', function(r) {
            if (r == 0) {
                res.json({'status': 'yes'});
            } else {
                res.json({'status': r.code});
            }
        });
        break;
    case 12:
        let czone_id = req.body.zone_id;
        let game_site = req.body.game_site;
        let game_host = req.body.game_host;
        let open_server_date = req.body.date;
        let game_port = req.body.game_port;
        let web_port = req.body.web_port;
        let actcode_port = req.body.actcode_port;
        let bin = req.body.bin;
        let hotbin = req.body.hotbin;
        let check_port ='select game_port,web_port,actcode_port from t_game_config_variable_copy  where game_host="'+ game_host +'" and game_zone_id !=' +czone_id+' and(game_port='+game_port+' or web_port="'+web_port+' "or actcode_port="'+actcode_port+'")';
        let chazone_sql = 'update t_game_config_variable_copy set game_site ="' + game_site +'",open_server_date="' + open_server_date + '",game_host = "' + game_host + '",game_port = "' + game_port + '",web_port = "' + web_port +'",actcode_port ="' + actcode_port +'",bin_dir="' + bin + '",hot_bin_dir="' + hotbin +'" where game_zone_id ="' + czone_id +'"';
        cmdlib.run_sql(config.ser_dbip, config.ser_dbuser, config.ser_dbpasswd, config.ser_dbport, config.ser_dbname, check_port, 'select', function(r) {
            if(r == ''){
                cmdlib.run_sql(config.ser_dbip, config.ser_dbuser, config.ser_dbpasswd, config.ser_dbport, config.ser_dbname, chazone_sql, 'update', function(r) {
                    if (r == 0) {
                        res.json({'status': 'yes'});
                    } else {
                        res.json({'status': r.code});
                    }
                });
         }else{
             res.json({'status': 'porterr'});
            }

        });

        break;
    case 13:
        let cozone_id = req.body.zone_id;
        let cgame_site = req.body.game_site;
        let copen_server_date = req.body.open_server_date;
        let cgame_host = req.body.game_host;
        let cgame_port = req.body.game_port;
        let cweb_port = req.body.web_port;
        let cactcode_port = req.body.actcode_port;
        let cbin = req.body.bin;
        let chotbin = req.body.hotbin;
        let check_cport ='select game_port,web_port,actcode_port from t_game_config_variable_copy  where game_host="'+ cgame_host +'" and game_zone_id !=' +cozone_id+' and(game_port='+cgame_port+' or web_port="'+cweb_port+' "or actcode_port="'+cactcode_port+'")';
        let copyzone_sql = 'insert into t_game_config_variable_copy (game_site,game_host,open_server_date,game_port,web_port,actcode_port,bin_dir,hot_bin_dir) values ("'+cgame_site +'","'+ cgame_host+'","'+ copen_server_date +'","'+cgame_port +'","'+ cweb_port +'","'+ cactcode_port +'","'+ cbin +'","'+ chotbin +'")';

        cmdlib.run_sql(config.ser_dbip, config.ser_dbuser, config.ser_dbpasswd, config.ser_dbport, config.ser_dbname, check_cport, 'select', function(r) {
            if(r == ''){
                cmdlib.run_sql(config.ser_dbip, config.ser_dbuser, config.ser_dbpasswd, config.ser_dbport, config.ser_dbname, copyzone_sql, 'update', function(r) {
                    if (r == 0) {
                        res.json({'status': 'yes'});
                    } else {
                        res.json({'status': r.code});
                    }
                });
            }else{
                res.json({'status': 'porterr'});
            }

        });
        break;
    case 14:
       let agennt = req.body.agent;
       let showagent = 'select agent,login_key,charge_key,default_login_key,netty_version from t_game_config_constant where agent ="'+agennt+'"';
        cmdlib.run_sql(config.ser_dbip, config.ser_dbuser, config.ser_dbpasswd, config.ser_dbport, config.ser_dbname, showagent, 'select', function(r) {
            res.json(r);
        });
        break;
    case 15:
        let agent = req.body.agent;
        let login_key = req.body.login_key;
        let charge_key = req.body.charge_key;
        let default_login_key = req.body.default_login_key;
        let netty_version = req.body.netty_version;
        var agentt_sql = 'insert into t_game_config_constant (agent,login_key,charge_key,default_login_key,netty_version) values("'+agent+'","'+login_key+'","'+charge_key+'","'+default_login_key+'","'+netty_version+'")';
        cmdlib.run_sql(config.ser_dbip, config.ser_dbuser, config.ser_dbpasswd, config.ser_dbport, config.ser_dbname, agentt_sql, 'update', function(r) {
            if (r == 0) {
                res.json({'status': 'yes'});
            } else {
                res.json({'status': r.code});
            }
        });
        break;
    case 16:
        let agent_del = req.body.agent_del;
        let agent_delsql = 'delete from t_game_config_constant where agent="'+agent_del+'"';
        cmdlib.run_sql(config.ser_dbip, config.ser_dbuser, config.ser_dbpasswd, config.ser_dbport, config.ser_dbname, agent_delsql, 'delete', function(r) {
            if (r == 0) {
                res.json({'status': 'yes'});
            } else {
                res.json({'status': r.code});
            }
        });
        break;
    case 17:
        let oldagent = req.body.oldagent;
        let magent = req.body.magent;
        let mlogin_key = req.body.mlogin_key;
        let mcharge_key = req.body.mcharge_key;
        let mdefault_login_key = req.body.mdefault_login_key;
        let mnetty_version = req.body.mnetty_version;
        let magentt_sql = 'update t_game_config_constant set agent="' + magent +'", login_key="' +mlogin_key +'", charge_key="'+mcharge_key +'", default_login_key="'+mdefault_login_key+'", netty_version="'+mnetty_version+'" where agent="' +oldagent+'"';
        console.log(magent);
        console.log(mlogin_key);
        console.log(magentt_sql);
        cmdlib.run_sql(config.ser_dbip, config.ser_dbuser, config.ser_dbpasswd, config.ser_dbport, config.ser_dbname, magentt_sql, 'update', function(r) {
            if (r == 0) {
                res.json({'status': 'yes'});
            } else {
                res.json({'status': r.code});
            }
        });
        break;
    case 18:
        let path = req.body.path;
        let host = req.body.host;
        request.post({
                url:'http://' + host + ':' + gop_port,
                form: {
                    cmd: 3,
                    path:path
                }
            },
            function(err,httpResponse,body){
                if(err){
                    res.json({'status': "err"});
                }else{
                    res.json (JSON.parse(body).repo);
                }
            })
        break;
    case 19:
        let logpath = req.body.path;
        let loghost = req.body.host;
        let log  = req.body.log;
        let start = req.body.start;
        let stop = req.body.stop;
        console.log(logpath + loghost + log + start + stop );
        request.post({
                url:'http://' + loghost + ':' + gop_port,
                form: {
                    cmd: 4,
                    path:logpath,
                    logname:log,
                    linea:start,
                    lineb:stop
                }
            },
            function(err,httpResponse,body){
                if(err){
                    res.json({'status': "err"});
                }else{
                    res.json (JSON.parse(body).repo);
                }
            })
        break;
        default:
        res.json({'repo': 'ERROR CMD'});
    }

});

/* format the time */
Date.prototype.format = function(format) {
    let date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (let k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? date[k]
                : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
};

module.exports = router;
