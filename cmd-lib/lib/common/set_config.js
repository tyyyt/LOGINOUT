/**
 * Author : Orz
 * Created by Orz on 2016/11/24.
 */

const run_sql  = require('./run_sql');
const json2xml = require('json2xml');

var opt = {
    "root": {
        "server": "",
        "port": "",
        "language": "zh_cn",
        "version": "",
        "assets": "",
        "type": "",
        "site": "",
        "assetsVerify": "",
        "key": "",
        "loginkey": ""
    }
};

function get_key(game_ip, game_user, game_pwd, game_port, game_gcc, agent, callback) {
    var sql = 'select LOGIN_KEY,DEFAULT_LOGIN_KEY from t_game_config_constant where AGENT = "' + agent + '";';
    run_sql(game_ip, game_user, game_pwd, game_port, game_gcc, sql, 'select', function(r) {
        callback(r)
    });
}

function get_gamesite(game_ip, game_user, game_pwd, game_port, center_name, game_site, callback) {
    opt["root"]["site"] = game_site;
    var sql = 'select GAME_HOST,GAME_PORT from t_game_config_variable where GAME_SITE = "' + game_site + '";';
    run_sql(game_ip, game_user, game_pwd, game_port, center_name, sql, 'select', function(r) {
        callback(r)
    });
}

function set_config(game_ip, game_user, game_pwd, game_port, game_gcc, center_name, game_site, agent, callback) {
    get_key(game_ip, game_user, game_pwd, game_port, game_gcc, agent, function(r) {
        opt["root"]["loginkey"] = r[0].LOGIN_KEY;
        opt["root"]["key"]      = r[0].DEFAULT_LOGIN_KEY;
        get_gamesite(game_ip, game_user, game_pwd, game_port, center_name, game_site, function(r) {
            opt["root"]["server"] = r[0].GAME_HOST;
            opt["root"]["port"]   = r[0].GAME_PORT;
            var a = json2xml(opt, {header: true});
            callback(a)
        });
    });
}

module.exports = set_config;
