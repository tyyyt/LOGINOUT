/**
 * Author : Orz
 * Created by Orz on 2016/11/18.
 */

const mysql = require('mysql');

function get_data(gamedb_ip, gamedb_user, gamedb_port, gamedb_pwd, gamedb_name, callback) {
    var connection = mysql.createConnection({
        host     : gamedb_ip,
        user     : gamedb_user,
        port     : gamedb_port,
        password : gamedb_pwd,
        database : gamedb_name
    });
    connection.connect();

    connection.end();
    callback(0);
}

module.exports = get_data;
