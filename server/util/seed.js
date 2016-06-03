let User = require('../api/user/userModel')
let Post = require('../api/post/postModel')

const posts = [
  {title: 'Whip-por-will', content: `I got my window open in the southern cross hotel
it's been my longest night I can tell
by the way I'm not surprised
to see the desert cover over paradise`},
  {title: 'North Star Blues', content: `Where were the rest of my songs tonight
I only remember the North Star blues
That simple old tune on the stage each night
Marking the time that I lost you`},
  {title: 'Blue Factory Flame', content: `When i die put my bones in an empty street to remind me of how it used to be.
don’t write my name on a stone, bring a Coleman lantern and a radio,
Cleveland game and two fishing poles and watch with me from the shore
ghostly steel and iron ore ships coming home`}
]

const createDocument = function(model, data) {
  return new Promise(function(resolve, reject) {
    new model(data).save(function(err, doc) {
      if (err) {
        reject(err);
      } else {
        resolve(doc);
      }
    });
  });
};

const createPosts = function() {
  let newPosts = posts.map(function(post, i) {
    return createDocument(Post, post);
  });

  return Promise.all(newPosts);
};

const cleanDatabase = function() {
  let removalPromises = [User, Post].map(function(model) {
    return model.remove().exec();
  });
  return Promise.all(removalPromises);
};

cleanDatabase()
  .then(createPosts)
  .then(function(seedData) {
    console.log('Created seed data', seedData);
  })
  .catch(function(err) {
    console.error('Error seeding data', err);
  });
