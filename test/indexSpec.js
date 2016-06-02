let app = require('../index')
let request = require('supertest')
let expect = require('chai').expect
let mongoose = require('mongoose')
const createDocument = require('./helpers/objectCreation').createDocument

describe('API', function() {
  before(function(done) {
    for (var i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove(function() {});
    }
    return done();
  });
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
	  console.log(err)
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
    it.skip('should have an author', function(done) {
      request(app)
	.post('/api/users')
	.send({username: "samothrace", password: "12345678"})
	.set('Accept', 'application/json')
	.expect('Content-Type', /json/)
	.expect(200)
	.end(function(err, res) {
          if (err) {
            console.log(err);
	  }
	  expect(err).to.be.null;
	  const user = res.body;
	  const userId = user._id;
	  request(app)
	    .post('/api/posts')
	    .send({author: userId, title: 'cruel awake', content: 'LORDS THEN FALL, TAKINGS, LEFT TO FAIL, BROKEN PRAISE'})
	    .set('Accept', 'application/json')
	    .expect('Content-Type', /json/)
	    .expect(200)
	    .end(function(err, res) {
	      if (err) {
                console.log(err);
	      }
	      expect(err).to.be.null;
	      const postId = res.body._id;
              expect(res.body.author).to.be.equal(userId);
	      request(app)
                .get(`/api/posts/${postId}`)
		.set('Accept', 'application/json')
		.expect('Content-Type', /json/)
		.expect(200)
		.end(function(err, res) {
                  if (err) {
                    console.log(err)
		  }
		  expect(err).to.be.null;
		  expect(res.body.author).to.be.an('object');
		  expect(res.body.author._id).to.equal(userId);
		  done();
		});
	    })
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
    it('requires auth to delete a post', function(done) {
      let post = {title: 'Whip-por-will', content: `I got my window open in the southern cross hotel
it's been my longest night I can tell
by the way I'm not surprised
to see the desert cover over paradise`}
      createDocument(require('../api/post/postModel'), post)
      .then(function (post) {
	request(app)
          .delete(`/api/posts/${post._id}`)
	  .set('Accept', 'application/json')
	  .expect(401, done)
      });
    });
    it.skip('should delete a post', function(done) {
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
  describe('USERS', function() {
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
    it('should create a user', function(done) {
      request(app)
	.post('/api/users')
	.send({username: "Smokin' Willie", password: "12345678"})
	.set('Accept', 'application/json')
	.expect('Content-Type', /json/)
	.expect(200)
	.end(function(err, res) {
	  expect(err).to.be.null
	  expect(res.body.token).to.be.a('string')
	  done()
	})
    })
  })
  describe('AUTH', function(done) {
    it('requires a username and password', function(done) {
      request(app)
	.post('/auth/signin')
	.send({})
	.expect(400)
	.end(function(err, res) {
          request(app)
            .post('/auth/signin')
            .send({username: ""})
            .expect(400)
            .end(function(err, res) {
              request(app)
        	.post('/auth/signin')
        	.send({password: '1234'})
        	.expect(400)
        	.end(function(err, res) {
                  done()
		})
	    })
      	})
    })
    it('requires a valid username', function(done) {
      request(app)
	.post('/auth/signin')
	.send({username: 'Bo Diddley', password: '1234'})
	.expect(401)
	.end(function(err, res) {
	  expect(res.text).to.equal('Invalid username or password');
	  done()
	})
    });
    it('returns a token on signin', function(done) {
      request(app)
	.post('/api/users')
	.send({username: 'rangda', password: 'formerly-extinct'})
	.set('Accept', 'application/json')
	.expect('Content-Type', /json/)
	.expect(200)
	.end(function(err, res) {
          expect(err).to.be.null
	  request(app)
	    .post('/auth/signin')
	    .send({username: 'rangda', password: 'formerly-extinct'})
	    .set('Accept', 'application/json')
	    .expect('Content-Type', /json/)
	    .expect(200)
	    .end(function(err, res) {
              expect(err).to.be.null
	      expect(res.body.username).to.be.undefined
	      expect(res.body.password).to.be.undefined
	      expect(res.body.token).to.be.a('string')
	      done()
	    })
	})
    });
    it('returns a token for the client to consume', function(done) {
      request(app)
	.post('/api/users')
	.send({username: 'Sir Richard Bishop', password: 'intermezzo'})
	.set('Accept', 'application/json')
	.expect('Content-Type', /json/)
	.expect(200)
	.end(function(err, res) {
          expect(err).to.be.null
	  request(app)
	    .post('/auth/signin')
	    .send({username: 'Sir Richard Bishop', password: 'intermezzo'})
	    .set('Accept', 'application/json')
	    .expect('Content-Type', /json/)
	    .expect(200)
	    .end(function(err, res) {
              expect(err).to.be.null
	      expect(res.body.token).to.be.a('string')
	      done()
	    })
	})
    });
  })
})
