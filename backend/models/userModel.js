const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name : {
        type : String,
        required : true,
    }, 
    email : {
        type : String,
        required : true,
        unique : true,
    },  
    gender: {
        type : String,
    },
    phone : {
        type : String,
        required : true,
    },
    score : {
        type : Number,
        default : 0,
    },
    totalQuizzes:{
        type : Number,
        default : 0,
    },
    password : {
        type : String,
        required : true,
    }, 
}, {
    timestamps : true,
});


const User = mongoose.model('users', userSchema);
module.exports = User;
