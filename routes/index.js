var express = require("express");
const controller = require("../controller/questions");
var router = express.Router();
const protection = require("../middleware/auth").authentication

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).send('Welcome to Question Generator API');
});

router.post("/generate", protection, controller.generate);
router.post("/save", protection, controller.save);
router.get("/history", protection, controller.getHistory);


module.exports = router;
