process.env.NODE_ENV = "test";
process.env.PORT = "8082"

const app = require('../../server');
const db = require('../../models');
const request = require('supertest');
const constants = require('../controller/constants')
const testUser = {
    firstname: "fsdfdsf",
    lastname: "fdsffdf",
    email: "user@gmail.com",
    password:"ahmad"
}

describe('Test the root path', () => {
    jest.setTimeout(1000)
    test('It should response the POST method to user', async (done) => {
        const response = await request(app).post('/api/user').send(testUser);
        expect(response.status).toBe(200);
        console.log('the response body id',response.body)
        // expect(response.body.message).toEqual(constants.USER_CREATED)
        // expect(response.body.user.email).toEqual(testUser.email)
        done()
    });
    afterAll((done) => {
        db.User.destroy({ where: {
          email: 'user@gmail.com'
        }}).then(() => done())
        
    })
})
