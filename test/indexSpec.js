let app = require('../index')
let request = require('supertest')
let expect = require('chai').expect

describe('API', function() {
  describe('POSTS', function() {
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
    });
    it('should get one post', function(done) {
      request(app)
        .post('/api/posts')
	.send({title: 'hello mother leopard', content: 'i have your cubs'})
        .set('Accept', 'application/json')
        .end(function(err, res) {
          const postId = res.body._id;
          request(app).get(`/api/posts/${postId}`)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
	    if (err) {console.log(err)}
            expect(res.body).to.be.an('object');
            expect(res.body._id).to.equal(postId);
            done();
          })
        });
    });
    it('should return a not found error on get one post', function(done) {
      request(app)
	.get('/api/posts/hexadic')
	.set('Accept', 'application/json')
	.expect(404)
	.end(function(err, res) {
          expect(res.text).to.equal('Post not found');
	  done();
	})
    });
    it('should create a post', function(done) {
      request(app)
	.post('/api/posts')
	.send({title: "don't let your silly dreams", content: 'fall in between the crack of the bed and the wall'})
	.set('Accept', 'application/json')
	.expect('Content-Type', /json/)
	.expect(201)
	.end(function(err, res) {
          expect(res.body).to.be.an('object');
	  expect(res.body.title).to.equal("don't let your silly dreams");
	  done();
	});
    });
    it('should update a post', function(done) {
      request(app)
	.post('/api/posts')
	.send({title: "i should blame you now, but i never could somehow",
		content: "for a miner's wife you weren't cut out to be"})
	.set('Accept', 'application/json')
	.expect('Content-Type', /json/)
	.expect(201)
	.end(function(err, res) {
          const postId = res.body._id;
	  request(app)
	    .put(`/api/posts/${postId}`)
	    .send({content: "a miner's wife you weren't cut out to be"})
            .set('Accept', 'application/json')
	    .expect('Content-Type', /json/)
	    .expect(200)
	    .end(function(err, res) {
	      if (err) {console.log(err)};
              expect(res.body).to.be.an('object');
              expect(res.body.content).to.equal("a miner's wife you weren't cut out to be");
	      expect(res.body).to.include.key('title');
	      done();
	    });
	});
    });
    it('should delete a post', function(done) {
      request(app)
	.post('/api/posts')
	.send({title: "as soon as you're born they make you feel small",
		content: "by giving you no time instead of it all"})
	.set('Accept', 'application/json')
	.expect('Content-Type', /json/)
	.expect(200)
	.end(function(err, res) {
          const postId = res.body._id;
	  request(app)
	    .delete(`/api/posts/${res.body._id}`)
	    .set('Accept', 'application/json')
	    .expect('Content-Type', /json/)
	    .expect(200)
	    .end(function(err, res) {
	      expect(err).to.be.null;
	      if (err) { console.log(err) }
              expect(res.body).to.be.an('object');
	      request(app)
		.get(`/api/posts/${postId}`)
		.set('Accept', 'application/json')
		.expect('Content-Type', /json/)
		.expect(404)
		.end(function(err, res) {
		  expect(err).not.to.be.null;
                  expect(res.text).to.equal("Post not found");
		  done();
		});
	    })
	})
    });
  });
  it('should get all categories', function(done) {
    request(app)
      .get('/api/categories')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        expect(res.body).to.be.an('array')
        done()
      })
  })
  it('should get all users', function(done) {
    request(app)
      .get('/api/users')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        expect(res.body).to.be.an('array')
	done()
      })
  })
})
