exports.createDocument = function(model, data) {
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
