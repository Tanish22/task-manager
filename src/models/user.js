const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({    
    name : {
        type : String, 
        required : true,
        trim : true 
    },

    email : {
        type : String,
        unique : true,
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
    },

    // saving tokens as part of user document for future access
    tokens : [{
        token : {
            type : String,
            required : true
        }
    }]
})

                    // SCHEMA.METHODS ARE ACCESSIBLE ON AN INSTANCE

    // generates and returns a token on a specific user 

userSchema.methods.generateAuthToken = async function(){
    const user = this;  // as this points to the instance, we can operate on it using .sign, etc

    // 'firstauthproject' refers to the jwt secret key stored on the server to authenticate the correct user
    const token = jwt.sign({_id : user._id.toString()}, 'firstauthproject');

    user.tokens = user.tokens.concat({token});  // concats 
    await user.save();

    return token;
}

                    // SCHEMA.STATICS ARE ACCESSIBLE ON THE MODEL
// initialising login by checking email first & if user email is matched compares password.. 
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});

    if(!user){
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        throw new Error('Unable to login');
    }

    return user;
}

//  setting up middleware to hash plain-text P/W => using pre signifies an event before user has been saved     
userSchema.pre('save', async function (next){
    const user = this; 

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    
    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;   