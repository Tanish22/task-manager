/*   structured to just house the necessary files (routes and models) without the app.listen call to facilitate jest testing
     http reqs using supertest that require express for routing etc    */

     /*   THIS STRUCTURE ALLOWS EACH OF THE TEST FILE TO START ITS OWN SERVER   */

const express = require("express");
const app = express();
//  const router = new express.Router();

const userRouter = require("./router/userRoutes");
const taskRouter = require("./router/taskRoutes");

require("./db/mongoose");

const port = process.env.PORT;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

module.exports = app