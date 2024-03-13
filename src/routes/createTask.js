const express = require('express');
const router = express.Router();
const createTask = require('../controllers/createTask');
// Route for creating a new task
router.post('/create-task', createTask);

module.exports = router;
