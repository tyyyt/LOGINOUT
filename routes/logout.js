var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
req.session.user = null;
req.session.showname = null;
res.redirect('/login')

});

module.exports = router;
