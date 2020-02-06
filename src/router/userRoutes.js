const express = require('express');
const router = new express.Router();

const User = require('../models/user');
const auth = require('../middleware/auth');

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try{
    await user.save();
    const token = user.generateAuthToken();     // generates token on every signup

    res.status(201).send({user, token})
    }
    catch(error){   
        res.status(400).send(error);         
    } 
}) 

router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password);
        
        const token = await user.generateAuthToken();
 
        res.send({ user, token });
    }
    catch(error){
        res.status(400).send();
    }
})


// this route has been commented as it will give the logged in user access to all the users

// router.get('/users', auth, async (req, res) => {
//     try{
//         const users = await User.find({})
//         res.send(users)
//     }
//     catch(error){
//         res.status(500).send();
//     }  
// })


//  endpoint with authentication
router.get('/users/me', auth, (req, res) => {
    res.send(req.user);
})

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;
    
    try{
        const user = await User.findById(_id)

        if(!user){
            return res.status(404).send() 
        }

        res.send(user);      
    }
    catch(error){
        res.status(500).send(error);
    }
})


// router.patch => initially checks whether the req contains valid updates and then applies the updates

router.patch('/users/:id', async (req, res) => {    
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every( (update) => allowedUpdates.includes(update) )
    
    if(!isValidOperation){
        return res.status(400).send({ error : 'Invalid Updates' });
    }

    // iterating over the req.body keys and when found applies that to User model via the req.body 
    try{
        const user = await User.findById(req.params.id)

        updates.forEach((update) => user[update] = req.body[update]);

        await user.save();

        //const user = await User.findByIdAndUpdate(req.params.id, req.body, {new : true, runValidators : true})

        if(!user){
            return res.status(404).send()
        }

        res.send(user)
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.delete('/users/:id', async (req, res) => {
    try{
        //const user = await User.deleteMany({});
        
        const _id = req.params.id
        const user = await User.findByIdAndDelete(req.params.id); 

        if(!user){
            res.status(404).send()
        }
        res.send(user);
    }
    catch(e){
        res.status(500).send(e)
    }
})

module.exports = router;