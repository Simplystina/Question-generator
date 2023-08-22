var express = require("express");
const controller = require("../controller/questions");
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).send('Welcome to Question Generator API');
});

router.post("/generate", controller.generate);
router.post("/save", controller.save);
router.get("/history", controller.history);


module.exports = router;
