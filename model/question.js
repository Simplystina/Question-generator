const mongoose = require("mongoose")

// Questions Schema
const questionSchema = new mongoose.Schema(
    {
    userId: {type: String, required: true},
    word:  {type: String, required: true},
    questions: [{ type: String, required: [true, 'Questions is a required field'], }]
    },
     {
        timestamps: true, toJSON: { virtuals: true }
    }
);


module.exports = mongoose.model('questions', questionSchema)