var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes');
var session = require('express-session');
var index = require('./routes/index');
var flash = require('connect-flash');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(session({
    name: 'kk', // 设置 cookie 中保存 session id 的字段名称
    secret: 'kk', // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
    cookie: {
        maxAge: 2592000000 // 过期时间，过期后 cookie 中的 session id 自动删除
    },
    resave: false,
    saveUninitialized: true,
    //store: new MongoStore({// 将 session 存储到 mongodb
    //url: 'mongodb://localhost:27017/kk'// mongodb 地址
    //})
}));
app.use(function(req, res, next) {
    res.locals.user = req.session.user;
    res.locals.showname = req.session.showname;
    res.locals.permissions = req.session.permissions;
    res.locals.lan = req.session.lan;
    next();
});
routes(app);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

app.use('/',function(req, res, next) {
  res.render('error',{message:4004});
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development'
        ? err
        : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error',{message:500});
});

module.exports = app;
