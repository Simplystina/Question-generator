var express = require('express');
var router = express.Router();
const userController = require("../controller/users")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/signup', userController.signup)
router.post('/login', userController.login)
module.exports = router;
