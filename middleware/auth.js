const asyncHandler = require("./async")
const UserModel = require("../model/users")
const ErrResponse = require("../utils/errResponse")
const jwt = require('jsonwebtoken')

exports.authentication = asyncHandler(async (req,res, next)=>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){

        token = req.headers.authorization.split(' ')[1]
    }else if(req.cookies.token){
        token = req.cookies.token
    }

    if(!token){
        return next(new ErrResponse('Not authorised to access this route', 401))
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await UserModel.findById(decoded.user_id)
        if(req.user){
            next()
        }else{
            return next(
                new ErrResponse('Not authorized to accesss this route',401)
            )
        }
    } catch (error) {
        return next(
            new ErrResponse('Not authorized to accesss this route', 401)
        )
    }
})