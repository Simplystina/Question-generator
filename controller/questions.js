const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errResponse");
const mongoose = require("mongoose")
const History = require("../model/history")


exports.generate = asyncHandler(async (req, res, next) => {
  
  const word = req.body.word;
  // Call the function to generate a question based on the input word
   const question = await generateQuestion(word);
   res.send(question);

});


// Function to generate a question based on the input word
async function generateQuestion(word) {
  
  const openai = require("openai");
  const apiKey = process.env.api_Key;

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





exports.save = asyncHandler(async (req, res, next) => {
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

  res.send("Question saved successfully");
});

exports.getHistory = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.body.userId;

    // Get the history from the database
    const history = await History.find({ userId });

    res.send(history);
  } catch (error) {
    next(error)
  }

});
