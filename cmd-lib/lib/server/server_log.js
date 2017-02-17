/**
 * Author : Orz
 * Created by Orz on 2016/11/16.
 */
'use strict';

const path         = require('path');
const readEachLine = require('read-each-line');

function server_log(gamepath, linea, lineb, callback) {
    let logfile = path.format(
        {
            dir: gamepath,
            base: 'nohup.out'
        });
    let lines     = [];
    let sendlines = [];
    try {
        readEachLine(logfile, 'utf8', function(line) {
            lines.push(line);
        });
    }catch (e){
        console.error('Error: no such file or directory \''+ logfile +'\'');
        console.log(e);
        callback('NO LOG FILE ' + logfile);
        return 1;
    }
    for (let i = linea; i < lineb ; i++){
        sendlines.push(lines[i]);
    }
    callback(sendlines);
}

module.exports = server_log;
