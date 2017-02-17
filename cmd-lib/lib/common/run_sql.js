/**
 * Author : Orz
 * Created by Orz on 2016/11/22.
 */

const mysql = require('mysql');

function run_sql(db_ip, db_user, db_pwd, db_port, db_name, sql, mod, callback) {
    var connection = mysql.createConnection({
        host     : db_ip,
        user     : db_user,
        port     : db_port,
        password : db_pwd.toString(),
        database : db_name
    });
    // console.log(sql);
    connection.connect();
    if (sql != ''){
        connection.query(sql, function(err, rows, fields){
            if (!err) {
                if (mod == 'select'){
                    // console.log(rows);
                    callback(rows);
                }else {
                    callback(0);
                }
            } else {
                console.error('[MySQL]' + err);
                callback(err);
            }
        });
    }
    connection.end();
}

module.exports = run_sql;
