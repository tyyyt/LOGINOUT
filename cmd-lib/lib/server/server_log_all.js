/**
 * Author : Orz
 * Created by Orz on 2016/11/30.
 */

const fs   = require('fs');
const path = require('path');

function server_log_all(gamepath, callback) {
    var logfile = path.format({dir: gamepath, base: 'nohup.out'});
    try {
        var line = fs.readFileSync(logfile, 'utf8');
        callback(line);
    } catch (e) {
        console.error('Error: no such file or directory \'' + logfile + '\'');
        callback('NO LOG FILE ' + logfile);
        return 1;
    }
}

module.exports = server_log_all;
