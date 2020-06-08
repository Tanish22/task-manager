const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
  },

  completed: {
    type: Boolean,
    default: false,
  },

  
  /*  owner field is set to objectId type as it will receive the user Id from the req.user object used to authenticate & as a result will 
      get saved under owner field in req object as "req.user._id"  */

  /*  ref property is used to refer to the user collection from this task collection so the entire authenticated user's document 
      can be displayed using the populate method on owner as its the one referencing to the user model.  */
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  }
});

taskSchema.pre('save', async function(next){
    const task = this;

    console.log('taskSchema Middleware');    

    // if(task.isModified('password')){
    //     task.password = await bcrypt.hash(task.password, 8);
    // }
    
    next();
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task;