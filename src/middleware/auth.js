//  this function checks for an incoming authentication token and verifies whether the jwt is valid or not 

const jwt = require('jsonwebtoken');
const User = require('../models/user');


// this fn takes in a bearer token given by the user in the req.header property and then decodes it using jwt.verify 
// and using the "firstauthproject" secretKey & finds the user with his respective id and token saved in the token Array in 
// mongoose Schema. 

const auth = async (req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'firstauthproject');    
        
        // finds user with the decoded id and from the tokens provided with previous requests from the token array
        // in the user schema

        const user = await User.findOne({_id : decoded._id, 'tokens.token' : token});

        if(!user){
            throw new Error()
        }

        req.token = token;
         
        req.user = user;

        next();
    }
    catch(error){
        res.status(401).send({error : 'Authentication required !!'})
    }  
}

module.exports = auth; 