/**
 * Author : Orz
 * Created by Orz on 2016/11/22.
 */

const mysql = require('mysql');

function run_sql(sql) {
    var connection = mysql.createConnection({
      host: '10.0.6.14',
      user: 'root',
      password: '123456',
      database: 'cop_c'
    });
    // console.log(sql);
    connection.connect();
    if (sql != ''){
        connection.query(sql, function(err, rows, fields){
            if (!err) {
                if (mod == 'select'){
                    return(rows);
                }
            } else {
                console.error('[MySQL]' + err);
                return(err);
            }
        });
    }
    connection.end();
}

module.exports = run_sql;
