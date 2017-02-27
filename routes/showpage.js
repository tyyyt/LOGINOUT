/** 展示页面
 * 101 策划配置版本
 * 103 客户端版本
 * 201 开启或关闭服务器
 * 202 服务器日志
 * 203 服务器状态
 * 204 服务器入口管理
 * 301 SQL执行
 * 302 SHELL执行
 * 502 区服信息管理
 * 503 平台信息管理
 * 601 用户管理页面
 * 602 key信息管理
 * 603 后台登录IP管理
 * 604 支付访问IP管理
 * 606 修改密码
 * 607 登出系统
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
        case 101:
            res.render('home', {
                jsxfile: '/jsx/base_info.jsx'
            });
            break;
        case 103:
            res.render('home', {
                jsxfile: '/jsx/client_info.jsx'
            });
            break;
        case 201:
            res.render('home', {
                jsxfile: '/jsx/st_server.jsx'
            });
            break;
        case 202:
            res.render('home', {
                jsxfile: '/jsx/server_log.jsx'
            });
            break;
        case 203:
            res.render('home', {
                jsxfile: '/jsx/server_stat.jsx'
            });
            break;
        case 204:
            res.render('home', {
                jsxfile: '/jsx/server_entry.jsx'
            });
            break;
        case 301:
            res.render('home', {
                jsxfile: '/jsx/sql_run.jsx'
            });
            break;
        case 302:
            res.render('home', {
                jsxfile: '/jsx/shell_run.jsx'
            });
            break;
        case 502:
        res.render('home', {
            jsxfile: '/jsx/zone_service.jsx'
        });
        break;
        case 503:
        res.render('home', {
            jsxfile: '/jsx/agent.jsx'
        });
        break;
        case 601:
            res.render('home', {
                jsxfile: '/jsx/user.jsx'
            });
            break;
        case 602:
            res.render('home', {
                jsxfile: '/jsx/key_info.jsx'
            });
            break;
        case 603:
            res.render('home', {
                jsxfile: '/jsx/ip_limit.jsx'
            });
            break;
        case 604:
            res.render('home', {
                jsxfile: '/jsx/charge_ip.jsx'
            });
            break;
        case 606:
            res.render('home', {
                jsxfile: '/jsx/change_passwd.jsx'
            });
            break;
        case 607:
            res.render('home', {
                jsxfile: '/jsx/logout.jsx'
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
