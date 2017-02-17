/**
 * Author : Orz
 * Created by Orz on 2016/11/22.
 */

const exec = require('./exec');

function rsync(rsync_Path, rsync_sourse_dir, rsync_User, rsync_IP, rsync_PasswdFile, callback) {
    try {
        fs.mkdirSync(rsync_Path, ['0755'])
    } catch (e) {
        if(rsync_sourse_dir != 'gamedb'){
            console.error('FILE PATH:' + rsync_Path + ' EXIST!,PLEASE CHECK THE GAME SETTING!');
            callback('game path is exits!');
            return 255;
        }
    }
    var cmd  = 'rsync -vzrtopg  --delete --password-file=';
    cmd += rsync_PasswdFile;
    cmd += ' ';
    cmd += rsync_User;
    cmd += '@';
    cmd += rsync_IP;
    cmd += '::';
    cmd += rsync_sourse_dir;
    cmd += ' ';
    cmd += rsync_Path;
    cmd += '/';
    cmd += rsync_sourse_dir;
    // console.log(cmd);
    exec(cmd, function (r) {
        callback(r);
    })
}

module.exports = rsync;