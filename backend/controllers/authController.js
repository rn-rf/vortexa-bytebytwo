const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/userModel");
const { sendEmail } = require('../utilities/utils');

const signUp = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        //check if user already exists
        const user = await User.findOne({ email });
        if(user){
            return res.status(409).json({
                message : "User already exists",
                success : false,
            })
        }

        const userModel = new User({ name , email, password});
        userModel.password = await bcrypt.hash(password, 10);

        await userModel.save();

        await sendEmail(userModel, "Registered Successfully", `Congratulations ${name} you have been registered to our site successfully with email id ${email}`);

        res.status(201).json({
            message : "User registered successfully",
            success : true,
        })
        
        
    } catch (error) {
        res.status(500).json({
            message : "Internal Server Error" ,
            error,
            success : false,
        })

    }
}


const login = async (req, res) => {
    try {
        const { email, password} = req.body;

        //check if user already exists
        const user = await User.findOne({ email });
        if(!user){
            return res.status(403).json({
                message : "Email or password incorrect",
                success : false,
            })
        }

        const isPassEqual = await bcrypt.compare(password, user.password);
        if(!isPassEqual){
            return res.status(403).json({
                message : "Email or password incorrect",
                success : false,
            })
        }

        const jwtToken = jwt.sign({
            email : user.email,
            id : user._id 
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn : '24h'}
        );
        
        await sendEmail(user, "Login Successfull", `Congratulations ${user.name} you have been logged to our site successfully with email id ${email}`);

        res.status(201).json({
            message : "Login Successful",
            success : true,
            jwtToken,
            email,
            name : user.name
        })
        
        
    } catch (error) {
        res.status(500).json({
            message : "Internal Server Error" ,
            error,
            success : false,
        })

    }
}



module.exports = {
    signUp,
    login
}