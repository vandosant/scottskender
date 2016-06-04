let app = require('../server/server')
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
    const Post = require('../server/api/post/postModel');
    const User = require('../server/api/user/userModel');
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
    it('requires auth to create a post', function(done) {
      request(app)
        .post(`/api/posts`)
	.send({title: "Joe's Garage", content: `It wasn't very large
There was just enough room to cram the drums
In the corner over by the Dodge
It was a fifty-four
With a mashed up door
And a cheesy little amp
With a sign on the front said "Fender Champ"
And a second hand guitar
It was a Stratocaster with a whammy bar`})
        .set('Accept', 'application/json')
        .expect(401, done)
    });
    it('requires a valid token to create a post', function (done) {
       request(app)
         .post('/api/posts')
         .send({title: "Joe's Garage", content: `It wasn't very large
           There was just enough room to cram the drums
           In the corner over by the Dodge
           It was a fifty-four
           With a mashed up door
           And a cheesy little amp
           With a sign on the front said "Fender Champ"
           And a second hand guitar
           It was a Stratocaster with a whammy bar`})
	 .set('Accept', 'application/json')
         .set('Authorization', 'Bearer xyz')
         .expect(401, done)
    });
    it('requires a valid user to create a post', function (done) {
      createDocument(User, {username: 'frank zappa', password: 'dweezil'})
        .then(function (user) {
          request(app)
            .post('/auth/signin')
            .send({username: 'frank zappa', password: 'dweezil'})
            .expect(200)
            .end(function (err, res) {
              User.remove({_id: user._id}, function(err, removed) {
    	        request(app)
    	          .post('/api/posts')
                  .send({title: "Joe's Garage", content: `It wasn't very large
There was just enough room to cram the drums
In the corner over by the Dodge
It was a fifty-four
With a mashed up door
And a cheesy little amp
With a sign on the front said "Fender Champ"
And a second hand guitar
It was a Stratocaster with a whammy bar`})
	          .set('Accept', 'application/json')
    	          .set('Authorization', `Bearer ${res.body.token}`)
    	          .expect(401, done)
              })
	    })
        })
    });
    it('should create a post with an author', function(done) {
      createDocument(User, {username: 'arlo guthrie', password: 'alice'})
      .then(function (user) {
	request(app)
	  .post('/auth/signin')
	  .send({username: 'arlo guthrie', password: 'alice'})
	  .end(function(err, res) {
            request(app)
              .post('/api/posts')
              .send({title: "don't let your silly dreams", content: 'fall in between the crack of the bed and the wall'})
              .set('Accept', 'application/json')
              .set('Authorization', `Bearer ${res.body.token}`)
              .expect('Content-Type', /json/)
              .expect(201)
              .end(function(err, res) {
                expect(res.body).to.be.an('object');
                expect(res.body.title).to.equal("don't let your silly dreams");
                expect(res.body.author).to.eql(user._id.toString());
                done();
	      });
	  });
      });
    });
    it('should update a post', function(done) {
      createDocument(Post, {title: "i should blame you now, but i never could somehow",
	content: "for a miner's wife you weren't cut out to be"})
	.then(function(post) {
	  request(app)
	    .put(`/api/posts/${post._id}`)
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
      createDocument(Post, {title: 'Whip-por-will',
        content: `I got my window open in the southern cross hotel
it's been my longest night I can tell
by the way I'm not surprised
to see the desert cover over paradise`})
      .then(function (post) {
	request(app)
          .delete(`/api/posts/${post._id}`)
	  .set('Accept', 'application/json')
	  .expect(401, done)
      });
    });
    it('requires a valid token to delete a post', function (done) {
      createDocument(Post, {
        title: 'The Ocean Nerves',
        content: 'This place is trouble waiting, The light hangs so weakly on to the quiet, Drag myself in a long line'
      })
        .then(function (post) {
          request(app)
            .delete(`/api/posts/${post._id}`)
            .set('Authorization', 'Bearer xyz')
            .expect(401, done)
        })
    });
    it('requires a valid user to delete a post', function (done) {
      createDocument(require('../server/api/user/userModel'), {username: 'frank zappa', password: 'dweezil'})
        .then(function (user) {
          createDocument(Post, {
            title: "I am the slime",
            content: `I am gross and perverted. I'm obsessed 'n deranged. I have existed for years, but very little had changed. I am the tool of the Government and industry too, for I am destined to rule and regulate you. I may be vile and pernicious, but you can't look away. I make you think I'm delicious, with the stuff that I say. I am the best you can get. Have you guessed me yet?`,
            author: user._id
          })
	    .then(function (post) {
              request(app)
                .post('/auth/signin')
                .send({username: 'frank zappa', password: 'dweezil'})
                .expect(200)
                .end(function (err, res) {
                  User.remove({_id: user._id}, function(err, removed) {
		    request(app)
		      .delete(`/api/posts/${post._id}`)
		      .set('Authorization', `Bearer ${res.body.token}`)
		      .expect(401, done)
		  })
		})
	    })
	})
    })
    it('should delete a post', function (done) {
      createDocument(require('../server/api/user/userModel'), {username: 'jim james', password: 'yim yames'})
        .then(function (user) {
          createDocument(Post, {
            title: "as soon as you're born they make you feel small",
            content: "by giving you no time instead of it all",
            author: user._id
          })
            .then(function (post) {
              const postId = post._id;
              request(app)
                .post('/auth/signin')
                .send({username: 'jim james', password: 'yim yames'})
                .expect(200)
                .end(function (err, res) {
                  request(app)
                    .delete(`/api/posts/${postId}`)
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${res.body.token}`)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function (err, res) {
                      expect(err).to.be.null;
                      if (err) {
                        console.log(err)
                      }
                      expect(res.body).to.be.an('object');
                      request(app)
                        .get(`/api/posts/${postId}`)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(404)
                        .end(function (err, res) {
                          expect(err).not.to.be.null;
                          expect(res.text).to.equal("Post not found");
                          done();
                        });
                    })
                })
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
