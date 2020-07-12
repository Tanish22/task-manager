const express = require('express');
const app = express();
//  const router = new express.Router();

require('dotenv').config();

const userRouter = require('./router/userRoutes')
const taskRouter = require('./router/taskRoutes')

require('./db/mongoose');

const port = process.env.PORT

app.use(express.json());
app.use(userRouter); 
app.use(taskRouter);

app.listen(port, () => {
    console.log('Server is up on Port : ' + port);    
}) 

