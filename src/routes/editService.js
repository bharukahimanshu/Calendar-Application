const express = require('express');
const router = express.Router();
const editService = require('../controllers/editService');

router.put('/edit-service/:serviceId', editService);
    
module.exports = router;
