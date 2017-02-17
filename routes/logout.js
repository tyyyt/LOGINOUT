var express = require('express');
var router = express.Router();
router.get('/', function(req, res, next) {
  req.session.user = null;
  req.session.showname = null;
  req.session.permissions=null;
  req.session.lan = null;
  res.redirect('/login');
});
module.exports = router;
