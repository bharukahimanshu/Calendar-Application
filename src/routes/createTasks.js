const express = require('express');
const router = express.Router();
const createTask = require('../controllers/createTask');


router.post('/create-task', createTask);

module.exports=router;
