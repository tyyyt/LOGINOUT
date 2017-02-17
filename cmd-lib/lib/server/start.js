const path = require('path');
const exec = require('../common/exec');

function server_start(gamepath, callback) {
    var cmd  = 'bash ';
        cmd += path.format({dir: gamepath, base: 'ctrl.sh'});
        cmd += ' start';
    exec(cmd, function (r) {
        callback(r);
    });
}

module.exports = server_start;
