var express = require('express');
const userController = require("../controller/users")
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', userController.signup)
router.post('/login', userController.login)

module.exports = router;
