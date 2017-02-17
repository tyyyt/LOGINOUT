/**
 * Author : Orz
 * Created by Orz on 2016/11/18.
 */

const exec = require('../common/exec');


function mysql_dump(gamedb_ip, gamedb_user, gamedb_pwd, gamedb_port, gamedb_name, tm, callback) {
    var cmd  = 'mysqldump ';
        cmd += '-h';
        cmd += gamedb_ip;
        cmd += ' ';
        cmd += '-u';
        cmd += gamedb_user;
        cmd += ' ';
        cmd += '-p';
        cmd += gamedb_pwd;
        cmd += ' ';
        cmd += '-P';
        cmd += gamedb_port;
        cmd += '  -a -q --add-drop-table --default-character-set=utf8 --single-transaction -B ';
        cmd += gamedb_name;
        cmd += ' > ./';
        cmd += tm;
        cmd += '-NGAME-';
        cmd += gamedb_name;
        cmd += '_1.sql';
    exec(cmd, function (r) {
        callback(r);
    });
}

function zip_package(zipfile, sql_files, callback) {
    var cmd  = 'zip -q ';
        cmd += zipfile;
    sql_files.map(function (s) {
        cmd += ' ';
        cmd += s;
    });
    exec(cmd, function (r) {
        callback(r);
    });
}

function dump_db(gamedb_ip, gamedb_user, gamedb_pwd, gamedb_port, dbnames, callback) {
    var date   = new Date();
    var year   = date.getFullYear();
    var month  = date.getMonth()+1;
    var day    = date.getDate();
    var minute = date.getMinutes();
    if (date.getHours() < 10){
        var hour  = '0';
        hour += date.getHours();
    }
    var tm  = year.toString();
        tm += month.toString();
        tm += day.toString();
        tm += hour.toString();
        tm += minute.toString();
    var zip_sql = [];
    dbnames.map(function (s) {
        mysql_dump(gamedb_ip, gamedb_user, gamedb_pwd, gamedb_port, s, tm, function (r) {
            if (r != 0){
                console.error('MySQLDump ERROR: ' + r);
                return 255;
            }else {
                var sqlname  = tm;
                    sqlname += '-NGAME-';
                    sqlname += s;
                    sqlname += '_1.sql';
                zip_sql.push(sqlname);
            }
        });
    });
    var zipname = tm + '.sql';
    zip_package(zipname, zip_sql, function (r) {
        callback(r);
    });
}

module.exports = dump_db;