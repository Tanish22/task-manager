/*  this module is structured in a way to facilitate normal API calls to the endpoints defined in the API by moving the "require" statements 
    solely for the purpose of separating the app.listen call from jest testing http reqs using supertest   */
    
const app = require('./app');

const port = process.env.PORT

app.listen(port, () => {
    console.log('Server is up on Port : ' + port);    
}) 

