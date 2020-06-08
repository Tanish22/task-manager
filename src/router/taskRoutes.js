const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth')
const Task = require('../models/task');

router.post('/tasks', auth, async (req, res) => {
    //  const task = new Task(req.body);
    
    const task = new Task({
        ...req.body,
        owner : req.user._id
    })
    
    try{
        await task.save()
        res.status(201).send(task)
    }
    catch(error){
        res.status(400).send(error);
    }
})



router.get('/tasks', auth, async (req, res) => {
    try{
        // const tasks = await Task.find({});
        // res.send(tasks);


        /*   used populate on the req.user object as we are using auth middleware, then populated the actual virtual 
             field used in the user object as it has the reference to the Task model which will display all the 
             tasks of the authenticated user   */
        await req.user.populate('myTasks').execPopulate(); 
        res.send(req.user.myTasks)
    }
    catch(error){
        res.status(500).send(error)
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try{
        //  const task = await Task.findById(_id);

        const task = await Task.findOne({_id, owner : req.user._id});
        
        if(!task){            
            return res.status(404).send()
        }
        
        res.send(task)
    }
    catch(error){
        res.status(500).send(error)
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const allowedUpdates = ['description', 'completed'];
    const updates = Object.keys(req.body);    
    const validUpdates = updates.every( (update) => allowedUpdates.includes(update));
    
    if(!validUpdates){
        return res.status(400).send({ error : 'Invalid Updates' })
    }

    try{
        //  const task = await Task.findById(req.params.id);

        const task = await Task.findOne({_id : req.params.id, owner : req.user._id});
        
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new : true, runValidators : true })

        if(!task){
            res.status(404).send();
        }

        updates.forEach((update) => (task[update] = req.body[update]));

        await task.save();

        res.send(task);
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try{
        //  const task = await Task.findByIdAndDelete(req.params.id);

        const task = await Task.findOneAndDelete({_id : req.params.id, owner : req.user._id})

        if(!task){
            res.status(404).send();
        }

        res.send(task);
    }
    catch(e){
        res.status(500).send(e);
    }
})

module.exports = router;