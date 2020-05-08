//  this function checks for an incoming authentication token and verifies whether the jwt is valid or not 

const jwt = require('jsonwebtoken');
const User = require('../models/user');


/*  this fn takes in a bearer token given by the user in the req.header property and then decodes  
it using jwt.verify and using the "firstauthproject" secretKey & finds the user with his respective  
id and token saved in the token Array in mongoose Schema.   */

const auth = async (req, res, next) => {
    try {
          // logging token without the replace method logs "Bearer eyhjkdbdjbsgygvshldbhdj"
          const token = req.header("Authorization").replace("Bearer ", "");
          const decoded = jwt.verify(token, "firstauthproject");

          // finds user with the decoded id and from the tokens provided with previous requests from
          // the token array in the user schema

          const user = await User.findOne({
            _id: decoded._id,
            "tokens.token": token,
          });

          if (!user) {
            throw new Error();
          }

          /*   adding token property on the req obj to let the routes know what exact token has
               been used by the user to login   */
          req.token = token;

          /* adding user to the req obj inorder to forward it to the route handler 
           so it displays the profile of the specific authenticated user  */

          req.user = user;

          next();
        }
    catch(error){
        res.status(401).send({error : 'Authentication required !!'})
    }  
}

module.exports = auth; 