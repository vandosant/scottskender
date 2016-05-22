if (self.fetch) {
  fetch('/api/posts')
    .then(function (res) {
        if (res.status === 200) {
	  return res.json();
	}
    })
    .then(function (json) {
      console.log(json);
    });
}
