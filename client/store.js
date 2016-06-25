const Posts = require('./postModel')
let state = {
  posts: []
};

function promise () {
  let pr = new Promise(function (resolve, reject) {
    Posts.load()
    .then(function(posts) {
      state = Object.assign(state, {posts})
      resolve(state);
    })
    .catch(function(err) {
      reject(err);
    })
  })
  return pr;
}

function getState() { return state }

module.exports = {
  load: promise,
  getState: getState
}
