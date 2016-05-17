let router = require('express').Router();

let posts = require('./post/postRoutes');
let categories = require('./category/categoryRoutes');
let users = require('./user/userRoutes');

router.use('/posts', posts);
router.use('/categories', categories);
router.use('/users', users);

module.exports = router;
