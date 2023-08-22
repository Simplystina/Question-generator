var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true}
});

const User = mongoose.model('User', userSchema);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Route to signup a new user
router.post("/signup", async (req, res) => {
  //implement signup logic here
});

// Route to login a user
router.post("/login", async (req, res) => {
  //implement login logic here
});



module.exports = router;
