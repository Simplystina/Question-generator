const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')



const userSchema = new mongoose.Schema(
    {
        email:{
            type: String,
            required: [true, 'Please enter your Email address'],
            trim: true,
            unique: true,
            lowercase: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please enter a valid Email address'
            ]
        },
        firstName: {
            type: String,
            required: [false, 'Please enter your first name'],
            trim: true,
            lowercase: true 
        },
        lastName:{
            type: String,
            required : [false, 'Please enter your last name'],
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: [true, 'Please A Valid Password is Required'],
            select: false
        }
    }
)

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

//Sign JWT
userSchema.methods.getSignedJwtToken = function () {
    return jwt.sign(
        {
            user_id: this._id
        },
        process.env.JWT_SECRET
    );
};

module.exports = mongoose.model('Users', userSchema)

