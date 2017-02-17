const fs = require('fs');
const path = require('path');


function server_pid(fpath, callback) {
    var pidfile = path.format({dir: fpath, base: 'pid.txt'});
    callback(fs.readFileSync(pidfile));
}

module.exports = server_pid;
