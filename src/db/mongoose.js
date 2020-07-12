const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser : true,
    useCreateIndex : true,
    useUnifiedTopology : true
})  


        //     CREATING A MODEL AND INSERTING IT INTO THE TASKS COLLECTION



// const workout = new Tasks({
//     description : '  Eat   Healthy'          
// })   

// workout.save().then((result) => {
//     console.log(workout);    
// }).catch((error) => {
//     console.log(error);    
// })


// const code = new Tasks({
//     description : 'Code in Node',

//     completed : true
// })

// code.save().then((result) => {
//     console.log(result);    
// }).catch((error) => {
//     console.log(error);    
// })


        