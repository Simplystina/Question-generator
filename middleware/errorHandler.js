const ErrResponse = require("../utils/errResponse")

const errorHandler = (err, req, res, next) =>{
    let error = {
        ...err
    }

    error.message = err.message
    console.log(err)

        // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new ErrorResponse(message, 400);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((val) => val.message);
        error = new ErrorResponse(message, 400);
    }

    // Invalid JWT
    if (err.message === 'jwt malformed') {
        const message = `Invalid Authorization Token`;
        error = new ErrorResponse(message, 401);
    }
    return res.status(error.statusCode || 500).json({
        success: false,
        status: 'error',
        error: error.message || 'Server Error'
    });
}

module.exports = errorHandler;