/** 获取数据
 * 1 菜单控制
 * 2 服务器时间戳
 * 3 获取游戏服信息
 * 4 获取语言包
 * 5 获取全部当前开服时间
 */
'use strict';

const express = require('express');
const fs = require('fs');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  if (!req.session.user) {
    res.redirect('/login');
  }
   var cmd=req.query.s;
    switch (Number(cmd)) {
        case 606:
            res.render('home', {
              jsxfile: '/jsx/change_passwd.jsx'         //修改密码页面
            });
            break;
        case 601:
            res.render('home', {
                jsxfile: '/jsx/user.jsx'         //用户管理页面
            });
            break;
        case 201:
            res.render('home', {
                jsxfile: '/jsx/st_server.jsx'      //开启和关闭服务器页面
            });
            break;
        case 202:
            res.render('home', {
                jsxfile: '/jsx/server_log.jsx'      //开启和关闭服务器页面
            });
            break;
        case 204:
            res.render('home', {
                jsxfile: '/jsx/server_entry.jsx'   //服务器入口管理页面
            });
            break;
        case 301:
            res.render('home', {
                jsxfile: '/jsx/sql_run.jsx'           //sql命令执行页面
            });
            break;
        case 302:
            res.render('home', {
                jsxfile: '/jsx/shell_run.jsx'           //shell命令执行页面
            });
            break;
        case 602:
            res.render('home', {
                jsxfile: '/jsx/key_info.jsx'            //key信息管理
            });
            break;
        case 603:
            res.render('home', {
                jsxfile: '/jsx/ip_limit.jsx'      //后台登陆ip管理
            });
            break;
        case 607:
            res.redirect('/logout');      //登出系统
            break;
        case 502:
        res.render('home', {
            jsxfile: '/jsx/zone_service.jsx'      //区服信息管理
        });
        break;
        case 503:
        res.render('home', {
            jsxfile: '/jsx/agent.jsx'      //平台信息管理
        });
        break;
        default:
            res.render('index', {
                jsxfile: '/jsx/blank.jsx'
            });
            break;
    }

});

function getLangPackage(lang) {
    return JSON.parse(fs.readFileSync(__dirname + '/../lang/lang_' + lang + '.json'));
}

module.exports = router;
