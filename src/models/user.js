const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({    
    name : {
        type : String,
        required : true,
        trim : true 
    },

    email : {
        type : String,
        required : true,
        trim : true,
        lowercase : true,
        validate(value){
            if(!validator.isEmail(value)){                  
                throw new Error('Email is invalid');        
            }
        }
    },

    password : {
        type : String,
        required : true,
        minlength : 7,
        trim : true,        
        validate(value){
            if (value.toLowerCase().includes('password')){
                throw new Error('Password cannot contain the word "password" ')
            }
        },        
    },

    age : {
        type : Number,
        default : 0,
        validate(value){ 
            if(value < 0){
                throw new Error('Age must be positive');
            }
        }
    } 
})


//  setting up middleware
userSchema.pre('save', async function (next){
    const user = this;

    console.log('just before saving');
        
})

const User = mongoose.model('User', userSchema);

module.exports = User;  