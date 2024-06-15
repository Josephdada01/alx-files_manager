// Inside the folder routes, create a file index.js that contains all endpoints of our API:
// GET /status => AppController.getStatus
// GET /stats => AppController.getStats
const express = require('express');
const router = express.Router();
const AppController = require('../controllers/AppController');

// definning the routes
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

module.exports = router;
