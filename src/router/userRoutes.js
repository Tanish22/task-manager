const express = require("express");
const router = new express.Router();
const sharp = require('sharp');

const multer = require('multer');
const uploadFiles = multer({
   // dest : 'uploads',  //  dir where files get uploaded
   limits : {
     fileSize : 1000000  //  limits file upload size to 1mb
   },
   fileFilter(req, file, cb){   //  params : req being made, info about file being uploaded & cb to let multer know its done
      if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){  //  used regex to upload file having names ending with jpg, jpeg, png 
        return cb(new Error('Please upload an image file'))
      }

      cb(null, true)
   }  
})


const User = require("../models/user");
const auth = require("../middleware/auth");

const { sendWelcomeEmail, sendCancellationEmail } = require('../emails/account')


// "/users(signup)" & "/login" will generate jwt as both routes require users to be authenticated
router.post("/users/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();

    sendWelcomeEmail(user.email, user.name)
    const token = await user.generateAuthToken(); // generates token on every signup

    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (error) {
    res.status(400).send();
  }
});

//  this endpoint returns the uploaded images of the authenticated user 
router.get('/users/:id/uploads', async (req, res, next) => {
    try{
        const user = await User.findById(req.params.id);

        if (!user || !user.uploads) {
          throw new Error();
        }

        res.set('Content-Type', 'image/jpg'); // sets the response content-type to image as the endpoint returns an image
        res.send(user.uploads);
    }
    catch (e){
        res.status(404).send();
    }
})


/*  this route takes in an authenticated user and lets him upload files using uploadFiles.single middleware (multer)
    it saves in the buffer in the DB under uploads field (type : buffer).. req.file is attached by multer itself   */
router.post('/users/me/upload', auth, uploadFiles.single('tanish'), async (req, res, next) => {
    //  req.user.uploads = req.file.buffer;

    const buffer = await sharp(req.file.buffer).png().toBuffer();
    req.user.uploads = buffer;
    
    await req.user.save();    
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error : error.message })
})


router.delete('/users/me/uploads', auth, async (req, res, next) => {
    req.user.uploads = undefined;
    await req.user.save();
    res.send();
})


/*   the user is logged out by filtering out the token (req.token) he logged in with and 
     returning a new array with the tokens with which he hasn't logged out yet    */
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send();
  } catch (error) {
    res.status(500).send();
  }
});


router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];

    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

/* this route has been commented as it will give the logged in user access to all the users
   which kills having auth in the first place */

// router.get('/users', auth, async (req, res) => {
//     try{
//         const users = await User.find({})
//         res.send(users)
//     }
//     catch(error){
//         res.status(500).send();
//     }
// })

/*  this endpoint will just display the authenticated user's profile that we got after 
reassigning the req object "req.user = user" in the auth middleware */

router.get("/users/me", auth, (req, res) => {
  res.send(req.user);
});

/*  the user shouldn't be able to pass in the id as query parameters as it exposes other users
    as anyone can login without being authenticated    */

// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id;

//     try{
//         const user = await User.findById(_id)

//         if(!user){
//             return res.status(404).send()
//         }

//         res.send(user);
//     }
//     catch(error){
//         res.status(500).send(error);
//     }
// })

// router.patch => initially checks whether the req contains valid updates and then applies the updates

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Updates" });
  }

  // iterating over the req.body keys and when found applies that to User model via the req.body
  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));

    //const user = await User.findByIdAndUpdate(req.params.id, req.body, {new : true, runValidators : true})

    // if(!user){
    //     return res.status(404).send()
    // }

    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.user._id);

    // if(!user){
    //     res.status(404).send()
    // }

    await req.user.remove();
    res.send(req.user);
    
    sendCancellationEmail(req.user.email, req.user.name)
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
