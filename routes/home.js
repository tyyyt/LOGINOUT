var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.session.user){
      res.render('home',{name:res.locals.showname,permissions:res.locals.permissions})
  }else{
    res.redirect('/login')
  }
});
module.exports = router;
