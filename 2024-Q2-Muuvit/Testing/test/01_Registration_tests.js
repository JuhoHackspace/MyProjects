let chai = require('chai');
let chaiHttp = require('chai-http');
require('dotenv').config();

chai.use(chaiHttp)

var jwt = ''

describe('POST Create account tests', () => {


    it('should return 400 status code and a message "Username or password missing" when succesfull', (done) => {
        chai.request(process.env.BACKEND_URL)
            .post('/user/createAccount')
            .send({
                userName: '',
                password: ''
            }).end((err, res) => {
//                console.log(res)
                chai.expect(res).to.have.status(400);
                chai.expect(res.text).to.be.a('string').equal('Username or password missing');
                done();
            });
    });

    it('should return 400 status code and a message "Username or password missing" when succesfull', (done) => {
        chai.request(process.env.BACKEND_URL)
            .post('/user/createAccount')
            .send({
                userName: 'A',
                password: ''
            }).end((err, res) => {
//                console.log(res)
                chai.expect(res).to.have.status(400);
                chai.expect(res.text).to.be.a('string').equal('Username or password missing');
                done();
            });
    });

    it('should return 400 status code and a message "Username or password missing" when succesfull', (done) => {
        chai.request(process.env.BACKEND_URL)
            .post('/user/createAccount')
            .send({
                userName: '',
                password: 'Vornankoski'
            }).end((err, res) => {
//                console.log(res)
                chai.expect(res).to.have.status(400);
                chai.expect(res.text).to.be.a('string').equal('Username or password missing');
                done();
            });
    });

    it('should return 400 status code and a message "Password too short" when succesfull', (done) => {
        chai.request(process.env.BACKEND_URL)
            .post('/user/createAccount')
            .send({
                userName: 'A',
                password: 'A'
            }).end((err, res) => {
//                console.log(res)
                chai.expect(res).to.have.status(400);
                chai.expect(res.text).to.be.a('string').equal('Password too short');
                done();
            });
    });


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

    it('should return 400 status code and a message "Username already exists" when succesfull', (done) => {
        chai.request(process.env.BACKEND_URL)
            .post('/user/createAccount')
            .send({
                userName: process.env.USERNAME,
                password: process.env.PASSWORD
            }).end((err, res) => {
                chai.expect(res).to.have.status(400);
                chai.expect(res.text).to.be.a('string').equal('Username already exists');
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
//            console.error('\n'+ res.text +'\n');
            jwt='bearer ' + res.text;
//            console.log(jwt);
                chai.expect(res).to.have.status(200);
                chai.expect(res.text).to.be.a('string').with.lengthOf.above(25);
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
