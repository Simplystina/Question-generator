const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errResponse");

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

// History Schema
const historySchema = new mongoose.Schema({
  userId: String,
  word: String,
  question: String,
  timestamp: { type: Date, default: Date.now },
});

const History = mongoose.model("History", historySchema);

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
  const userId = req.body.userId;

  // Get the history from the database
  const history = await History.find({ userId });

  res.send(history);
});
