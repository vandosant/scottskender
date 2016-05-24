function load() {
    return fetch('/api/posts')
    .then(function (res) {
        if (res.status === 200) {
          return res.json();
        }
    })
};

var api = {
  load: load
}

module.exports = api;
