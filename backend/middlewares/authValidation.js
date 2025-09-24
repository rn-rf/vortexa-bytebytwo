const joi = require('joi');

const signUpValidation = async (req, res, next) =>{
    const validationSchema = joi.object({
        name : joi.string().min(2).max(100).required(),
        email : joi.string().email().required(),
        password : joi.string().min(4).max(100).required(),
    });

    const {error} = validationSchema.validate(req.body);

    if(error){
        return res.status(400).json({
            message : "Bad request",
            error,
        })
    }
    next();
}

const loginValidation = async (req, res, next) =>{
    const validationSchema = joi.object({
        email : joi.string().email().required(),
        password : joi.string().min(4).max(100).required(),
    });

    const {error} = validationSchema.validate(req.body);

    if(error){
        return res.status(400).json({
            message : "Bad request",
            error,
        })
    }
    next();
}


module.exports = {
    signUpValidation,
    loginValidation
}