require('es6-promise').polyfill();
require('isomorphic-fetch');

function load() {
  return new Promise(function (resolve, reject) {
    return fetch('http://localhost:8080/api/posts/')
    .then(function (res) {
        if (res.status === 200) {
          resolve(res.json());
        }
    })
    .catch(function (err) {
      reject(err);
    })
  });
};

var api = {
  load: load
}

module.exports = api;
