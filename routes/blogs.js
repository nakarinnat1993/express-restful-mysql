const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

/* GET blogs listing. */
router.get('/', blogController.index);

module.exports = router;
