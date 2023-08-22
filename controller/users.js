const asyncHandler = require("../middleware/async")
const UserModel = require("../model/users");
const ErrorResponse = require("../utils/errResponse");



exports.signup = asyncHandler(async(req,res,next)=>{

    const {email, firstName, password, lastName} = req.body
    try {
        if(!email){
            return next(new ErrorResponse('Email Address Is Required', 404));
        }
        if (!password) {
            return next(new ErrorResponse('Password Is Required', 404));
        }
        if(!(firstName && lastName)){
            return next(new ErrorResponse('Password Is Required', 404));
        }

        //Validate if user exist in our database
      
        const oldUser = await UserModel.findOne({ email })
        if (oldUser) {
            console.log(oldUser)
            return next(new ErrorResponse("User Already exist. Please Login", 409))
               
        }
        //create user in our database
        const newUser = await UserModel.create(req.body)


        return res.status(201).json({
            message: "Registration successful. You've successfully registered",
            data: newUser,
            success: true
        })
    } catch (error) {
        next(error);
    }

})


exports.login = (asyncHandler(async (req,res,next)=>{
    try {
        const { email, password } = req.body;

       
        if (!email || !password) {
            return next(new ErrorResponse('Please provide an email and password', 400));
        }

        // Check for user
        const user = await UserModel.findOne({ email }).select('+password');
        if (!user) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);
        console.log(isMatch)
        if (!isMatch) {
            return next(new ErrorResponse('Invalid credentials,please enter the correct details', 401));
        }
        const token = Array.isArray(user)
            ? user[0].getSignedJwtToken()                                                                                     
            : user.getSignedJwtToken();

        userData = user.toObject();
        userData.token = token

        const options = {
            expires: new Date(
                Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
            ),
            httpOnly: true
        };
      
        //Delete the password from the object so as not to display the hash to the user
        delete userData.password;

        return res.status(201).cookie('token', token, options).json({
            success: true,
            message: "Login Successfully!",
            data: userData,
            
        })
    } catch (error) {
        next(error);
    }
}))