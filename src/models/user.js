const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task')

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
},

{
    timestamps : true
})


/*   myTasks is a virtual property as it is not saved in the actual database where it is refering to Task collection,
     with foreign and local fields telling mongoose how to relate the 2 collections   */
userSchema.virtual('myTasks', {
    ref : 'Task',
    foreignField : 'owner', // refers to a field in other collection
    localField : '_id'  // refers to a field in this collection that facilitates relationsip between 2 collections 
})


/*   toJSON() enables the developer to send a response with only the relevant object properties
     i.e. only with the res obj properties he wishes to expose to the user     */
userSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject; 
}

                    // SCHEMA.METHODS ARE ACCESSIBLE ON AN INSTANCE

    // generates and returns a token on a specific user 

userSchema.methods.generateAuthToken = async function(){
    const user = this;  // as this points to the instance, we can operate on it using .sign, etc

    // 'firstauthproject' refers to the jwt secret key stored on the server to authenticate the correct user

    const token = jwt.sign({_id : user._id.toString()}, 'firstauthproject'); // _id refers to the payload 

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

    //  will hash the password again if user changes the password
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    
    next();
});


userSchema.pre('remove', async function (next) {
    const user = this;

    await Task.deleteMany({owner : user._id})
    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;   