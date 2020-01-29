//  this function checks for an incoming authentication token and verifies whether the jwt is valid or not 

const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'firstauthproject');        
        const user = await User.findOne({_id : decoded._id, 'tokens.token' : token});

        if(!user){
            throw new Error()
        }

        req.user = user;

        next();
    }
    catch(error){
        res.status(401).send({error : 'Authentication required !!'})
    }
}

module.exports = auth; 