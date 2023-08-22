const mongoose = require("mongoose")

// History Schema
const historySchema = new mongoose.Schema(
    {
    userId: {type: String},
    word: {type: String},
    question: {type: String}
    },
     {
        timestamps: true, toJSON: { virtuals: true }
    }
);


module.exports = mongoose.model('history', historySchema)