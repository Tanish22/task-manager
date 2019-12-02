require('../src/db/mongoose');
const Task = require('../src/models/task');

// Task.findByIdAndDelete('5dbc6b59f37cee20205bcd61').then((user) => {
//     console.log(user);
//     return Task.find({completed : false})    
// }).then((result) => {
//     console.log(result);
//     return Task.countDocuments({  completed : false  })    
// }).then((finRes) => {
//     console.log(finRes);    
// }).catch((error) => {
//     console.log(error);        
// }) 

const deleteTaskAndCount = async (id) => {
    const deleteUser = await Task.findByIdAndDelete(id);
    const countDoc = await Task.countDocuments({completed : true});

    return countDoc;
}

deleteTaskAndCount('5dbc40afbb7423457c6aebdf').then((count) => {
    console.log(count);    
}).catch((error) => {
    console.log(error);    
})