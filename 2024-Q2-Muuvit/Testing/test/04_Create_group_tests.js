let chai = require('chai');
let chaiHttp = require('chai-http');
require('dotenv').config();

chai.use(chaiHttp);

var jwt = ''
var testGroupId = ''


describe('POST create  group tests', () => {

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
                    chai.expect(res).to.have.status(200);
                    chai.expect(res.text).to.be.a('string').with.lengthOf.above(25);
                    done();
                });
        });

    it('should return 200 status code and a message "created" when succesfull', (done) => {
        chai.request(process.env.BACKEND_URL)
            .post('/group/private/create')
            .set({ Authorization: jwt  })
            .send({
                groupName: 'Mocha testgroup22',
                description: 'Tämä on käyttäjän Tauno luoma testiryyhmä'
            }).end((err, res) => {
                testGroupId = res._body.groupId
                chai.expect(res).to.have.status(200);
                chai.expect(res._body.msg).to.be.a('string').equal('Created');
                done();
            });
    });

    it('should return 400 status code and a message "Error creating group. Maybe it already exists?" when succesfull', (done) => {
        chai.request(process.env.BACKEND_URL)
            .post('/group/private/create')
            .set({ Authorization: jwt  })
            .send({
                groupName: 'Mocha testgroup22',
                description: 'Tämä on käyttäjän Tauno luoma testiryyhmä'
            }).end((err, res) => {
                chai.expect(res).to.have.status(400);
                chai.expect(res._body.msg).to.be.a('string').equal('Virhe luotaessa ryhmää. Ehkä se on jo olemassa?');
                done();
            });
    });

    it('should return 403 status code and a message "Forbidden access!" when succesfull', (done) => {
        chai.request(process.env.BACKEND_URL)
            .post('/group/private/create')
            .set({ Authorization: 'bearer höpöhöpö jWT'  })
            .send({
                groupName: 'Mocha testgroup2',
                description: 'Tämä on käyttäjän Tauno luoma testiryyhmä'
            }).end((err, res) => {
                chai.expect(res).to.have.status(403);
                chai.expect(res.text).to.be.a('string').equal('Forbidden access!');
                done();
            });
    });

    it('should return 200 status code and a message "Deleted" when succesfull', (done) => {
        chai.request(process.env.BACKEND_URL)
            .delete('/group/private/deleteGroup/' + testGroupId)
            .set({ Authorization: jwt  })
            .end((err, res) => {
                chai.expect(res).to.have.status(200);
                chai.expect(res.text).to.be.a('string').include('200 - poisto onnistui');
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

})

