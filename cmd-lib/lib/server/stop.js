const path = require('path');
const exec = require('../common/exec');

function server_stop(gamepath, callback) {
    var cmd  = 'bash ';
        cmd += path.format({dir: gamepath, base: 'ctrl.sh'});
        cmd += ' stop';
    exec(cmd, function(r){
        callback(r);
    });
}

module.exports = server_stop;
