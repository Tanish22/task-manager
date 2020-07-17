const request = require('supertest');
const app = require('../src/app');
const mongoose= require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../src/models/user');

const user1Id = mongoose.Types.ObjectId();

const user1 = {
    _id : user1Id,
    name : 'andrew mead',
    email : 'andrew@mead.com',
    password : 'andrewmead',
    tokens : [{
        token : jwt.sign({_id : user1Id}, process.env.JWT_SECRET)
    }]
}

/*   as beforeEach function runs before each test function, the database is emptied and new user is added to the database just to
     start doing things on an even field to avoid conflicts.    */
beforeEach(async () => {
    await User.deleteMany()
    await new User(user1).save()
})

test('should signup new user', async () => {
    await request(app).post('/users/signup').send({
        name : 'tanish gupte',
        email : 'tanish@gupte.com',
        password : 'tanishgupte'
    }).expect(201)
}) 

test('should enable a user to login', async () => {
    await request(app)
    .post('/users/login')
    .send({
        email : user1.email,
        password : user1.password
    })
    .expect(200)
})

test('should not login nonexistent user', async () => {
    await request(app)
      .post('/users/login')
      .send({
        email : user1.email,
        password : 'tanshgupte',
      })
      .expect(400);
})

test('should get profile for the user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200)
})

test('should not get profile for the user', async () => {
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('should delete account for the user', async () => {
    await request(app)
      .delete("/users/me")
      .set("Authorization", `Bearer ${user1.tokens[0].token}`)
      .send()
      .expect(200);
})

test('should not delete an account for an unauthorized user', async () => {
     await request(app)
       .delete("/users/me")
       //   .set("Authorization", `Bearer ${user1.tokens[0].token}`)
       .send()
       .expect(401);
})