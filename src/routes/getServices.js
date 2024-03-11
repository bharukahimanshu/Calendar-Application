const express = require('express');
const router = express.Router();
const getServices = require("../controllers/getServices");

router.get('/getServices', getServices);

module.exports = router;
