let chai = require('chai');
let chaiHttp = require('chai-http');
require('dotenv').config();

chai.use(chaiHttp);

var jwt = ''



describe('DELETE delete account tests', () => {

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

        it('should return 403 status code and a message "Forbidden access!" when succesfull', (done) => {
            chai.request(process.env.BACKEND_URL)
                .delete('/user/private/deleteAccount')
                .set({ Authorization: 'hölynply'  })
                .end((err, res) => {
                    chai.expect(res).to.have.status(403);
                    chai.expect(res.text).to.be.a('string').include('Forbidden access!');
                    done();
            });
        });

        it('should return 404 status code and a message "Not Found" when succesfull', (done) => {
            chai.request(process.env.BACKEND_URL)
                .delete('/user/private/deleteXXX')
                .set({ Authorization: jwt  })
                .end((err, res) => {
                    chai.expect(res).to.have.status(404);
                    chai.expect(res._body.error).to.be.a('string').include('Not Found');
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
