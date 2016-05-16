let app = require('../index')
let request = require('supertest')
let expect = require('chai').expect

describe('API', function() {
  it('should get all posts', function(done) {
    request(app)
      .get('/api/posts')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        expect(res.body).to.be.an('array')
	done()
      })
  })

})
