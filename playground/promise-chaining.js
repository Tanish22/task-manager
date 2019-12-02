require('../src/db/mongoose');
const User = require('../src/models/user');

User.findByIdAndUpdate('5dbc2d9f8f70240890ed9967', {age : 30}).then((user) => {
    console.log(user);
    return User.countDocuments({age : 30})  
}).then((result) => {
    console.log(result);    
}).catch((error) => {
    console.log(error);    
})
