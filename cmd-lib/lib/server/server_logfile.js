/**
 * Author : Orz
 * Created by Orz on 2016/12/10.
 */

const fs   = require('fs');
const path = require('path');

function server_log_all(filepath, callback) {
    try {
        var line = fs.readFileSync(filepath, 'utf8');
        callback(line);
    } catch (e) {
        console.error('Error: no  such file or directory \'' + filepath + '\'');
        callback('NO  LOG FILE ' + filepath);
        return 1;
    }
}

module.exports = server_log_all;
