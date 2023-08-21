var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// Add the route to generate a question
router.post("/generate", async (req, res) => {
  const word = req.body.word;

  // Call the function to generate a question based on the input word
  const question = await generateQuestion(word);

  res.send(question);
});

// Function to generate a question based on the input word
async function generateQuestion(word) {
  const openai = require("openai");
  const apiKey = "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";

  const prompt = `Generate a question using the word "${word}"`;

  try {
    const response = await openai.Completion.create({
      engine: "davinci",
      prompt,
      max_tokens: 50,
      api_key: apiKey,
    });

    const question = response.choices[0].text.trim();
    return question;
  } catch (error) {
    console.error(error);
    return "Error generating question.";
  }
}

// History Schema
const historySchema = new mongoose.Schema({
  userId: String,
  word: String,
  question: String,
  timestamp: { type: Date, default: Date.now },
});

const History = mongoose.model('History', historySchema);

// Route to save the question to the database
router.post("/save", async (req, res) => {
  const userId = req.body.userId;
  const word = req.body.word;
  const question = req.body.question;

  // Save the question to the database
  const history = new History({
    userId,
    word,
    question,
  });

  await history.save();

  res.send("Question saved.");
});

// Route to get the history of questions
router.post("/history", async (req, res) => {
  const userId = req.body.userId;

  // Get the history of questions from the database
  const history = await History.find({ userId });

  res.send(history);
});

module.exports = router;
