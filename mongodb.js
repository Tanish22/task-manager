    //  requiring dependencies
// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;

    //  destructuring dependencies

const { MongoClient, ObjectID } = require('mongodb');

    //  connecting to the localhost server (mongod)
const connectionURL = 'mongodb://127.0.0.1:27017';
const dbName = 'task-manager';

    //  ObjectID
const id = new ObjectID();
console.log(id);

console.log(id.getTimestamp());

    //  making a connection to the db
MongoClient.connect(connectionURL, { useNewUrlParser : true }, (error, client) => {
    if(error){
        return console.log('Unable to connect to the db');        
    }

    const db = client.db(dbName);   //  referencing to the database
    
    // db.collection('users').insertOne({
    //     name : 'Tanish',
    //     age : 30
    // }, (error, result) => {
    //     if(error){
    //         return console.log('Unable to insert user');            
    //     }

    //     console.log(result.ops);        
    // });

    // db.collection('tasks').insertMany([
    //     {
    //         description : 'Get up early',
    //         completed : true    
    //     },
    //     {
    //         description : 'Study',
    //         completed : true
    //     },
    //     {
    //         description : 'Go and workout',
    //         completed : false
    //     }
    // ], (error, result) => {
    //     if(error){
    //         return console.log('Cannot insert tasks');            
    //     }

    //     console.log(result.ops);        
    // })

    db.collection('tasks').updateMany({
        completed : false
    },{
        $set : {
            completed : true 
        }
    }).then((result) => {
        console.log(result.modifiedCount);        
    }).catch((error) => {
        console.log(error);        
    })
}) 

