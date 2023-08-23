const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errResponse");
const questionModel = require("../model/question")
const dotenv = require("dotenv")
dotenv.config()
const { default: axios } = require("axios");
const {checkSentence, hasNumbers} = require("../utils/functions")

url = 'https://api.openai.com/v1/chat/completions'
headers = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
}


exports.generateQuestions = asyncHandler(async (req, res, next) => {
  
  let word = req.body.word;
  if (!word) {
    return next(new ErrorResponse('please pass in a word', 400));
  }
 word = word.trim()
  if(hasNumbers(word)){
    return next(new ErrorResponse("A word shouldn't contain numbers", 400))
  }

  if(checkSentence(word)){
    return next(new ErrorResponse("Enter one word not a sentence", 422))
  }

  const existedWord = await questionModel.findOne({word: word})
  if(existedWord){
    return next(new ErrorResponse("Word has been generated before", 409))
  }
    const data = {
      model : "gpt-3.5-turbo",
      messages :[
        { "role": "system", "content": "Generate questions my assistant." },
        { "role": "user", "content": `Generate a question with the word ${word}` }
      ],
      n: 5
    }
    
   try {
    const response = await axios.post(url, data,{ headers })

    const questions = response.data["choices"]
    const listOfQuestions = questions?.map((item)=>{return item?.message. content})
    
     return res.status(200).json({success: true, message:"Messages generated successfully", messages: {
        word:word, questions: listOfQuestions
      } 
    })

   } catch (error) {
      console.log(error,"error")
   }

});



exports.saveQuestion = asyncHandler(async (req, res, next) => {
 const {word, questions} = req.body
 const userid = req.user._id
   
    try {
      const data = {
        word: word,
        userId: userid,
        questions: questions,
      }
     const savedQuestions = await questionModel.create(data)
      return res.status(201).json({
        success: true, message: `Questions generated for the word ${word} has been saved`, data: savedQuestions})
    } catch (error) {
      next(error)
    }

});

exports.getallGeneratedQuestions = asyncHandler(async(req,res,next)=>{
  try {
     
    const data = await questionModel.find({userId:req.user._id})
    return res.status(201).json({
      success: true, message: `Successfully retrieved all Questions`, data: data
    })
  } catch (error) {
    next(error)
    console.log(error,"error")
  }
})

exports.getAGeneratedQuestions = asyncHandler(async (req, res, next) => {
  try {

    const data = await questionModel.find({ userId: req.user._id , _id:req.params.id})
    return res.status(201).json({
      success: true, message: `Successfully retrieved Questions`, data: data
    })
  } catch (error) {
    next(error)
    console.log(error, "error")
  }
})