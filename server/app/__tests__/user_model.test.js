process.env.NODE_ENV = "test";
// process.env.PORT = "8083"


const app = require('../../server');
const db = require('../../models');
const request = require('supertest');
const constants = require('../controller/constants')
const testUser = {
    firstname: "fsdfdsf",
    lastname: "fdsffdf",
    email: "ahmad@gmail.com",
    password:"ahmad"
}
let token;
describe('Test the root path', () => {
    jest.setTimeout(1000)
    test('It should response the POST method signup', async (done) => {
        const response = await request(app).post('/signUp').send(testUser);
        expect(response.status).toBe(201);
        expect(response.body.message).toEqual(constants.USER_CREATED)
        expect(response.body.user.email).toEqual(testUser.email)
        done()
    });
    test('It should response email already exist', async (done) => {
        const response = await request(app).post('/signUp').send(testUser);
        expect(response.status).toBe(400);
        expect(response.body).toEqual(constants.ERROR_EMAIL_EXIST)
        done()
    });
    test('It should response the POST method login', async (done) => {
        const response = await request(app).post('/login').send({
            email: "ahmad@gmail.com",
            password: "ahmad"
        })   
        token = response.body.data.token;   
                expect(response.status).toBe(201);
                expect(response.body.message).toEqual(constants.SUCCESS_EMAIL_VERIFIED)
                expect(token).toBeDefined()
                done()
            });
    test('it should response for invalid password', async (done) => {
        const response = await request(app).post('/login').send({
            email: "ahmad@gmail.com",
            password: "ahmad123"
        })
        expect(response.status).toBe(400);
        done()
    })

    //it should response user exist or not

    test('it should response for user existance', async (done) => {
        const response = await request(app).post('/login').send({
            email: "ahmad123@gmail.com",
            password: "ahmad"
        })
        expect(response.status).toBe(400);
        done()
    })

    // it will test to get all users list 
    
    test('it should response all users', async (done) =>{
        const response = await request(app).get('/api/user/list');
        expect(response.status).toBe(200)
        expect(response.body.length).toBe(1)
        done()

    })

    // it will test specific users list 

    test('it should response all users', async (done) =>{
        const query = {limit:1, where : {email: "ahmad@gmail.com"}}
        const url = JSON.stringify(query)
        const response = await request(app).get('/api/user/list?filter='+url);
        expect(response.status).toBe(200)
        expect(response.body.length).toBe(1)
        done()

    })

    afterAll((done) => {
          db.User.destroy({ where: {
            email: 'ahmad@gmail.com'
          }}).then(() => done())
          
      })
})


