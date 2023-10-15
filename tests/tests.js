import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);

const should = chai.should();

const baseURL = 'http://localhost:3000';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2vySWQiOiI3MTE5MjQ2MDQyNzE3NDAyMjA3IiwiaWF0IjoxNjk3MzYwNTI1fQ.sLPk28XNmoSeZU9OTXSIX5RB0Tx-IvRX0zBHwFGd7GI';

describe('Endpoint Tests', () => {
  // Test the /v1/role endpoint
  describe('/v1/role', () => {
    it('should get roles', (done) => {
      chai
        .request(baseURL)
        .get('/v1/role')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.status.should.equal(true);
          done();
        });
    });
  });
});
