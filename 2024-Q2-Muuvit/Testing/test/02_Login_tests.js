let chai = require('chai');
let chaiHttp = require('chai-http');

require('dotenv').config();
chai.use(chaiHttp);

var jwt = ''


describe('POST Login tests', () => {
    
    it('should return 200 status code and a message "Account created" when succesfull', (done) => {
        chai.request(process.env.BACKEND_URL)
            .post('/user/createAccount')
            .send({
                userName: process.env.USERNAME,
                password: process.env.PASSWORD
            }).end((err, res) => {
                chai.expect(res).to.have.status(200);
                chai.expect(res.text).to.be.a('string').equal('Account created');
                done();
            });
    });

    it('should return 200 status code and a token when succesfull', (done) => {
        chai.request(process.env.BACKEND_URL)
            .post('/auth/login')
            .send({
                userName: process.env.USERNAME,
                password: process.env.PASSWORD
            }).end((err, res) => {
                jwt='bearer ' + res.text;
//              console.error(res.text);
                chai.expect(res).to.have.status(200);
                chai.expect(res.text).to.be.a('string').with.lengthOf.above(25);
                done();
            });
    });
    it('should return 401 status code and a message "Invalid password" ', (done) => {
        chai.request(process.env.BACKEND_URL)
            .post('/auth/login')
            .send({
                userName: process.env.USERNAME,
                password: 'vääräsalasana'
            }).end((err, res) => {
                chai.expect(res).to.have.status(401);
                chai.expect(res.text).to.be.a('string').equal('Invalid password');
                done();
            });
    });
    it('should return 400 status code and a message "User not found"', (done) => {
        chai.request(process.env.BACKEND_URL)
            .post('/auth/login')
            .send({
                userName: 'HerraTasavallanPresidentti',
                password: process.env.PASSWORD
            }).end((err, res) => {
                chai.expect(res).to.have.status(400);
                chai.expect(res.text).to.be.a('string').equal('User not found');
                done();
            });
    });
    it('should return 400 status code and a message "Username or password missing"', (done) => {
        chai.request(process.env.BACKEND_URL)
            .post('/auth/login')
            .send({
                userName: '',
                password: process.env.PASSWORD
            }).end((err, res) => {
                chai.expect(res).to.have.status(400);
                chai.expect(res.text).to.be.a('string').equal('Username or password missing');
                done();
            });
    });

    it('should return 200 status code and a message "Deleted" when succesfull', (done) => {
        chai.request(process.env.BACKEND_URL)
            .delete('/user/private/deleteAccount')
            .set({ Authorization: jwt  })
            .end((err, res) => {
                chai.expect(res).to.have.status(200);
                chai.expect(res.text).to.be.a('string').include('Account deleted');
                done();
        });
    });

});


