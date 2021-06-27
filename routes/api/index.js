//acquiring the express library
const express = require("express");

//acquiring the functionality of express.Router
const router = express.Router();


router.use('/v1',require('./v1'));

router.use('/v2',require('./v2'));

module.exports = router;