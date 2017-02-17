/**
 * Author : Orz
 * Created by Orz on 2016/11/22.
 */

const fs         = require('fs');
const path       = require('path');
const mysql      = require('mysql');
const rsync      = require('../common/rsync');
const run_sql    = require('../common/run_sql');
const set_config = require('../common/set_config');

function setting_game(a) {
    console.log(a)
}


// create new server db
function create_db(gamedb_ip, gamedb_nameEx, gamedb_user, gamedb_pwd, gamedb_port, rsync_Path, callback) {
    var baseDB = ["db_base", "db_log", "db_gcc", "db_game"];
    var dbInfo = [];
    var i;
    for ( i = 0; i < baseDB.length; i++) {
        var a  = baseDB[i];
            a += gamedb_nameEx;
        dbInfo.push(a)
    }
    // create query : create database xxxxx
    var query_create = [];
    for (i = 0; i < dbInfo.length; i++) {
        var q_create  = '';
            q_create += 'create database ';
            q_create += dbInfo[i];
            q_create += ' default character set utf8;';
        query_create.push(q_create);
    }
    // source query : source /src/xxx.sql
    var query_source = [];
    for (i = 0; i < baseDB.length; i++) {
        var q_source  = '';
            q_source += 'source ';
            q_source += rsync_Path;
            q_source += '/';
            q_source += baseDB[i];
            q_source += '.sql;';
        query_source.push(q_source);
    }
    // console.log(query_create);
    console.log(query_source);
    query_create.map(function (sql) {
        run_sql(gamedb_ip, gamedb_user, gamedb_pwd, gamedb_port, '', sql, 'create', function (r) {
            callback(r);
        });
    });

}

function write_new(gamedb_ip, gamedb_user, gamedb_pwd, gamedb_port, webpath, callback) {
    set_config(gamedb_ip, gamedb_user, gamedb_pwd, gamedb_port, webpath, function (r) {
        if (r){
            fs.writeFile('config.txt', r, function(err) {
                if (err) throw err;
                callback(0)
            });
        }else {
            callback('UNKNOW ERROR')
        }
    });
}

module.exports = write_new;
module.exports = create_db;
module.exports = setting_game;
