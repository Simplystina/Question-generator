var express = require("express");
const controller = require("../controller/questions");
var router = express.Router();
const protection = require("../middleware/auth").authentication

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).send('Welcome to Question Generator API');
});

router.use(protection)
router.post("/generate",  controller.generateQuestions);
router.post("/save",  controller.saveQuestion);
router.get("/all-generated-questions",  controller.getallGeneratedQuestions);
router.get("/each-questions/:id", controller.getAGeneratedQuestions);


module.exports = router;
