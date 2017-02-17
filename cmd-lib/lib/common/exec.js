/**
 * Author : Orz
 * Created by Orz on 2016/11/23.
 */

const exec = require('child_process').exec;

function shell(cmd, callback) {
    exec(cmd, function(error, stdout, stderr){
        if (error) {
            console.error("shell error: " + error);
            callback(stderr);
        }else{
            callback(0);
        }
    });
}

module.exports = shell;
