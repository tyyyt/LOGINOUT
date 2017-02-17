/**
 * Author : Orz
 * Created by Orz on 2016/11/22.
 */

const rsync = require('../common/rsync');


function hotfix(rsync_Path,rsync_sourse_dir,rsync_User,rsync_IP,rsync_PasswdFile,callback) {
    rsync(rsync_Path,rsync_sourse_dir,rsync_User,rsync_IP,rsync_PasswdFile,function (r) {
        callback(r);
    });
}

module.exports = hotfix;